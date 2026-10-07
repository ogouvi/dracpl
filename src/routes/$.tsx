import { createFileRoute } from '@tanstack/react-router';
import { MissingPage } from '@/components/portal/pages';
import { metadata } from '@/lib/portal/content';

export const Route = createFileRoute('/$')({
  head: () => ({ ...metadata('Page introuvable', 'Retrouvez votre chemin dans le portail des arts et des cultures des Plateaux.'), meta: [...metadata('Page introuvable', 'Retrouvez votre chemin dans le portail des arts et des cultures des Plateaux.').meta, { name: 'robots', content: 'noindex' }] }),
  component: MissingPage,
});