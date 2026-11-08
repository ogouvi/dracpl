import { queryOptions } from "@tanstack/react-query";
import type { ContentKind } from "./content";
import { getPortalItems } from "./source";

export const portalQueryOptions = (kind: ContentKind) => queryOptions({
  queryKey: ["portal-content", kind],
  queryFn: () => getPortalItems({ data: { kind } }),
  staleTime: 60_000,
});