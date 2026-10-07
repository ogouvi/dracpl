import { createFileRoute } from '@tanstack/react-router';
import { ArchivePage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/projets/')({head:()=>metadata(pageInfo.projets.title,pageInfo.projets.intro),component:()=> <ArchivePage kind="projets"/>});
