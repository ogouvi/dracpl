import dance from "@/assets/cultural-dance.jpg";
import heritage from "@/assets/heritage.jpg";
import artisan from "@/assets/artisan.jpg";
import exhibition from "@/assets/exhibition.jpg";
import education from "@/assets/education.jpg";
import percussions from "@/assets/percussions.jpg";
import paysages from "@/assets/paysages.jpg";
import memoire from "@/assets/memoire.jpg";
export const images = {
  dance,
  heritage,
  artisan,
  exhibition,
  education,
  percussions,
  paysages,
  memoire,
};
export type ContentKind =
  "actualites" | "annonces" | "agenda" | "projets" | "galeries" | "videos" | "artistes";
export type ContentItem = {
  slug: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  image: string;
  gallery?: string[];
  documents?: Array<{ url: string; name: string }>;
  location?: string;
  day?: string;
  month?: string;
  time?: string;
  status?: string;
  duration?: string;
  body: string[];
};
export const content: Record<ContentKind, ContentItem[]> = {
  actualites: [
    {
      slug: "rencontres-creation",
      title: "La jeune création des Plateaux à l’honneur",
      category: "Arts visuels",
      date: "2 octobre 2026",
      summary:
        "Peinture, sculpture et regards contemporains : une scène artistique qui affirme sa voix.",
      image: exhibition,
      location: "Atakpamé",
      body: [
        "La scène artistique des Plateaux se nourrit du dialogue entre héritages et création contemporaine. Les jeunes artistes explorent la mémoire, la ville et les liens entre communautés.",
        "Les rencontres entre créateurs et publics favorisent une meilleure compréhension des œuvres. Elles permettent également aux associations de partager leurs expériences et de construire des collaborations.",
        "Ce dossier éditorial invite à découvrir des démarches artistiques diverses et à donner une place durable à la création dans la vie régionale.",
      ],
      gallery: [artisan, dance, heritage, education],
    },
  ],
  annonces: [
    {
      slug: "appel-projets-culturels",
      title: "Appel à projets culturels : valorisons les initiatives locales",
      category: "Appel à projets",
      date: "6 octobre 2026",
      summary:
        "Associations et acteurs culturels : proposez vos initiatives de transmission et de création.",
      image: exhibition,
      status: "Ouvert",
      body: [
        "Cet exemple d’appel à projets présente les informations nécessaires à un futur dispositif régional. Les projets pourront porter sur la transmission des savoir-faire, la médiation du patrimoine ou la création artistique.",
        "Le dossier comprend une présentation de la structure, les objectifs du projet, un calendrier et un budget prévisionnel. Les critères envisagés sont l’intérêt culturel, la participation des publics et la faisabilité.",
        "Date limite indicative : 30 novembre 2026. Aucun dépôt ni financement réel n’est ouvert sur cette version de présentation.",
      ],
    },
  ],
  agenda: [
    {
      slug: "journees-patrimoine",
      title: "Journées du patrimoine des Plateaux",
      category: "Patrimoine",
      date: "24 octobre 2026",
      day: "24",
      month: "Oct.",
      location: "Atakpamé",
      time: "09 h 00 – 17 h 00",
      summary: "Un rendez-vous pour découvrir l’histoire et les patrimoines qui nous rassemblent.",
      image: heritage,
      body: [
        "Une journée de découverte associant présentations historiques, échanges avec les communautés et ateliers de sensibilisation.",
        "Le programme indicatif prévoit une rencontre sur la mémoire régionale et des activités pour les familles. Les conditions d’accueil et les lieux précis doivent être validés.",
        "Événement de démonstration : date et programme non confirmés. Aucune réservation n’est proposée.",
      ],
    },
  ],
  projets: [
    {
      slug: "transmission-savoir-faire",
      title: "Transmettre les savoir-faire dans les ateliers",
      category: "Formation",
      date: "2026 – 2027",
      status: "En préparation",
      image: artisan,
      summary: "Favoriser le dialogue entre maîtres artisans et jeunes générations.",
      body: [
        "Objectif : encourager la transmission des techniques artisanales et reconnaître les détenteurs de savoirs.",
        "Activités envisagées : ateliers intergénérationnels, documentation des gestes et rencontres de restitution. Le projet associerait artisans, associations et établissements scolaires.",
        "Calendrier indicatif : concertation en 2026, expérimentation en 2027. Résultats attendus : des compétences partagées et une meilleure visibilité des ateliers. Ce programme est un exemple à valider.",
      ],
    },
  ],
  galeries: [
    {
      slug: "gestes-artisans",
      title: "Les gestes et les matières",
      category: "Artisanat",
      date: "5 octobre 2026",
      summary: "Une promenade visuelle au cœur des savoir-faire des Plateaux.",
      image: artisan,
      body: [
        "Une sélection d’illustrations consacrée aux ateliers, aux matières et à la transmission. Les visuels de cette galerie ont été générés pour la présentation du portail.",
      ],
    },
  ],
  videos: [
    {
      slug: "regards-plateaux",
      title: "Regards sur les Plateaux",
      category: "Portrait de territoire",
      date: "5 octobre 2026",
      duration: "00:16",
      image: dance,
      summary: "Une évocation visuelle des paysages, des arts et des savoir-faire.",
      body: [
        "Ce court récit visuel associe des illustrations de danse, de paysages et d’artisanat. Il présente l’univers culturel du portail sans documenter un événement officiel.",
      ],
    },
  ],
  artistes: [
    {
      slug: "ateliers-kpalime",
      title: "Les ateliers de Kpalimé",
      category: "Artisanat",
      location: "Kpalimé",
      date: "2026",
      image: artisan,
      summary: "Tissage, batik et sculpture : des pratiques ancrées dans le territoire.",
      body: [
        "Cette fiche thématique présente les savoir-faire de Kpalimé. Les profils individuels seront ajoutés avec le consentement des artistes.",
      ],
    },
    {
      slug: "creation-atakpame",
      title: "La création à Atakpamé",
      category: "Arts visuels",
      location: "Atakpamé",
      date: "2026",
      image: exhibition,
      summary: "Rencontrer les expressions plastiques et les initiatives associatives.",
      body: [
        "Une présentation thématique de la création locale, à compléter par des profils professionnels vérifiés.",
      ],
    },
    {
      slug: "expressions-notse",
      title: "Les expressions de Notsé",
      category: "Musique et danse",
      location: "Notsé",
      date: "2026",
      image: dance,
      summary: "Des pratiques vivantes au croisement de la musique et de la mémoire.",
      body: [
        "Une fiche consacrée aux pratiques collectives. Les structures et artistes seront présentés après accord.",
      ],
    },
  ],
};
export const pageInfo = {
  "la-direction": {
    title: "La Direction",
    intro: "Au service des arts, des cultures et de la transmission dans la région des Plateaux.",
  },
  missions: {
    title: "Missions et attributions",
    intro:
      "Accompagner la création, préserver le patrimoine et rendre la culture accessible à tous.",
  },
  organisation: {
    title: "Organisation et équipe",
    intro: "Une organisation au service des acteurs culturels et des habitants des Plateaux.",
  },
  actualites: {
    title: "Actualités",
    intro: "Les nouvelles de la création, du patrimoine et de la vie culturelle des Plateaux.",
  },
  annonces: {
    title: "Annonces officielles",
    intro: "Communiqués, appels à projets et informations pratiques pour les acteurs culturels.",
  },
  agenda: {
    title: "Agenda culturel",
    intro: "Des rendez-vous pour découvrir, rencontrer et partager les cultures de notre région.",
  },
  patrimoine: {
    title: "Patrimoine et cultures",
    intro: "Des héritages vivants, des paysages singuliers et des talents à découvrir.",
  },
  "arts-traditionnels": {
    title: "Arts traditionnels",
    intro: "Des gestes, des rythmes et des expressions qui se transmettent entre les générations.",
  },
  "patrimoine-culturel": {
    title: "Patrimoine culturel",
    intro: "Préserver les lieux et les mémoires, partager les richesses de notre territoire.",
  },
  artistes: {
    title: "Artistes et acteurs culturels",
    intro: "À la rencontre des savoir-faire et des expressions artistiques des Plateaux.",
  },
  mediatheque: {
    title: "Médiathèque",
    intro: "Les arts et les cultures des Plateaux en images et en récits.",
  },
  galeries: {
    title: "Galeries photo",
    intro: "Des regards sur les paysages, les gestes et les moments de partage.",
  },
  videos: {
    title: "Vidéos",
    intro: "Des récits visuels pour découvrir les expressions culturelles du territoire.",
  },
  projets: {
    title: "Projets et programmes",
    intro:
      "Des perspectives pour accompagner la transmission, la création et l’accès à la culture.",
  },
  partenaires: {
    title: "Nos partenaires",
    intro: "Faire vivre la culture grâce au dialogue et à la coopération.",
  },
  contact: {
    title: "Contact",
    intro: "Une question, une initiative ou un besoin d’accompagnement ? Entrons en dialogue.",
  },
  faq: {
    title: "Questions fréquentes",
    intro: "Les réponses aux principales questions concernant la Direction et ses activités.",
  },
  recherche: {
    title: "Recherche",
    intro: "Retrouvez une actualité, un rendez-vous ou une ressource culturelle.",
  },
  archives: {
    title: "Archives",
    intro: "Explorez les publications par thème, par catégorie ou par année.",
  },
  "mentions-legales": {
    title: "Mentions légales",
    intro: "Informations relatives à l’édition et à l’utilisation du portail.",
  },
  confidentialite: {
    title: "Politique de confidentialité",
    intro: "Comprendre comment vos informations sont utilisées et protégées.",
  },
  "plan-du-site": {
    title: "Plan du site",
    intro: "Toutes les rubriques du portail culturel des Plateaux.",
  },
};
export const nav = [
  ["Accueil", "/"],
  ["La Direction", "/la-direction"],
  ["Actualités", "/actualites"],
  ["Annonces", "/annonces"],
  ["Agenda culturel", "/agenda"],
  ["Patrimoine et cultures", "/patrimoine"],
  ["Médiathèque", "/mediatheque"],
  ["Projets", "/projets"],
  ["Partenaires", "/partenaires"],
  ["Contact", "/contact"],
] as const;
export function metadata(title: string, description: string, image?: string) {
  return {
    meta: [
      { title: `${title} — Arts & Cultures des Plateaux` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — Arts & Cultures des Plateaux` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(image?.startsWith("https://")
        ? [
            { property: "og:image", content: image },
            { name: "twitter:image", content: image },
          ]
        : []),
    ],
  };
}

export const pagePaths = {
  "la-direction": "/la-direction",
  missions: "/missions",
  organisation: "/organisation",
  actualites: "/actualites",
  annonces: "/annonces",
  agenda: "/agenda",
  patrimoine: "/patrimoine",
  "arts-traditionnels": "/arts-traditionnels",
  "patrimoine-culturel": "/patrimoine-culturel",
  artistes: "/artistes",
  mediatheque: "/mediatheque",
  galeries: "/galeries",
  videos: "/videos",
  projets: "/projets",
  partenaires: "/partenaires",
  contact: "/contact",
  faq: "/faq",
  recherche: "/recherche",
  archives: "/archives",
  "mentions-legales": "/mentions-legales",
  confidentialite: "/confidentialite",
  "plan-du-site": "/plan-du-site",
} as const;
