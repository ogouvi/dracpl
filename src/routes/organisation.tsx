import { createFileRoute } from '@tanstack/react-router';
import { StaticPage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/organisation')({head:()=>metadata(pageInfo['organisation'].title,pageInfo['organisation'].intro),component:()=> <StaticPage slug="organisation"/>});
