import { createFileRoute } from '@tanstack/react-router';
import { StaticPage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/faq')({head:()=>metadata(pageInfo['faq'].title,pageInfo['faq'].intro),component:()=> <StaticPage slug="faq"/>});
