export type GuideCategory = "Reisen & Ausland" | "Haftung & Recht" | "Gesundheit & Vorsorge" | "Wohnen & Eigentum" | "Tiere";

export const guideCategories: GuideCategory[] = ["Reisen & Ausland", "Haftung & Recht", "Gesundheit & Vorsorge", "Wohnen & Eigentum", "Tiere"];

export const categoryAnchors: Record<GuideCategory, string> = {
  "Reisen & Ausland": "reisen-ausland",
  "Haftung & Recht": "haftung-recht",
  "Gesundheit & Vorsorge": "gesundheit-vorsorge",
  "Wohnen & Eigentum": "wohnen-eigentum",
  Tiere: "tiere",
};

export interface GuideRating {
  sinnhaftigkeit: number;
  beratungsbedarf: number;
  note: string;
}

export interface Guide {
  slug: string;
  title: string;
  category: GuideCategory;
  /** Used in the "Alle Ratgeber" category listing (Section 4). */
  teaser: string;
  /** Used in "Häufig gesucht" (Section 3), falls back to `teaser` when unset. */
  featuredTeaser?: string;
  /** Used in "Meine aktuellen Empfehlungen" (Section 7), falls back to `teaser` when unset. */
  recommendedTeaser?: string;
  /** Used in "Neu & aktualisiert" (Section 8). */
  updatedNote?: string;
  status: "coming-soon" | "published";
  featured: boolean;
  recommended: boolean;
  recentlyUpdated: boolean;
  rating?: GuideRating;
  /** ISO date, only set when recentlyUpdated is true. */
  updatedAt?: string;
}

export const guides: Guide[] = [
  // Reisen & Ausland
  {
    slug: "auslandskrankenversicherung",
    title: "Auslandskrankenversicherung",
    category: "Reisen & Ausland",
    teaser: "Was sie leistet, warum ich sie für die meisten Auslandsreisen sinnvoll finde und worauf du bei der Tarifauswahl achten solltest.",
    featuredTeaser:
      "Kleine Beiträge, aber im Ernstfall ein großer Unterschied. Ich zeige dir, warum ich eine Auslandskrankenversicherung für sinnvoll halte und worauf ich bei einem Tarif achten würde.",
    recommendedTeaser: "Welche Leistungen ich wichtig finde und welchen Tarif ich aktuell für normale Urlaubsreisen interessant finde.",
    updatedNote: "Tarifauswahl und Inhalte zuletzt geprüft.",
    status: "published",
    featured: true,
    recommended: true,
    recentlyUpdated: true,
    rating: {
      sinnhaftigkeit: 5,
      beratungsbedarf: 1,
      note: "Für eine gewöhnliche Urlaubsreise lässt sich eine passende Auslandskrankenversicherung häufig relativ unkompliziert auswählen.",
    },
    updatedAt: "2026-08-26",
  },
  {
    slug: "reiseruecktrittsversicherung",
    title: "Reiserücktrittsversicherung",
    category: "Reisen & Ausland",
    teaser: "Wann sich eine Reiserücktrittsversicherung lohnen kann – und wann du sie möglicherweise gar nicht brauchst.",
    status: "coming-soon",
    featured: false,
    recommended: false,
    recentlyUpdated: false,
  },

  // Haftung & Recht
  {
    slug: "privathaftpflichtversicherung",
    title: "Privathaftpflichtversicherung",
    category: "Haftung & Recht",
    teaser: "Welche Leistungen für mich wirklich wichtig sind und warum ein Blick in bestehende Verträge sinnvoll sein kann.",
    featuredTeaser: "Für mich gehört sie zu den wichtigsten Versicherungen überhaupt. Entscheidend ist aber nicht nur, dass du eine hast – sondern wie gut du abgesichert bist.",
    recommendedTeaser: "Welche Tarifmerkmale für mich entscheidend sind und worauf ich bei einer modernen Privathaftpflicht achten würde.",
    updatedNote: "Leistungskriterien und Empfehlungen zuletzt geprüft.",
    status: "published",
    featured: true,
    recommended: true,
    recentlyUpdated: true,
    updatedAt: "2026-09-03",
  },
  {
    slug: "hundehalterhaftpflichtversicherung",
    title: "Hundehalterhaftpflichtversicherung",
    category: "Haftung & Recht",
    teaser: "Welche Schäden abgesichert werden und worauf Hundehalter bei ihrer Absicherung achten sollten.",
    recommendedTeaser: "Welche Leistungen Hundehalter prüfen sollten und welche Lösungen ich mir aktuell genauer ansehen würde.",
    status: "coming-soon",
    featured: false,
    recommended: true,
    recentlyUpdated: false,
  },
  {
    slug: "rechtsschutzversicherung",
    title: "Rechtsschutzversicherung",
    category: "Haftung & Recht",
    teaser: "Privat, Beruf, Verkehr oder Wohnen? Ich zeige dir, welche Bereiche es gibt und wie ich ihren Nutzen einschätze.",
    featuredTeaser: "Rechtsschutz kann sinnvoll sein – aber nicht jeder Baustein ist für jeden notwendig. Ich zeige dir, wie ich das Thema einordne und worauf ich bei der Auswahl achten würde.",
    updatedNote: "Inhalte und Einschätzung zuletzt überprüft.",
    status: "coming-soon",
    featured: true,
    recommended: false,
    recentlyUpdated: true,
    updatedAt: "2026-08-21",
  },

  // Gesundheit & Vorsorge
  {
    slug: "zahnzusatzversicherung",
    title: "Zahnzusatzversicherung",
    category: "Gesundheit & Vorsorge",
    teaser: "Welche Leistungen entscheidend sein können und warum hohe Prozentangaben allein noch keinen guten Tarif ausmachen.",
    featuredTeaser: "Hohe Erstattungen klingen gut. Entscheidend ist allerdings, was ein Tarif tatsächlich leistet, wenn größere Behandlungen anstehen.",
    status: "coming-soon",
    featured: true,
    recommended: false,
    recentlyUpdated: false,
  },
  {
    slug: "unfallversicherung",
    title: "Unfallversicherung",
    category: "Gesundheit & Vorsorge",
    teaser: "Was eine private Unfallversicherung leistet, wo ihre Grenzen liegen und für wen ich sie besonders interessant finde.",
    status: "coming-soon",
    featured: false,
    recommended: false,
    recentlyUpdated: false,
  },
  {
    slug: "risikolebensversicherung",
    title: "Risikolebensversicherung",
    category: "Gesundheit & Vorsorge",
    teaser: "Wann die Absicherung besonders wichtig wird und wie du die passende Versicherungssumme einordnen kannst.",
    status: "coming-soon",
    featured: false,
    recommended: false,
    recentlyUpdated: false,
  },

  // Wohnen & Eigentum
  {
    slug: "hausratversicherung",
    title: "Hausratversicherung",
    category: "Wohnen & Eigentum",
    teaser: "Was eigentlich zu deinem Hausrat gehört, welche Gefahren abgesichert werden und wann eine Hausratversicherung sinnvoll sein kann.",
    status: "coming-soon",
    featured: false,
    recommended: false,
    recentlyUpdated: false,
  },
  {
    slug: "wohngebaeudeversicherung",
    title: "Wohngebäudeversicherung",
    category: "Wohnen & Eigentum",
    teaser: "Für Immobilieneigentümer eine zentrale Absicherung. Ich zeige dir, welche Punkte ich bei einem Vertrag besonders prüfen würde.",
    status: "coming-soon",
    featured: false,
    recommended: false,
    recentlyUpdated: false,
  },
  {
    slug: "elementarschadenversicherung",
    title: "Elementarschadenversicherung",
    category: "Wohnen & Eigentum",
    teaser: "Starkregen, Überschwemmung und weitere Naturgefahren: Was der zusätzliche Schutz leisten kann und warum das Thema zunehmend relevant ist.",
    status: "coming-soon",
    featured: false,
    recommended: false,
    recentlyUpdated: false,
  },

  // Tiere
  {
    slug: "hundekrankenversicherung",
    title: "Hundekrankenversicherung",
    category: "Tiere",
    teaser: "OP-Versicherung oder vollständiger Krankenschutz? Ich zeige dir die Unterschiede und worauf ich als Hundehalter achten würde.",
    status: "coming-soon",
    featured: false,
    recommended: false,
    recentlyUpdated: false,
  },
  {
    slug: "katzenkrankenversicherung",
    title: "Katzenkrankenversicherung",
    category: "Tiere",
    teaser: "Welche Möglichkeiten es gibt, Tierarztkosten abzusichern und wann sich welcher Schutz eignen kann.",
    status: "coming-soon",
    featured: false,
    recommended: false,
    recentlyUpdated: false,
  },
];

export function guideHref(slug: string): string {
  return `/ratgeber/${slug}/`;
}

export const featuredGuides = guides.filter((g) => g.featured);
export const recommendedGuides = guides.filter((g) => g.recommended);
export const recentlyUpdatedGuides = guides
  .filter((g) => g.status === "published" && g.recentlyUpdated && g.updatedAt)
  .sort((a, b) => (b.updatedAt! > a.updatedAt! ? 1 : -1));

export function guidesByCategory(category: GuideCategory): Guide[] {
  return guides.filter((g) => g.category === category);
}
