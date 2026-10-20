import { createFileRoute } from '@tanstack/react-router';
import { DetailPage } from '@/components/portal/pages';
import { metadata, content } from '@/lib/portal/content';
import { getPortalItems } from '@/lib/portal/wordpress';
export const Route = createFileRoute('/agenda/$slug')({loader:()=>getPortalItems({data:{kind:'agenda'}}),head:({loaderData,params})=>{const item=(loaderData?.items??content.agenda).find(i=>i.slug===params.slug);return metadata(item?.title||'Page introuvable',item?.summary||'Ce contenu est indisponible.');},component:Detail});
function Detail() { const {slug}=Route.useParams();const {items,source}=Route.useLoaderData();return <DetailPage kind="agenda" slug={slug} items={items} source={source}/>; }
