// Reads news and events from a WordPress editorial workspace through its public REST API.
// Nothing here is needed until the WORDPRESS_URL setting is filled in.

import { images, type ContentItem, type ContentKind } from './content';
import { decode, formatFrenchDate, toParagraphs, toText } from './text';

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

// Editorial rubrics that WordPress may supply. Each maps to one WordPress category slug.
export const CATEGORY_SLUG: Partial<Record<ContentKind, string>> = { actualites: 'actualites', agenda: 'agenda' };
export const FALLBACK_IMAGES = [images.dance, images.heritage, images.artisan, images.exhibition];
export const REQUEST_TIMEOUT = 2500;

export function fallbackImage(index: number): string {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length] ?? images.dance;
}

export function mapWpPost(post: WpPost, kind: ContentKind, fallback: string): ContentItem {
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
    image: media?.source_url || fallback,
    body: toParagraphs(post.content?.rendered ?? ''),
  };
  if (kind === 'agenda') {
    const town = decode(String(acf['ville'] ?? ''));
    const time = decode(String(acf['horaire'] ?? ''));
    if (town) item.location = town;
    if (time) item.time = time;
    if (iso) {
      item.day = iso[3] ?? '';
      item.month = ['Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'][Number(iso[2]) - 1] ?? '';
    }
  }
  return item;
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

export async function loadFromWordPress(base: string, kind: ContentKind): Promise<ContentItem[] | null> {
  const slug = CATEGORY_SLUG[kind];
  if (!slug) return null;
  const categories = await fetchJson(`${base}/wp-json/wp/v2/categories?slug=${encodeURIComponent(slug)}`);
  if (!Array.isArray(categories) || !categories.length) return null;
  const categoryId = (categories[0] as { id?: number }).id;
  if (!categoryId) return null;
  const posts = await fetchJson(`${base}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=24&_embed=1&orderby=date&order=desc`);
  if (!Array.isArray(posts)) return null;
  return posts.map((post, index) => mapWpPost(post as WpPost, kind, fallbackImage(index)));
}
