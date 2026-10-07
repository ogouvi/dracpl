import { createFileRoute } from '@tanstack/react-router';
import { ArchivePage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/actualites/')({head:()=>metadata(pageInfo.actualites.title,pageInfo.actualites.intro),component:()=> <ArchivePage kind="actualites"/>});
