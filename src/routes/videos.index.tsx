import { createFileRoute } from '@tanstack/react-router';
import { ArchivePage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
import { getPortalItems } from '@/lib/portal/source';
export const Route = createFileRoute('/videos/')({head:()=>metadata(pageInfo.videos.title,pageInfo.videos.intro),loader:()=>getPortalItems({data:{kind:'videos'}}),component:Videos});
function Videos() { const {items,source}=Route.useLoaderData();return <ArchivePage kind="videos" items={items} source={source}/>; }
