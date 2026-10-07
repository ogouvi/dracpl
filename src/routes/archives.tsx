import { createFileRoute } from '@tanstack/react-router';
import { StaticPage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/archives')({head:()=>metadata(pageInfo['archives'].title,pageInfo['archives'].intro),component:()=> <StaticPage slug="archives"/>});
