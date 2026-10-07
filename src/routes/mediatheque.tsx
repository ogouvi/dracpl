import { createFileRoute } from '@tanstack/react-router';
import { StaticPage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/mediatheque')({head:()=>metadata(pageInfo['mediatheque'].title,pageInfo['mediatheque'].intro),component:()=> <StaticPage slug="mediatheque"/>});
