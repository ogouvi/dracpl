import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DetailPage, MissingPage } from "@/components/portal/pages";
import { ContentPending, ContentError } from "@/components/portal/loading";
import { metadata, pageInfo } from "@/lib/portal/content";
import { portalQueryOptions } from "@/lib/portal/queries";

export const Route = createFileRoute("/annonces/$slug")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portalQueryOptions("annonces")),
  pendingMs: 0,
  pendingComponent: ContentPending,
  errorComponent: ContentError,
  notFoundComponent: MissingPage,
  head: ({ loaderData, params }) => {
    const item = loaderData?.items.find((item) => item.slug === params.slug);
    return metadata(item?.title ?? pageInfo.annonces.title, item?.summary ?? pageInfo.annonces.intro, item?.image);
  },
  component: Detail,
});
function Detail() {
  const { slug } = Route.useParams();
  const { data: { items, source, unavailable } } = useSuspenseQuery(portalQueryOptions("annonces"));
  return <DetailPage kind="annonces" slug={slug} items={items} source={source} unavailable={unavailable} />;
}
