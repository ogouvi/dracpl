import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function ContentPending() {
  return <section className="section"><div className="wrap prose" role="status" aria-live="polite"><p>Chargement du contenu…</p></div></section>;
}

export function ContentUnavailable() {
  const router = useRouter();
  return <section className="section"><div className="wrap prose" role="alert"><h1>Contenu temporairement indisponible</h1><p>La publication n’a pas pu être chargée. Veuillez réessayer dans quelques instants.</p><Button variant="outline" onClick={() => { void router.invalidate(); }}>Réessayer</Button></div></section>;
}

export function ContentError({ reset }: ErrorComponentProps) {
  const router = useRouter();
  return <section className="section"><div className="wrap prose" role="alert"><h1>Le contenu n’a pas pu être chargé</h1><Button variant="outline" onClick={async () => { await router.invalidate(); reset(); }}>Réessayer</Button></div></section>;
}