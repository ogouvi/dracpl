import { createFileRoute } from '@tanstack/react-router';
import { StaticPage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/patrimoine')({head:()=>metadata(pageInfo['patrimoine'].title,pageInfo['patrimoine'].intro),component:()=> <StaticPage slug="patrimoine"/>});
