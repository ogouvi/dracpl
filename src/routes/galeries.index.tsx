import { createFileRoute } from '@tanstack/react-router';
import { ArchivePage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/galeries/')({head:()=>metadata(pageInfo.galeries.title,pageInfo.galeries.intro),component:()=> <ArchivePage kind="galeries"/>});
