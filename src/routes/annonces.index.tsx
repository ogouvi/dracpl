import { createFileRoute } from '@tanstack/react-router';
import { ArchivePage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
import { getPortalItems } from '@/lib/portal/source';
export const Route = createFileRoute('/annonces/')({head:()=>metadata(pageInfo.annonces.title,pageInfo.annonces.intro),loader:()=>getPortalItems({data:{kind:'annonces'}}),component:Annonces});
function Annonces() { const {items,source}=Route.useLoaderData();return <ArchivePage kind="annonces" items={items} source={source}/>; }
