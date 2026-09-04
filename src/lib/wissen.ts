export interface WissenTopic {
  label: string;
  /** Set once the topic has its own published article. */
  href?: string;
}

export interface WissenTopicCategory {
  name: string;
  topics: WissenTopic[];
}

export interface WissenLink {
  label: string;
  href: string;
}

export const buWissenCategories: WissenTopicCategory[] = [
  {
    name: "Grundlagen",
    topics: [
      { label: "Wie funktioniert eine Berufsunfähigkeitsversicherung?" },
      { label: "Wie hoch sollte die BU-Rente sein?" },
      { label: "Wie lange sollte eine BU laufen?" },
      { label: "Für wen ist eine BU sinnvoll?" },
    ],
  },
  {
    name: "Vertragsgestaltung",
    topics: [{ label: "Leistungsdynamik" }, { label: "Beitragsdynamik" }, { label: "Nachversicherung" }, { label: "Laufzeit & Endalter" }],
  },
  {
    name: "Versicherungsbedingungen",
    topics: [
      { label: "Abstrakte Verweisung" },
      { label: "Konkrete Verweisung" },
      { label: "Prognosezeitraum" },
      { label: "Wichtige BU-Klauseln" },
    ],
  },
  {
    name: "Gesundheit & Antrag",
    topics: [
      { label: "Gesundheitsfragen", href: "/bu-gesundheitsfragen/" },
      { label: "Risikovoranfrage", href: "/bu-risikovoranfrage/" },
      { label: "Vorerkrankungen" },
      { label: "Arztunterlagen" },
    ],
  },
  {
    name: "Alternativen & Sonderfälle",
    topics: [
      { label: "Alternativen zur Berufsunfähigkeitsversicherung" },
      { label: "BU für Beamte" },
      { label: "BU für Selbstständige" },
      { label: "BU für Studenten" },
      { label: "BU für Angestellte" },
    ],
  },
];

export const pkvWissenCategories: WissenTopicCategory[] = [
  {
    name: "Grundlagen",
    topics: [
      { label: "Wie funktioniert die PKV?" },
      { label: "Für wen lohnt sich die PKV?" },
      { label: "PKV vs. GKV" },
      { label: "Voraussetzungen für die PKV" },
    ],
  },
  {
    name: "Beiträge & Tarife",
    topics: [{ label: "Was kostet eine PKV?" }, { label: "Selbstbehalt" }, { label: "Beitragsentwicklung" }, { label: "Tarifwechsel" }],
  },
  {
    name: "Gesundheit & Antrag",
    topics: [
      { label: "Gesundheitsfragen", href: "/pkv-gesundheitsfragen/" },
      { label: "Risikovoranfrage", href: "/pkv-risikovoranfrage/" },
      { label: "Vorerkrankungen" },
      { label: "Gesundheitsprüfung" },
    ],
  },
  {
    name: "Zielgruppen",
    topics: [{ label: "PKV für Angestellte" }, { label: "PKV für Selbstständige" }, { label: "PKV für Beamte" }],
  },
  {
    name: "Wechsel & langfristige Entscheidungen",
    topics: [
      { label: "Wechsel in die PKV" },
      { label: "Zurück in die GKV" },
      { label: "PKV im Alter" },
      { label: "Familienplanung & Kinder" },
      { label: "Tarifoptimierung" },
    ],
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
