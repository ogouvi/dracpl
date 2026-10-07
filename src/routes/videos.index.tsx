import { createFileRoute } from '@tanstack/react-router';
import { ArchivePage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/videos/')({head:()=>metadata(pageInfo.videos.title,pageInfo.videos.intro),component:()=> <ArchivePage kind="videos"/>});
