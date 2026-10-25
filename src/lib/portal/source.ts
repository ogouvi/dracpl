// Chooses where the portal's news and events come from:
// a Hygraph workspace if one is configured, otherwise a WordPress site, otherwise the demonstration content.
// Demonstration content is always labelled as such and never presented as published editorial content.

import { createServerFn } from "@tanstack/react-start";
import { content, type ContentItem, type ContentKind } from "./content";
import { loadFromHygraph } from "./hygraph";

export type ContentSource = "wordpress" | "hygraph" | "demo";
export type PortalResult = { items: ContentItem[]; source: ContentSource };

const OK_TTL = 60_000;
const EMPTY_TTL = 300_000;

// Setting names that let each portal section point at its own Hygraph model.
const HYGRAPH_MODEL_ENV: Partial<Record<ContentKind, string>> = {
  actualites: "HYGRAPH_NEWS_MODEL",
  agenda: "HYGRAPH_EVENT_MODEL",
  annonces: "HYGRAPH_ANNOUNCEMENT_MODEL",
  galeries: "HYGRAPH_GALLERY_MODEL",
  videos: "HYGRAPH_VIDEO_MODEL",
};

type CacheEntry = { at: number; ttl: number; result: PortalResult };
const cache = new Map<string, CacheEntry>();

export function resetPortalCache(): void {
  cache.clear();
}

export function resolveResult(
  kind: ContentKind,
  items: ContentItem[] | null,
  source: ContentSource = "demo",
): PortalResult {
  return items && items.length ? { items, source } : { items: content[kind], source: "demo" };
}

export async function resolvePortalItems(
  kind: ContentKind,
  env: Record<string, string | undefined>,
): Promise<PortalResult> {
  const key = JSON.stringify([
    kind,
    env["HYGRAPH_ENDPOINT"],
    env["WORDPRESS_URL"],
    ...Object.values(HYGRAPH_MODEL_ENV).map((name) => env[name]),
  ]);
  const entry = cache.get(key);
  if (entry && Date.now() - entry.at < entry.ttl) return entry.result;

  const hygraphEndpoint = (env["HYGRAPH_ENDPOINT"] || "").trim();
  const wordpressBase = (env["WORDPRESS_URL"] || "").replace(/\/+$/, "");
  let result: PortalResult = { items: content[kind], source: "demo" };

  if (hygraphEndpoint) {
    try {
      const modelEnv = HYGRAPH_MODEL_ENV[kind];
      const items = await loadFromHygraph(
        hygraphEndpoint,
        kind,
        modelEnv ? env[modelEnv] : undefined,
      );
      if (items && items.length) result = { items, source: "hygraph" };
      else
        console.warn(
          `Hygraph n’a rien fourni pour « ${kind} » : repli sur le contenu de démonstration.`,
        );
    } catch (error) {
      console.warn(
        `Hygraph indisponible pour « ${kind} » : ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  if (result.source === "demo" && wordpressBase && CATEGORY_SLUG[kind]) {
    try {
      const items = await loadFromWordPress(wordpressBase, kind);
      if (items && items.length) result = { items, source: "wordpress" };
      else
        console.warn(
          `WordPress n’a rien fourni pour « ${kind} » : repli sur le contenu de démonstration.`,
        );
    } catch (error) {
      console.warn(
        `WordPress indisponible pour « ${kind} » : ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  cache.set(key, { at: Date.now(), ttl: result.source === "demo" ? EMPTY_TTL : OK_TTL, result });
  return result;
}

export const getPortalItems = createServerFn({ method: "GET" })
  .inputValidator((input: { kind?: unknown }) => {
    const kind = input?.kind;
    if (typeof kind !== "string" || (!(kind in CATEGORY_SLUG) && !(kind in HYGRAPH_MODEL_ENV)))
      throw new Error("Rubrique non connectée à une source de contenu.");
    return { kind: kind as ContentKind };
  })
  .handler(async ({ data }) =>
    resolvePortalItems(data.kind, {
      HYGRAPH_ENDPOINT: process.env["HYGRAPH_ENDPOINT"],
      HYGRAPH_NEWS_MODEL: process.env["HYGRAPH_NEWS_MODEL"],
      HYGRAPH_EVENT_MODEL: process.env["HYGRAPH_EVENT_MODEL"],
      HYGRAPH_ANNOUNCEMENT_MODEL: process.env["HYGRAPH_ANNOUNCEMENT_MODEL"],
      HYGRAPH_GALLERY_MODEL: process.env["HYGRAPH_GALLERY_MODEL"],
      HYGRAPH_VIDEO_MODEL: process.env["HYGRAPH_VIDEO_MODEL"],
      WORDPRESS_URL: process.env["WORDPRESS_URL"],
    }),
  );
