import { createFileRoute } from '@tanstack/react-router';
import { SearchPage } from '@/components/portal/pages';
import { metadata, pageInfo } from '@/lib/portal/content';
export const Route=createFileRoute('/recherche')({validateSearch:(s:Record<string,unknown>)=>({q:typeof s.q==='string'?s.q:''}),head:()=>metadata(pageInfo.recherche.title,pageInfo.recherche.intro),component:Search});
function Search(){const {q}=Route.useSearch();return <SearchPage q={q}/>;}
