import { createFileRoute } from '@tanstack/react-router';
import { StaticPage, MissingPage } from '@/components/portal/pages';
import { ContentPending, ContentError } from '@/components/portal/loading';
import { ensurePortalCatalog } from '@/lib/portal/queries';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/archives')({loader:({context})=>ensurePortalCatalog(context.queryClient),pendingComponent:ContentPending,errorComponent:ContentError,notFoundComponent:MissingPage,head:()=>metadata(pageInfo['archives'].title,pageInfo['archives'].intro),component:()=> <StaticPage slug="archives"/>});
