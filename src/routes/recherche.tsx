import { createFileRoute } from "@tanstack/react-router";
import { SearchPage, MissingPage } from "@/components/portal/pages";
import { ContentPending, ContentError } from "@/components/portal/loading";
import { ensurePortalCatalog } from "@/lib/portal/queries";
import { metadata, pageInfo } from "@/lib/portal/content";
export const Route = createFileRoute("/recherche")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s["q"] === "string" ? s["q"] : "" }),
  loader: ({ context }) => ensurePortalCatalog(context.queryClient),
  pendingComponent: ContentPending,
  errorComponent: ContentError,
  notFoundComponent: MissingPage,
  head: () => metadata(pageInfo.recherche.title, pageInfo.recherche.intro),
  component: Search,
});
function Search() {
  const { q } = Route.useSearch();
  return <SearchPage q={q} />;
}
