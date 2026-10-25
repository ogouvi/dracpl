import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/portal/pages";
import { metadata, pageInfo } from "@/lib/portal/content";
export const Route = createFileRoute("/la-direction")({
  head: () => metadata(pageInfo["la-direction"].title, pageInfo["la-direction"].intro),
  component: () => <StaticPage slug="la-direction" />,
});
