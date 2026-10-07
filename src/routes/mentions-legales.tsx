import { createFileRoute } from '@tanstack/react-router';
import { StaticPage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/mentions-legales')({head:()=>metadata(pageInfo['mentions-legales'].title,pageInfo['mentions-legales'].intro),component:()=> <StaticPage slug="mentions-legales"/>});
