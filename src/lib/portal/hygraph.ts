// Reads news and events from a Hygraph content workspace through its public content API.
// Nothing here is needed until the HYGRAPH_ENDPOINT setting is filled in.

import { type ContentItem, type ContentKind } from './content';
import { decode, formatFrenchDate, frenchDateParts, toParagraphs, toText } from './text';
import { REQUEST_TIMEOUT, fallbackImage } from './wordpress';

const MODELS: Partial<Record<ContentKind, string[]>> = {
  actualites: ['actualites', 'news'],
  agenda: ['evenements', 'events'],
  annonces: ['annonces', 'announcements'],
  galeries: ['galeries', 'galleries'],
  videos: ['videos'],
};

const MINIMAL_FIELDS = 'slug title publishedAt';
const CORE_FIELDS = 'slug title summary body { html } cover { url } date publishedAt';
const CORE_GALLERY_FIELDS = `${CORE_FIELDS} gallery { url }`;
const EVENT_FIELDS = `${CORE_FIELDS} categorie ville lieu horaire`;
const EVENT_GALLERY_FIELDS = `${EVENT_FIELDS} gallery { url }`;
const ANNOUNCEMENT_FIELDS = `${CORE_FIELDS} statut`;
const ANNOUNCEMENT_GALLERY_FIELDS = `${CORE_GALLERY_FIELDS} statut`;
const ANNOUNCEMENT_DOCUMENT_FIELDS = `${ANNOUNCEMENT_GALLERY_FIELDS} documents { url fileName }`;
const VIDEO_FIELDS = `${CORE_FIELDS} duree`;
const VIDEO_GALLERY_FIELDS = `${CORE_GALLERY_FIELDS} duree`;

type HygraphRecord = {
  slug?: string | null;
  title?: string | null;
  summary?: string | null;
  body?: unknown;
  date?: string | null;
  publishedAt?: string | null;
  cover?: { url?: string | null; alternativeText?: string | null } | null;
  gallery?: Array<{ url?: string | null } | null> | null;
  documents?: Array<{ url?: string | null; fileName?: string | null } | null> | null;
  categorie?: string | null;
  category?: string | null;
  ville?: string | null;
  town?: string | null;
  lieu?: string | null;
  venue?: string | null;
  horaire?: string | null;
  time?: string | null;
  statut?: string | null;
  status?: string | null;
  duree?: string | null;
  duration?: string | null;
  sys?: { publishedAt?: string | null } | null;
};

// Keeps the workspace name between calls so a page view needs a single request.
const modelCache = new Map<string, string>();

export function resetHygraphModels(): void {
  modelCache.clear();
}

function modelsFor(kind: ContentKind, configured = ''): string[] {
  const configuredName = configured.trim();
  const defaults = MODELS[kind] ?? [];
  return configuredName && /^[_A-Za-z][_0-9A-Za-z]*$/.test(configuredName) ? [configuredName] : defaults;
}

async function fetchGraph(endpoint: string, query: string): Promise<{ data?: Record<string, unknown> | null; errors?: Array<{ message?: string }> }> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Hygraph request failed [${res.status}]`);
  return (await res.json()) as { data?: Record<string, unknown> | null; errors?: Array<{ message?: string }> };
}

function graphError(errors: Array<{ message?: string }> | undefined): string | null {
  const message = (errors ?? []).map((error) => error?.message ?? '').join(' ').trim();
  return message || null;
}

function recordsFrom(data: Record<string, unknown> | null | undefined, model: string): HygraphRecord[] | null {
  const records = data?.[model];
  return Array.isArray(records) ? (records as HygraphRecord[]) : null;
}

function queryFor(model: string, fields: string): string {
  return `{ ${model}(first: 24, stage: PUBLISHED, orderBy: publishedAt_DESC) { ${fields} } }`;
}

// Finds the workspace name that actually holds this section of the portal.
async function resolveModel(kind: ContentKind, endpoint: string, configured?: string): Promise<string | null> {
  const key = `${endpoint}:${kind}:${configured ?? ''}`;
  const cached = modelCache.get(key);
  if (cached) return cached;
  for (const model of modelsFor(kind, configured)) {
    try {
      const { data, errors } = await fetchGraph(endpoint, queryFor(model, MINIMAL_FIELDS));
      if (recordsFrom(data, model)) {
        modelCache.set(key, model);
        return model;
      }
      // The name exists but holds nothing yet: that is still the right workspace.
      if (!graphError(errors)) {
        modelCache.set(key, model);
        return model;
      }
    } catch {
      return null;
    }
  }
  return null;
}

async function queryRecords(model: string, endpoint: string, kind: ContentKind): Promise<HygraphRecord[]> {
  const variants = kind === 'agenda'
    ? [EVENT_GALLERY_FIELDS, EVENT_FIELDS, CORE_FIELDS, MINIMAL_FIELDS]
    : kind === 'annonces'
      ? [ANNOUNCEMENT_DOCUMENT_FIELDS, ANNOUNCEMENT_GALLERY_FIELDS, ANNOUNCEMENT_FIELDS, CORE_FIELDS, MINIMAL_FIELDS]
      : kind === 'videos'
        ? [VIDEO_GALLERY_FIELDS, VIDEO_FIELDS, CORE_FIELDS, MINIMAL_FIELDS]
        : [CORE_GALLERY_FIELDS, CORE_FIELDS, MINIMAL_FIELDS];
  let lastError = 'the content could not be read';
  for (const fields of variants) {
    const { data, errors } = await fetchGraph(endpoint, queryFor(model, fields));
    const records = recordsFrom(data, model);
    if (records) return records;
    lastError = graphError(errors) ?? lastError;
    if (!/schema|field|does not exist|Unknown type|undefined|selection/i.test(lastError)) break;
  }
  throw new Error(`Hygraph query failed for « ${model} »: ${lastError}`);
}

export function mapHygraphRecord(record: HygraphRecord, kind: ContentKind, index: number): ContentItem {
  const iso = typeof record.date === 'string' && record.date ? record.date : typeof record.publishedAt === 'string' && record.publishedAt ? record.publishedAt : record.sys?.publishedAt ?? '';
  const item: ContentItem = {
    slug: String(record.slug ?? '') || `hygraph-${index}`,
    title: toText(String(record.title ?? '')) || 'Sans titre',
    category: decode(String(record.categorie ?? record.category ?? '')) || 'Plateaux',
    date: iso ? formatFrenchDate(iso) : '',
    summary: toText(String(record.summary ?? '')),
    image: record.cover?.url || fallbackImage(index),
    body: toParagraphs(record.body && typeof record.body === 'object' && 'html' in record.body ? record.body.html : record.body),
  };
  const gallery = (record.gallery ?? []).map((asset) => asset?.url ?? '').filter((url) => url.startsWith('http'));
  if (gallery.length) item.gallery = gallery;
  const documents = (record.documents ?? []).map((asset) => asset?.url?.startsWith('http') ? { url: asset.url, name: toText(String(asset.fileName ?? '')) || 'Document PDF' } : null).filter((document): document is { url: string; name: string } => document !== null);
  if (documents.length) item.documents = documents;
  if (kind === 'annonces') {
    const status = decode(String(record.statut ?? record.status ?? ''));
    if (status) item.status = status;
  }
  if (kind === 'videos') {
    const duration = decode(String(record.duree ?? record.duration ?? ''));
    if (duration) item.duration = duration;
  }
  if (kind === 'agenda') {
    const town = decode(String(record.ville ?? record.town ?? ''));
    const time = decode(String(record.horaire ?? record.time ?? ''));
    if (town) item.location = town;
    if (time) item.time = time;
    const parts = frenchDateParts(iso);
    if (parts) {
      item.day = parts.day;
      item.month = parts.month;
    }
  }
  return item;
}

// Returns null whenever Hygraph holds nothing usable, so the portal can fall back quietly.
export async function loadFromHygraph(endpoint: string, kind: ContentKind, configuredModel?: string): Promise<ContentItem[] | null> {
  const model = await resolveModel(kind, endpoint, configuredModel);
  if (!model) return null;
  try {
    const records = await queryRecords(model, endpoint, kind);
    if (!records.length) return null;
    return records.map((record, index) => mapHygraphRecord(record, kind, index));
  } catch (error) {
    console.warn(`Hygraph indisponible pour « ${kind} » : ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

