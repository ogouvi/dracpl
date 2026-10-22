import { createFileRoute } from '@tanstack/react-router';
import { ArchivePage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
import { getPortalItems } from '@/lib/portal/source';
export const Route = createFileRoute('/galeries/')({head:()=>metadata(pageInfo.galeries.title,pageInfo.galeries.intro),loader:()=>getPortalItems({data:{kind:'galeries'}}),component:Galeries});
function Galeries() { const {items,source}=Route.useLoaderData();return <ArchivePage kind="galeries" items={items} source={source}/>; }
