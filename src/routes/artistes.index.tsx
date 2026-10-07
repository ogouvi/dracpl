import { createFileRoute } from '@tanstack/react-router';
import { ArchivePage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/artistes/')({head:()=>metadata(pageInfo.artistes.title,pageInfo.artistes.intro),component:()=> <ArchivePage kind="artistes"/>});
