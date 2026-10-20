import { createFileRoute } from '@tanstack/react-router';
import { ArchivePage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
import { getPortalItems } from '@/lib/portal/source';
export const Route = createFileRoute('/actualites/')({head:()=>metadata(pageInfo.actualites.title,pageInfo.actualites.intro),loader:()=>getPortalItems({data:{kind:'actualites'}}),component:Actualites});
function Actualites() { const {items,source}=Route.useLoaderData();return <ArchivePage kind="actualites" items={items} source={source}/>; }
