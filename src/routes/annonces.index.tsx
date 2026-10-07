import { createFileRoute } from '@tanstack/react-router';
import { ArchivePage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route = createFileRoute('/annonces/')({head:()=>metadata(pageInfo.annonces.title,pageInfo.annonces.intro),component:()=> <ArchivePage kind="annonces"/>});
