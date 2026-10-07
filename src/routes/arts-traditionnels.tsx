import { createFileRoute } from '@tanstack/react-router';
import { StaticPage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/arts-traditionnels')({head:()=>metadata(pageInfo['arts-traditionnels'].title,pageInfo['arts-traditionnels'].intro),component:()=> <StaticPage slug="arts-traditionnels"/>});
