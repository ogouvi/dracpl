// Chooses where the portal's news and events come from:
// a Hygraph workspace if one is configured, otherwise a WordPress site, otherwise the demonstration content.
// Demonstration content is always labelled as such and never presented as published editorial content.

import { createServerFn } from '@tanstack/react-start';
import { content, type ContentItem, type ContentKind } from './content';
import { loadFromHygraph } from './hygraph';
import { CATEGORY_SLUG, loadFromWordPress } from './wordpress';

export type ContentSource = 'wordpress' | 'hygraph' | 'demo';
export type PortalResult = { items: ContentItem[]; source: ContentSource };

const OK_TTL = 60_000;
const EMPTY_TTL = 300_000;

type CacheEntry = { at: number; ttl: number; result: PortalResult };
const cache = new Map<ContentKind, CacheEntry>();

export function resetPortalCache(): void {
  cache.clear();
}

export function resolveResult(kind: ContentKind, items: ContentItem[] | null, source: ContentSource = 'demo'): PortalResult {
  return items && items.length ? { items, source } : { items: content[kind], source: 'demo' };
}

export async function resolvePortalItems(kind: ContentKind, env: Record<string, string | undefined> = process.env): Promise<PortalResult> {
  const entry = cache.get(kind);
  if (entry && Date.now() - entry.at < entry.ttl) return entry.result;

  const hygraphEndpoint = (env['HYGRAPH_ENDPOINT'] || '').trim();
  const wordpressBase = (env['WORDPRESS_URL'] || '').replace(/\/+$/, '');
  let result: PortalResult = { items: content[kind], source: 'demo' };

  if (hygraphEndpoint) {
    try {
      const items = await loadFromHygraph(hygraphEndpoint, kind);
      if (items && items.length) result = { items, source: 'hygraph' };
      else console.warn(`Hygraph n’a rien fourni pour « ${kind} » : repli sur le contenu de démonstration.`);
    } catch (error) {
      console.warn(`Hygraph indisponible pour « ${kind} » : ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (result.source === 'demo' && wordpressBase) {
    try {
      const items = await loadFromWordPress(wordpressBase, kind);
      if (items && items.length) result = { items, source: 'wordpress' };
      else console.warn(`WordPress n’a rien fourni pour « ${kind} » : repli sur le contenu de démonstration.`);
    } catch (error) {
      console.warn(`WordPress indisponible pour « ${kind} » : ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  cache.set(kind, { at: Date.now(), ttl: result.source === 'demo' ? EMPTY_TTL : OK_TTL, result });
  return result;
}

export const getPortalItems = createServerFn({ method: 'GET' })
  .inputValidator((input: { kind?: unknown }) => {
    const kind = input?.kind;
    if (typeof kind !== 'string' || !(kind in CATEGORY_SLUG)) throw new Error('Rubrique non connectée à une source de contenu.');
    return { kind: kind as ContentKind };
  })
  .handler(async ({ data }) => resolvePortalItems(data.kind));
