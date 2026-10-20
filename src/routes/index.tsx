import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/portal/home";
import { metadata } from "@/lib/portal/content";
import { getPortalItems } from "@/lib/portal/source";
export const Route = createFileRoute("/")({head:()=>metadata("Accueil", "Découvrez les arts, les patrimoines, les rendez-vous et les initiatives culturelles de la région des Plateaux au Togo."),loader:()=>Promise.all([getPortalItems({data:{kind:'actualites'}}),getPortalItems({data:{kind:'agenda'}})]).then(([news,events])=>({news,events})),component:Home});
function Home() { const {news,events}=Route.useLoaderData();return <HomePage news={news} events={events}/>; }
