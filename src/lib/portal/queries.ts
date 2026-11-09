import { queryOptions, useSuspenseQueries, type QueryClient } from "@tanstack/react-query";
import { content, type ContentItem, type ContentKind } from "./content";
import { getPortalItems, type PortalResult } from "./source";

export const portalQueryOptions = (kind: ContentKind) => queryOptions({
  queryKey: ["portal-content", kind],
  queryFn: () => getPortalItems({ data: { kind } }),
  staleTime: 60_000,
});

/** Rubriques whose publications may come from the CMS: every link to them must use CMS slugs. */
export const CMS_KINDS = ["actualites", "agenda", "annonces", "galeries", "videos"] as const;
export type CmsKind = (typeof CMS_KINDS)[number];

export const ensurePortalCatalog = (queryClient: QueryClient) =>
  Promise.all(CMS_KINDS.map((kind) => queryClient.ensureQueryData(portalQueryOptions(kind))));

/** Same items the detail pages read, so lists never link to a publication the detail page cannot find. */
export function usePortalCatalog(): {
  items: Record<ContentKind, ContentItem[]>;
  results: Record<CmsKind, PortalResult>;
} {
  const queries = useSuspenseQueries({ queries: CMS_KINDS.map((kind) => portalQueryOptions(kind)) });
  const items = { ...content };
  const results = {} as Record<CmsKind, PortalResult>;
  CMS_KINDS.forEach((kind, index) => {
    const result = queries[index]?.data ?? { items: content[kind], source: "demo" as const };
    results[kind] = result;
    items[kind] = result.items;
  });
  return { items, results };
}
