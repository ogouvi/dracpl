import { createFileRoute } from '@tanstack/react-router';
import { ArchivePage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/agenda/')({head:()=>metadata(pageInfo.agenda.title,pageInfo.agenda.intro),component:()=> <ArchivePage kind="agenda"/>});
