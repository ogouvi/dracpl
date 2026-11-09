import { createFileRoute } from '@tanstack/react-router';
import { ArchivePage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
import { useSuspenseQuery } from '@tanstack/react-query';
import { portalQueryOptions } from '@/lib/portal/queries';
import { ContentPending, ContentError } from '@/components/portal/loading';
import { MissingPage } from '@/components/portal/pages';
export const Route = createFileRoute('/annonces/')({head:()=>metadata(pageInfo.annonces.title,pageInfo.annonces.intro),loader:({context})=>context.queryClient.ensureQueryData(portalQueryOptions('annonces')),pendingMs:0,pendingComponent:ContentPending,errorComponent:ContentError,notFoundComponent:MissingPage,component:Annonces});
function Annonces() { const {data:{items,source,unavailable}}=useSuspenseQuery(portalQueryOptions('annonces'));return <ArchivePage kind="annonces" items={items} source={source} unavailable={unavailable}/>; }
