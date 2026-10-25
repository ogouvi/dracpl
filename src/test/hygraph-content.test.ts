import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { content } from "@/lib/portal/content";
import { loadFromHygraph, mapHygraphRecord, resetHygraphModels } from "@/lib/portal/hygraph";
import { resetPortalCache, resolvePortalItems } from "@/lib/portal/source";

const endpoint = "https://cms.example.org/graphql";
const news = {
  slug: "nouvelle-culturelle",
  title: "Rencontre culturelle",
  summary: "Une rencontre à Kpalimé.",
  body: { html: "<p>Premier paragraphe.</p><p>Deuxième paragraphe.</p>" },
  date: "2026-10-21",
  publishedAt: "2026-10-21T12:00:00Z",
  cover: { url: "https://cms.example.org/photo.jpg" },
};
const reply = (data: unknown) => new Response(JSON.stringify({ data }), { status: 200 });

beforeEach(() => {
  resetHygraphModels();
  resetPortalCache();
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Hygraph editorial content", () => {
  it("reads only the published stage with valid Hygraph pagination and ordering", async () => {
    const fetcher = vi.fn(async (_url: unknown, init?: RequestInit) => {
      const { query } = JSON.parse(String(init?.body));
      expect(query).toContain("first: 24");
      expect(query).toContain("stage: PUBLISHED");
      expect(query).toContain("orderBy: publishedAt_DESC");
      expect(query).not.toContain("sys");
      return reply({ actualites: [news] });
    });
    vi.stubGlobal("fetch", fetcher);
    const result = await resolvePortalItems("actualites", { HYGRAPH_ENDPOINT: endpoint });
    expect(result.source).toBe("hygraph");
    expect(result.items[0]?.slug).toBe("nouvelle-culturelle");
    expect(result.items[0]?.body).toEqual(["Premier paragraphe.", "Deuxième paragraphe."]);
    expect(result.items[0]?.date).toBe("21 octobre 2026");
    expect(result.items[0]?.image).toBe("https://cms.example.org/photo.jpg");
  });

  it("reads the gallery pictures and keeps working when the workspace has no gallery field", async () => {
    const item = mapHygraphRecord(
      {
        ...news,
        gallery: [
          { url: "https://cms.example.org/a.jpg" },
          { url: "https://cms.example.org/b.jpg" },
          { url: "" },
          null,
        ],
      },
      "actualites",
      0,
    );
    expect(item.gallery).toEqual([
      "https://cms.example.org/a.jpg",
      "https://cms.example.org/b.jpg",
    ]);
    expect(mapHygraphRecord(news, "actualites", 0).gallery).toBeUndefined();

    const fetcher = vi.fn(async (_url: unknown, init?: RequestInit) => {
      const { query } = JSON.parse(String(init?.body));
      if (query.includes("gallery"))
        return new Response(
          JSON.stringify({ errors: [{ message: "field gallery does not exist" }] }),
          { status: 200 },
        );
      return reply({ actualites: [news] });
    });
    vi.stubGlobal("fetch", fetcher);
    const result = await resolvePortalItems("actualites", { HYGRAPH_ENDPOINT: endpoint });
    expect(result.source).toBe("hygraph");
    expect(result.items[0]?.slug).toBe("nouvelle-culturelle");
    expect(result.items[0]?.gallery).toBeUndefined();
  });

  it("preserves the supplied event town and time without inventing missing details", () => {
    const item = mapHygraphRecord(
      { ...news, ville: "Kpalimé", horaire: "14 h 00", categorie: "Musique" },
      "agenda",
      0,
    );
    expect(item.location).toBe("Kpalimé");
    expect(item.time).toBe("14 h 00");
    expect(item.day).toBe("21");
    expect(item.month).toBe("Oct.");
    expect(mapHygraphRecord(news, "agenda", 0).time).toBeUndefined();
    expect(mapHygraphRecord(news, "agenda", 0).location).toBeUndefined();
  });

  it("labels an empty or unavailable workspace as demonstration content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => reply({ actualites: [] })),
    );
    const empty = await resolvePortalItems("actualites", { HYGRAPH_ENDPOINT: endpoint });
    expect(empty.source).toBe("demo");
    expect(empty.items).toBe(content.actualites);
    resetPortalCache();
    resetHygraphModels();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("Unavailable");
      }),
    );
    expect((await resolvePortalItems("agenda", { HYGRAPH_ENDPOINT: endpoint })).source).toBe(
      "demo",
    );
  });

  it("uses the explicitly configured model and retries after a temporary failure", async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error("Unavailable"))
      .mockImplementation(async (_url, init) => {
        expect(JSON.parse(String(init.body)).query).toContain("culturalNews(");
        return reply({ culturalNews: [news] });
      });
    vi.stubGlobal("fetch", fetcher);
    expect(await loadFromHygraph(endpoint, "actualites", "culturalNews")).toBeNull();
    expect((await loadFromHygraph(endpoint, "actualites", "culturalNews"))?.[0]?.title).toBe(
      "Rencontre culturelle",
    );
  });

  it("reads announcements, galleries and videos from their own Hygraph models", async () => {
    const fetcher = vi.fn(async (_url: unknown, init?: RequestInit) => {
      const { query } = JSON.parse(String(init?.body));
<<<<<<< Updated upstream
      if (query.startsWith('{ annonces(')) return reply({ annonces: [{ ...news, slug: 'appel-projets', statut: 'Ouvert', documents: [{ url: 'https://cms.example.org/appel-a-projets.pdf', fileName: 'appel-a-projets.pdf' }, { url: 'https://cms.example.org/renseignements.pdf', fileName: 'fiche-renseignements.pdf' }, { url: '', fileName: 'sans-adresse.pdf' }, null] }] });
      if (query.startsWith('{ galeries(')) return reply({ galeries: [{ ...news, slug: 'regards-plateaux', gallery: [{ url: 'https://cms.example.org/g1.jpg' }] }] });
      if (query.startsWith('{ videos(')) return reply({ videos: [{ ...news, slug: 'recit-visuel', duree: '12 min' }] });
=======
      if (query.startsWith("{ annonces("))
        return reply({ annonces: [{ ...news, slug: "appel-projets", statut: "Ouvert" }] });
      if (query.startsWith("{ galeries("))
        return reply({
          galeries: [
            {
              ...news,
              slug: "regards-plateaux",
              gallery: [{ url: "https://cms.example.org/g1.jpg" }],
            },
          ],
        });
      if (query.startsWith("{ videos("))
        return reply({ videos: [{ ...news, slug: "recit-visuel", duree: "12 min" }] });
>>>>>>> Stashed changes
      return reply({});
    });
    vi.stubGlobal("fetch", fetcher);

<<<<<<< Updated upstream
    const annonces = await resolvePortalItems('annonces', { HYGRAPH_ENDPOINT: endpoint });
    expect(annonces.source).toBe('hygraph');
    expect(annonces.items[0]?.slug).toBe('appel-projets');
    expect(annonces.items[0]?.status).toBe('Ouvert');
    expect(annonces.items[0]?.documents).toEqual([
      { url: 'https://cms.example.org/appel-a-projets.pdf', name: 'appel-a-projets.pdf' },
      { url: 'https://cms.example.org/renseignements.pdf', name: 'fiche-renseignements.pdf' },
    ]);
=======
    const annonces = await resolvePortalItems("annonces", { HYGRAPH_ENDPOINT: endpoint });
    expect(annonces.source).toBe("hygraph");
    expect(annonces.items[0]?.slug).toBe("appel-projets");
    expect(annonces.items[0]?.status).toBe("Ouvert");
>>>>>>> Stashed changes

    const galeries = await resolvePortalItems("galeries", { HYGRAPH_ENDPOINT: endpoint });
    expect(galeries.source).toBe("hygraph");
    expect(galeries.items[0]?.gallery).toEqual(["https://cms.example.org/g1.jpg"]);

    const videos = await resolvePortalItems("videos", { HYGRAPH_ENDPOINT: endpoint });
    expect(videos.source).toBe("hygraph");
    expect(videos.items[0]?.duration).toBe("12 min");
  });

  it("falls back to WordPress when Hygraph is empty and WordPress is configured", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        if (url === endpoint) return reply({ actualites: [] });
        if (url.includes("/categories?")) return new Response(JSON.stringify([{ id: 12 }]));
        return new Response(
          JSON.stringify([
            {
              slug: "article-wordpress",
              date: "2026-10-21T12:00:00",
              title: { rendered: "Article WordPress" },
            },
          ]),
        );
      }),
    );
    const result = await resolvePortalItems("actualites", {
      HYGRAPH_ENDPOINT: endpoint,
      WORDPRESS_URL: "https://wordpress.example.org",
    });
    expect(result.source).toBe("wordpress");
    expect(result.items[0]?.slug).toBe("article-wordpress");
  });
});
