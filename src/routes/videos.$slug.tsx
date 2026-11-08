import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DetailPage, MissingPage } from "@/components/portal/pages";
import { ContentPending, ContentError } from "@/components/portal/loading";
import { metadata, pageInfo } from "@/lib/portal/content";
import { portalQueryOptions } from "@/lib/portal/queries";

export const Route = createFileRoute("/videos/$slug")({
  loader: ({ context }) => context.queryClient.ensureQueryData(portalQueryOptions("videos")),
  pendingMs: 0,
  pendingComponent: ContentPending,
  errorComponent: ContentError,
  notFoundComponent: MissingPage,
  head: ({ loaderData, params }) => {
    const item = loaderData?.items.find((item) => item.slug === params.slug);
    return metadata(item?.title ?? pageInfo.videos.title, item?.summary ?? pageInfo.videos.intro, item?.image);
  },
  component: Detail,
});
function Detail() {
  const { slug } = Route.useParams();
  const { data: { items, source, unavailable } } = useSuspenseQuery(portalQueryOptions("videos"));
  return <DetailPage kind="videos" slug={slug} items={items} source={source} unavailable={unavailable} />;
}
