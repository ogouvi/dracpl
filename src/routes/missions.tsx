import { createFileRoute } from '@tanstack/react-router';
import { StaticPage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/missions')({head:()=>metadata(pageInfo['missions'].title,pageInfo['missions'].intro),component:()=> <StaticPage slug="missions"/>});
