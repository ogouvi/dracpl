import { createServerFn } from '@tanstack/react-start';
import { content, images, type ContentItem, type ContentKind } from './content';

export type ContentSource = 'wordpress' | 'demo';
export type PortalResult = { items: ContentItem[]; source: ContentSource };

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const MONTHS_SHORT = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];

// Editorial rubrics that WordPress may supply. Each maps to one WordPress category slug.
const CATEGORY_SLUG: Partial<Record<ContentKind, string>> = { actualites: 'actualites', agenda: 'agenda' };
const FALLBACK_IMAGES = [images.dance, images.heritage, images.artisan, images.exhibition];
const OK_TTL = 60_000;
const EMPTY_TTL = 300_000;
const REQUEST_TIMEOUT = 2500;

type CacheEntry = { at: number; ttl: number; result: PortalResult };
const cache = new Map<ContentKind, CacheEntry>();

export type WpTerm = { taxonomy?: string; slug?: string; name?: string };
export type WpPost = {
  slug: string;
  date: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  acf?: Record<string, unknown>;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url?: string; alt_text?: string }>;
    'wp:term'?: Array<Array<WpTerm>>;
  };
};

function decode(value: string): string {
  if (!value) return '';
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&middot;/g, '·')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

export function toText(html: string): string {
  const safe = (html || '').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ');
  return decode(safe.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

export function toParagraphs(html: string): string[] {
  const parts = (html || '')
    .split(/<\/(?:p|div|h2|h3|h4|li|blockquote|figcaption|figure)>|<br\s*\/?>/i)
    .map(toText)
    .filter(Boolean);
  return parts.length ? parts : [toText(html)].filter(Boolean);
}

export function formatFrenchDate(value: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ]/.exec(value || '');
  if (!m) return (value || '').slice(0, 10);
  const month = MONTHS[Number(m[2]) - 1] ?? '';
  return `${Number(m[3])} ${month} ${m[1]}`;
}

export function mapWpPost(post: WpPost, kind: ContentKind, fallbackImage: string): ContentItem {
  const acf = post.acf ?? {};
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  const terms = (post._embedded?.['wp:term'] ?? []).flat();
  const category = terms.find((t) => t.taxonomy === 'category');
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(post.date || '');
  const item: ContentItem = {
    slug: post.slug,
    title: toText(post.title?.rendered ?? '') || 'Sans titre',
    category: decode(String(acf['categorie'] ?? category?.name ?? '')) || 'Plateaux',
    date: formatFrenchDate(post.date),
    summary: toText(post.excerpt?.rendered ?? '').replace(/\s*\[…\]\s*$/, ''),
    image: media?.source_url || fallbackImage,
    body: toParagraphs(post.content?.rendered ?? ''),
  };
  if (kind === 'agenda') {
    const town = decode(String(acf['ville'] ?? ''));
    const time = decode(String(acf['horaire'] ?? ''));
    if (town) item.location = town;
    if (time) item.time = time;
    if (iso) {
      item.day = iso[3] ?? '';
      item.month = MONTHS_SHORT[Number(iso[2]) - 1] ?? '';
    }
  }
  return item;
}

export function resolveResult(kind: ContentKind, posts: ContentItem[] | null): PortalResult {
  return posts && posts.length ? { items: posts, source: 'wordpress' } : { items: content[kind], source: 'demo' };
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'portail-plateaux/1.0' },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`WordPress request failed [${res.status}] ${url}`);
  return res.json();
}

async function loadFromWordPress(base: string, kind: ContentKind): Promise<ContentItem[] | null> {
  const slug = CATEGORY_SLUG[kind];
  if (!slug) return null;
  const categories = await fetchJson(`${base}/wp-json/wp/v2/categories?slug=${encodeURIComponent(slug)}`);
  if (!Array.isArray(categories) || !categories.length) return null;
  const categoryId = (categories[0] as { id?: number }).id;
  if (!categoryId) return null;
  const posts = await fetchJson(`${base}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=24&_embed=1&orderby=date&order=desc`);
  if (!Array.isArray(posts)) return null;
  return posts.map((post, index) => {
    const fallback = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length] ?? images.dance;
    return mapWpPost(post as WpPost, kind, fallback);
  });
}

export const getPortalItems = createServerFn({ method: 'GET' })
  .inputValidator((input: { kind?: unknown }) => {
    const kind = input?.kind;
    if (typeof kind !== 'string' || !(kind in CATEGORY_SLUG)) throw new Error('Rubrique non connectée à WordPress.');
    return { kind: kind as ContentKind };
  })
  .handler(async ({ data }) => {
    const kind = data.kind;
    const entry = cache.get(kind);
    if (entry && Date.now() - entry.at < entry.ttl) return entry.result;
    const base = (process.env['WORDPRESS_URL'] || '').replace(/\/+$/, '');
    let result: PortalResult;
    if (!base) {
      result = resolveResult(kind, null);
    } else {
      try {
        result = resolveResult(kind, await loadFromWordPress(base, kind));
      } catch (error) {
        console.warn(`WordPress indisponible pour « ${kind} » : ${error instanceof Error ? error.message : String(error)}`);
        result = resolveResult(kind, null);
      }
    }
    cache.set(kind, { at: Date.now(), ttl: result.source === 'wordpress' ? OK_TTL : EMPTY_TTL, result });
    return result;
  });
