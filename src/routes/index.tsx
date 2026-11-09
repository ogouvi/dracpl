import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/portal/home";
import { ContentPending, ContentError } from "@/components/portal/loading";
import { MissingPage } from "@/components/portal/pages";
import { metadata } from "@/lib/portal/content";
import { ensurePortalCatalog, usePortalCatalog } from "@/lib/portal/queries";
export const Route = createFileRoute("/")({
  head: () =>
    metadata(
      "Accueil",
      "Découvrez les arts, les patrimoines, les rendez-vous et les initiatives culturelles de la région des Plateaux au Togo.",
    ),
  loader: ({ context }) => ensurePortalCatalog(context.queryClient),
  pendingComponent: ContentPending,
  errorComponent: ContentError,
  notFoundComponent: MissingPage,
  component: Home,
});
function Home() {
  const { results } = usePortalCatalog();
  return (
    <HomePage
      news={results.actualites}
      events={results.agenda}
      annonces={results.annonces}
      galeries={results.galeries.items}
      videos={results.videos.items}
    />
  );
}
