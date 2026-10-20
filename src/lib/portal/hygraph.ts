// Reads news and events from a Hygraph content workspace through its public content API.
// Nothing here is needed until the HYGRAPH_ENDPOINT setting is filled in.

import { type ContentItem, type ContentKind } from './content';
import { decode, formatFrenchDate, frenchDateParts, toParagraphs, toText } from './text';
import { REQUEST_TIMEOUT, fallbackImage } from './wordpress';

const NEWS_MODELS = ['actualites', 'news'];
const EVENT_MODELS = ['evenements', 'events'];

const MINIMAL_FIELDS = 'slug title sys { publishedAt }';
const CORE_FIELDS = 'slug title summary body cover { url alternativeText } date publishedAt sys { publishedAt }';
const EVENT_FIELDS = 'slug title summary body cover { url alternativeText } date publishedAt categorie category ville town lieu venue horaire time sys { publishedAt }';

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
const modelCache = new Map<ContentKind, string | null>();

export function resetHygraphModels(): void {
  modelCache.clear();
}

function modelsFor(kind: ContentKind, endpoint: string): string[] {
  const configured = (endpoint ? process.env[kind === 'actualites' ? 'HYGRAPH_NEWS_MODEL' : 'HYGRAPH_EVENT_MODEL'] : '') || '';
  const configuredName = configured.trim();
  const defaults = kind === 'actualites' ? NEWS_MODELS : EVENT_MODELS;
  return configuredName ? [configuredName, ...defaults.filter((name) => name !== configuredName)] : defaults;
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
  return `{ ${model}(limit: 24, orderBy: "date_DESC") { ${fields} } }`;
}

// Finds the workspace name that actually holds this section of the portal.
async function resolveModel(kind: ContentKind, endpoint: string): Promise<string | null> {
  if (modelCache.has(kind)) return modelCache.get(kind) ?? null;
  for (const model of modelsFor(kind, endpoint)) {
    try {
      const { data, errors } = await fetchGraph(endpoint, queryFor(model, MINIMAL_FIELDS));
      if (recordsFrom(data, model)) {
        modelCache.set(kind, model);
        return model;
      }
      // The name exists but holds nothing yet: that is still the right workspace.
      if (!graphError(errors)) {
        modelCache.set(kind, model);
        return model;
      }
    } catch {
      modelCache.set(kind, null);
      return null;
    }
  }
  modelCache.set(kind, null);
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
    if (!/schema|field|does not exist|Unknown type|undefined/i.test(lastError)) break;
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
    body: toParagraphs(record.body),
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
export async function loadFromHygraph(endpoint: string, kind: ContentKind): Promise<ContentItem[] | null> {
  const model = await resolveModel(kind, endpoint);
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

