import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/public/env-check")({
  server: { handlers: { GET: async () => Response.json({ endpoint: typeof process.env["HYGRAPH_ENDPOINT"], marker: process.env["HYGRAPH_ENDPOINT"] === "https://marker.invalid/graphql" }) } },
});
