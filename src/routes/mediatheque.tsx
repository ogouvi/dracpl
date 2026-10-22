import { createFileRoute } from '@tanstack/react-router';
import { StaticPage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
import { getPortalItems } from '@/lib/portal/source';
export const Route = createFileRoute('/mediatheque')({head:()=>metadata(pageInfo['mediatheque'].title,pageInfo['mediatheque'].intro),loader:()=>Promise.all([getPortalItems({data:{kind:'galeries'}}),getPortalItems({data:{kind:'videos'}})]).then(([galeries,videos])=>({galeries,videos})),component:Mediatheque});
function Mediatheque() { const {galeries,videos}=Route.useLoaderData();return <StaticPage slug="mediatheque" galeries={galeries.items} videos={videos.items}/>; }
