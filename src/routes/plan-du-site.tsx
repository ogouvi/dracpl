import { createFileRoute } from '@tanstack/react-router';
import { StaticPage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/plan-du-site')({head:()=>metadata(pageInfo['plan-du-site'].title,pageInfo['plan-du-site'].intro),component:()=> <StaticPage slug="plan-du-site"/>});
