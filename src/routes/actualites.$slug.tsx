import { createFileRoute } from '@tanstack/react-router';
import { DetailPage } from '@/components/portal/pages';
import { metadata, content } from '@/lib/portal/content';
import { getPortalItems } from '@/lib/portal/source';
export const Route = createFileRoute('/actualites/$slug')({loader:()=>getPortalItems({data:{kind:'actualites'}}),head:({loaderData,params})=>{const item=(loaderData?.items??content.actualites).find(i=>i.slug===params.slug);return metadata(item?.title||'Page introuvable',item?.summary||'Ce contenu est indisponible.');},component:Detail});
function Detail() { const {slug}=Route.useParams();const {items,source}=Route.useLoaderData();return <DetailPage kind="actualites" slug={slug} items={items} source={source}/>; }
