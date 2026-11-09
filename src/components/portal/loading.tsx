import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

export function ContentPending() {
  return <section className="section"><div className="wrap flex min-h-48 items-center justify-center gap-3 text-muted-foreground" role="status" aria-live="polite"><LoaderCircle className="size-6 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" /><p>Chargement du contenu…</p></div></section>;
}

export function ContentUnavailable() {
  const router = useRouter();
  return <section className="section"><div className="wrap prose" role="alert"><h1>Contenu temporairement indisponible</h1><p>La publication n’a pas pu être chargée. Veuillez réessayer dans quelques instants.</p><Button variant="outline" onClick={() => { void router.invalidate(); }}>Réessayer</Button></div></section>;
}

export function ContentError({ reset }: ErrorComponentProps) {
  const router = useRouter();
  return <section className="section"><div className="wrap prose" role="alert"><h1>Le contenu n’a pas pu être chargé</h1><Button variant="outline" onClick={async () => { await router.invalidate(); reset(); }}>Réessayer</Button></div></section>;
}
/** Replaces a list while the CMS is unreachable, so no card links to an address that does not exist. */
export function ContentUnavailableNotice() {
  const router = useRouter();
  return <div className="flex flex-wrap items-center gap-4 text-muted-foreground" role="status"><p>Ces publications sont temporairement indisponibles. Veuillez réessayer dans quelques instants.</p><Button variant="outline" size="sm" onClick={() => { void router.invalidate(); }}>Réessayer</Button></div>;
}
