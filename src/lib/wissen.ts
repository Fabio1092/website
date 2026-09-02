export interface WissenTopicCategory {
  name: string;
  topics: string[];
}

export interface WissenLink {
  label: string;
  href: string;
}

export const buWissenCategories: WissenTopicCategory[] = [
  {
    name: "Grundlagen",
    topics: [
      "Wie funktioniert eine Berufsunfähigkeitsversicherung?",
      "Wie hoch sollte die BU-Rente sein?",
      "Wie lange sollte eine BU laufen?",
      "Für wen ist eine BU sinnvoll?",
    ],
  },
  {
    name: "Vertragsgestaltung",
    topics: ["Leistungsdynamik", "Beitragsdynamik", "Nachversicherung", "Laufzeit & Endalter"],
  },
  {
    name: "Versicherungsbedingungen",
    topics: ["Abstrakte Verweisung", "Konkrete Verweisung", "Prognosezeitraum", "Wichtige BU-Klauseln"],
  },
  {
    name: "Gesundheit & Antrag",
    topics: ["Gesundheitsfragen", "Risikovoranfrage", "Vorerkrankungen", "Arztunterlagen"],
  },
  {
    name: "Alternativen & Sonderfälle",
    topics: [
      "Alternativen zur Berufsunfähigkeitsversicherung",
      "BU für Beamte",
      "BU für Selbstständige",
      "BU für Studenten",
      "BU für Angestellte",
    ],
  },
];

export const pkvWissenCategories: WissenTopicCategory[] = [
  {
    name: "Grundlagen",
    topics: ["Wie funktioniert die PKV?", "Für wen lohnt sich die PKV?", "PKV vs. GKV", "Voraussetzungen für die PKV"],
  },
  {
    name: "Beiträge & Tarife",
    topics: ["Was kostet eine PKV?", "Selbstbehalt", "Beitragsentwicklung", "Tarifwechsel"],
  },
  {
    name: "Gesundheit & Antrag",
    topics: ["Gesundheitsfragen", "Risikovoranfrage", "Vorerkrankungen", "Gesundheitsprüfung"],
  },
  {
    name: "Zielgruppen",
    topics: ["PKV für Angestellte", "PKV für Selbstständige", "PKV für Beamte"],
  },
  {
    name: "Wechsel & langfristige Entscheidungen",
    topics: ["Wechsel in die PKV", "Zurück in die GKV", "PKV im Alter", "Familienplanung & Kinder", "Tarifoptimierung"],
  },
];

export const buAvailableLinks: WissenLink[] = [
  { label: "Gesundheitsfragen bei der BU", href: "/bu-gesundheitsfragen/" },
  { label: "Risikovoranfrage zur BU", href: "/bu-risikovoranfrage/" },
  { label: "BU für Angestellte", href: "/bu-angestellte-kassel/" },
  { label: "BU für Selbstständige", href: "/bu-selbststaendige-kassel/" },
  { label: "BU für Beamte", href: "/bu-beamte-kassel/" },
  { label: "BU für Studenten", href: "/bu-studenten-kassel/" },
];

export const pkvAvailableLinks: WissenLink[] = [
  { label: "Gesundheitsfragen bei der PKV", href: "/pkv-gesundheitsfragen/" },
  { label: "Risikovoranfrage zur PKV", href: "/pkv-risikovoranfrage/" },
  { label: "PKV für Angestellte", href: "/pkv-angestellte-kassel/" },
  { label: "PKV für Selbstständige", href: "/pkv-selbststaendige-kassel/" },
  { label: "PKV für Beamte", href: "/pkv-beamte-kassel/" },
];
