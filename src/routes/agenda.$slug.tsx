import { createFileRoute } from '@tanstack/react-router';
import { DetailPage } from '@/components/portal/pages';
import { metadata, content } from '@/lib/portal/content';
export const Route = createFileRoute('/agenda/$slug')({head:({params})=>{const item=content.agenda.find(i=>i.slug===params.slug);return metadata(item?.title||'Page introuvable',item?.summary||'Ce contenu est indisponible.');},component:Detail});
function Detail() { const {slug}=Route.useParams();return <DetailPage kind="agenda" slug={slug}/>; }
