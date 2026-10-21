// Reads news and events from a Hygraph content workspace through its public content API.
// Nothing here is needed until the HYGRAPH_ENDPOINT setting is filled in.

import { type ContentItem, type ContentKind } from './content';
import { decode, formatFrenchDate, frenchDateParts, toParagraphs, toText } from './text';
import { REQUEST_TIMEOUT, fallbackImage } from './wordpress';

const NEWS_MODELS = ['actualites', 'news'];
const EVENT_MODELS = ['evenements', 'events'];

const MINIMAL_FIELDS = 'slug title publishedAt';
const CORE_FIELDS = 'slug title summary body { html } cover { url } date publishedAt';
const EVENT_FIELDS = `${CORE_FIELDS} categorie ville lieu horaire`;

type HygraphRecord = {
  slug?: string | null;
  title?: string | null;
  summary?: string | null;
  body?: unknown;
  date?: string | null;
  publishedAt?: string | null;
  cover?: { url?: string | null; alternativeText?: string | null } | null;
  categorie?: string | null;
  category?: string | null;
  ville?: string | null;
  town?: string | null;
  lieu?: string | null;
  venue?: string | null;
  horaire?: string | null;
  time?: string | null;
  sys?: { publishedAt?: string | null } | null;
};

// Keeps the workspace name between calls so a page view needs a single request.
const modelCache = new Map<string, string>();

export function resetHygraphModels(): void {
  modelCache.clear();
}

function modelsFor(kind: ContentKind, configured = ''): string[] {
  const configuredName = configured.trim();
  const defaults = kind === 'actualites' ? NEWS_MODELS : EVENT_MODELS;
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
  const variants = kind === 'agenda' ? [EVENT_FIELDS, CORE_FIELDS, MINIMAL_FIELDS] : [CORE_FIELDS, MINIMAL_FIELDS];
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

