import { createFileRoute } from '@tanstack/react-router';
import { StaticPage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/contact')({head:()=>metadata(pageInfo['contact'].title,pageInfo['contact'].intro),component:()=> <StaticPage slug="contact"/>});
