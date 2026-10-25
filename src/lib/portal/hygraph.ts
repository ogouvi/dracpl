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

// French field names, as created in the regional Hygraph workspace.
const FR_MINIMAL = 'slug titre publishedAt';
const FR_CORE = 'slug titre sommaire contenue { html } cover { url } publishedAt';
const FR_FIELDS: Partial<Record<ContentKind, string[]>> = {
  actualites: [`${FR_CORE} publieLe galerie { url }`, `${FR_CORE} publieLe`, FR_CORE],
  agenda: [`${FR_CORE} publieLe date lieu horaire categories`, `${FR_CORE} date lieu horaire`, FR_CORE],
  annonces: [`${FR_CORE} date statut categorie gallery { url } documents { url fileName }`, `${FR_CORE} date statut`, FR_CORE],
  galeries: [`${FR_CORE} gallery { url }`, FR_CORE],
  videos: [`${FR_CORE} duree`, FR_CORE],
};

type Asset = { url?: string | null; fileName?: string | null } | null;

type HygraphRecord = {
  slug?: string | null;
  title?: string | null;
  titre?: string | null;
  summary?: string | null;
  sommaire?: string | null;
  body?: unknown;
  contenue?: unknown;
  date?: string | null;
  publieLe?: string | null;
  publishedAt?: string | null;
  cover?: { url?: string | null; alternativeText?: string | null } | null;
  gallery?: Asset[] | Asset;
  galerie?: Asset[] | Asset;
  documents?: Asset[] | Asset;
  categorie?: string | null;
  categories?: string | string[] | null;
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

function assets(value: Asset[] | Asset | undefined): Asset[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

// Turns a stored choice like « musiqueEtDanse » into « Musique et danse ».
function humanize(value: string): string {
  const spaced = value.replace(/([a-zà-ÿ])([A-ZÀ-Þ])/g, '$1 $2').replace(/[_-]+/g, ' ').toLowerCase().trim();
  return spaced ? spaced.charAt(0).toUpperCase() + spaced.slice(1) : '';
}

const ISO = /^\d{4}-\d{2}-\d{2}/;

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
  // Hygraph answers an unknown field with status 400 and a readable error list, which lets the next field variant be tried.
  if (!res.ok && res.status !== 400) throw new Error(`Hygraph request failed [${res.status}]`);
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
      let { data, errors } = await fetchGraph(endpoint, queryFor(model, MINIMAL_FIELDS));
      if (!recordsFrom(data, model)) ({ data, errors } = await fetchGraph(endpoint, queryFor(model, FR_MINIMAL)));
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
  const english = kind === 'agenda'
    ? [EVENT_GALLERY_FIELDS, EVENT_FIELDS, CORE_FIELDS, MINIMAL_FIELDS]
    : kind === 'annonces'
      ? [ANNOUNCEMENT_DOCUMENT_FIELDS, ANNOUNCEMENT_GALLERY_FIELDS, ANNOUNCEMENT_FIELDS, CORE_FIELDS, MINIMAL_FIELDS]
      : kind === 'videos'
        ? [VIDEO_GALLERY_FIELDS, VIDEO_FIELDS, CORE_FIELDS, MINIMAL_FIELDS]
        : [CORE_GALLERY_FIELDS, CORE_FIELDS, MINIMAL_FIELDS];
  const variants = [...english.slice(0, -1), ...(FR_FIELDS[kind] ?? []), MINIMAL_FIELDS, FR_MINIMAL];
  let lastError = 'the content could not be read';
  for (const fields of variants) {
    const { data, errors } = await fetchGraph(endpoint, queryFor(model, fields));
    const records = recordsFrom(data, model);
    if (records) return records;
    lastError = graphError(errors) ?? lastError;
    if (!/schema|field|does not exist|Unknown type|undefined|selection|cannot query/i.test(lastError)) break;
  }
  throw new Error(`Hygraph query failed for « ${model} »: ${lastError}`);
}

export function mapHygraphRecord(record: HygraphRecord, kind: ContentKind, index: number): ContentItem {
  const rawDate = String(record.date ?? '').trim();
  const iso = ISO.test(rawDate) ? rawDate : String(record.publieLe ?? '') || String(record.publishedAt ?? '') || (record.sys?.publishedAt ?? '');
  const rawCategory = Array.isArray(record.categories) ? record.categories[0] ?? '' : record.categories ?? '';
  const body = record.contenue ?? record.body;
  const item: ContentItem = {
    slug: String(record.slug ?? '') || `hygraph-${index}`,
    title: toText(String(record.titre ?? record.title ?? '')) || 'Sans titre',
    category: decode(String(record.categorie ?? record.category ?? '')) || humanize(String(rawCategory)) || 'Plateaux',
    date: iso ? formatFrenchDate(iso) : '',
    summary: toText(String(record.sommaire ?? record.summary ?? '')),
    image: record.cover?.url || fallbackImage(index),
    body: toParagraphs(body && typeof body === 'object' && 'html' in body ? (body as { html: unknown }).html : body),
  };
  const gallery = [...assets(record.galerie), ...assets(record.gallery)].map((asset) => asset?.url ?? '').filter((url) => url.startsWith('http'));
  if (gallery.length) item.gallery = gallery;
  const documents = assets(record.documents).map((asset) => asset?.url?.startsWith('http') ? { url: asset.url, name: toText(String(asset.fileName ?? '')) || 'Document' } : null).filter((document): document is { url: string; name: string } => document !== null);
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
    const town = decode(String(record.ville ?? record.town ?? record.lieu ?? ''));
    const time = decode(String(record.horaire ?? record.time ?? ''));
    if (town) item.location = town;
    if (time) item.time = time;
    const parts = ISO.test(rawDate) ? frenchDateParts(rawDate) : null;
    const typed = /^(\d{1,2})\s+([A-Za-zÀ-ÿ.]+)/.exec(rawDate);
    if (parts) {
      item.day = parts.day;
      item.month = parts.month;
    } else if (typed) {
      // An event date typed as text, e.g. « 07 Nov ».
      item.day = typed[1] ?? '';
      item.month = (typed[2] ?? '').toLowerCase();
      item.date = rawDate;
    } else {
      const fallback = frenchDateParts(iso);
      if (fallback) {
        item.day = fallback.day;
        item.month = fallback.month;
      }
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

