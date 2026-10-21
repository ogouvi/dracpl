import { describe, expect, it } from "vitest";

import { content } from "@/lib/portal/content";
import { mapWpPost, type WpPost } from "@/lib/portal/wordpress";
import { formatFrenchDate, toParagraphs } from "@/lib/portal/text";
import { resolveResult } from "@/lib/portal/source";

const eventPost: WpPost = {
  slug: "rythmes-de-kpalime",
  date: "2026-10-05T09:56:17",
  title: { rendered: "Les rythmes de Kpalim&#8217;é" },
  excerpt: { rendered: "<p>Un temps de partage entre musiciens et publics. […]</p>" },
  content: { rendered: "<p>Le festival réunit les groupes locaux.</p>\n<p>Les échanges se poursuivent le lendemain.</p>" },
  acf: { ville: "Kpalimé", horaire: "14 h 00 – 19 h 00", lieu: "Place des artisans" },
  _embedded: {
    "wp:featuredmedia": [{ source_url: "https://cms.drac-plateaux.tg/wp-content/uploads/2026/10/cover.jpg" }],
    "wp:term": [[{ taxonomy: "category", slug: "agenda", name: "Agenda" }]],
  },
};

describe("WordPress editorial content", () => {
  it("writes a WordPress ISO date the way the portal shows dates", () => {
    expect(formatFrenchDate("2026-10-05T09:56:17")).toBe("5 octobre 2026");
  });

  it("maps a published event post onto an agenda item", () => {
    const item = mapWpPost(eventPost, "agenda", "https://example.org/illustration.jpg");

    expect(item.title).toBe("Les rythmes de Kpalim’é");
    expect(item.summary).toBe("Un temps de partage entre musiciens et publics.");
    expect(item.date).toBe("5 octobre 2026");
    expect(item.day).toBe("05");
    expect(item.month).toBe("Oct.");
    expect(item.location).toBe("Kpalimé");
    expect(item.time).toBe("14 h 00 – 19 h 00");
    expect(item.category).toBe("Agenda");
    expect(item.image).toBe("https://cms.drac-plateaux.tg/wp-content/uploads/2026/10/cover.jpg");
    expect(item.body).toEqual(["Le festival réunit les groupes locaux.", "Les échanges se poursuivent le lendemain."]);
  });

  it("keeps an event without its ACF details readable instead of inventing them", () => {
    const bare: WpPost = { slug: "sans-champs", date: "2026-11-08T10:00:00", title: { rendered: "Rencontre" }, content: { rendered: "<p>Texte.</p>" } };
    const item = mapWpPost(bare, "agenda", "https://example.org/illustration.jpg");

    expect(item.location).toBeUndefined();
    expect(item.time).toBeUndefined();
    expect(item.summary).toBe("");
  });

  it("falls back to the demonstration content while WordPress holds nothing", () => {
    const result = resolveResult("agenda", null);

    expect(result.source).toBe("demo");
    expect(result.items).toBe(content.agenda);
    expect(resolveResult("actualites", []).source).toBe("demo");
    expect(resolveResult("actualites", [mapWpPost(eventPost, "actualites", "x")], "wordpress").source).toBe("wordpress");
  });

  it("turns WordPress article markup into plain paragraphs", () => {
    expect(toParagraphs("<h2>Titre</h2><p>Un paragraphe.</p><script>evil()</script><p>Un autre.</p>")).toEqual([
      "Titre",
      "Un paragraphe.",
      "Un autre.",
    ]);
  });
});
