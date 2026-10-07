import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/portal/home";
import { metadata } from "@/lib/portal/content";
export const Route = createFileRoute("/")({head:()=>metadata("Accueil", "Découvrez les arts, les patrimoines, les rendez-vous et les initiatives culturelles de la région des Plateaux au Togo."),component:HomePage});
