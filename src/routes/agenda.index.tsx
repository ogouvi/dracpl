import { createFileRoute } from '@tanstack/react-router';
import { ArchivePage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
import { getPortalItems } from '@/lib/portal/wordpress';
export const Route = createFileRoute('/agenda/')({head:()=>metadata(pageInfo.agenda.title,pageInfo.agenda.intro),loader:()=>getPortalItems({data:{kind:'agenda'}}),component:Agenda});
function Agenda() { const {items,source}=Route.useLoaderData();return <ArchivePage kind="agenda" items={items} source={source}/>; }
