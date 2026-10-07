import { createFileRoute } from '@tanstack/react-router';
import { StaticPage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/confidentialite')({head:()=>metadata(pageInfo['confidentialite'].title,pageInfo['confidentialite'].intro),component:()=> <StaticPage slug="confidentialite"/>});
