import { createFileRoute } from '@tanstack/react-router';
import { DetailPage } from '@/components/portal/pages';
import { metadata, content } from '@/lib/portal/content';
import { getPortalItems } from '@/lib/portal/source';
export const Route = createFileRoute('/videos/$slug')({loader:()=>getPortalItems({data:{kind:'videos'}}),head:({loaderData,params})=>{const item=(loaderData?.items??content.videos).find(i=>i.slug===params.slug);return metadata(item?.title||'Page introuvable',item?.summary||'Ce contenu est indisponible.',item?.image);},component:Detail});
function Detail() { const {slug}=Route.useParams();const {items,source}=Route.useLoaderData();return <DetailPage kind="videos" slug={slug} items={items} source={source}/>; }
