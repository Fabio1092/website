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
    topics: [
      { label: "Leistungsdynamik", href: "/wissen/berufsunfaehigkeitsversicherung/leistungsdynamik/" },
      { label: "Beitragsdynamik" },
      { label: "Nachversicherung" },
      { label: "Endalter in der BU", href: "/wissen/berufsunfaehigkeitsversicherung/endalter/" },
    ],
  },
  {
    name: "Versicherungsbedingungen",
    topics: [
      { label: "Abstrakte Verweisung", href: "/wissen/berufsunfaehigkeitsversicherung/abstrakte-verweisung/" },
      { label: "Konkrete Verweisung", href: "/wissen/berufsunfaehigkeitsversicherung/konkrete-verweisung/" },
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
      { label: "BU für Beamte", href: "/bu-beamte-kassel/" },
      { label: "BU für Selbstständige", href: "/bu-selbststaendige-kassel/" },
      { label: "BU für Studenten", href: "/bu-studenten-kassel/" },
      { label: "BU für Angestellte", href: "/bu-angestellte-kassel/" },
    ],
  },
];

export const pkvWissenCategories: WissenTopicCategory[] = [
  {
    name: "Grundlagen",
    topics: [
      { label: "Wie funktioniert die private Krankenversicherung?", href: "/wissen/private-krankenversicherung/wie-funktioniert-die-pkv/" },
      { label: "Für wen lohnt sich die PKV?" },
      { label: "GKV oder PKV? Gesetzliche und private Krankenversicherung im Vergleich", href: "/wissen/private-krankenversicherung/gkv-oder-pkv/" },
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
    topics: [
      { label: "PKV für Angestellte", href: "/pkv-angestellte-kassel/" },
      { label: "PKV für Selbstständige", href: "/pkv-selbststaendige-kassel/" },
      { label: "PKV für Beamte", href: "/pkv-beamte-kassel/" },
    ],
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
  { label: "Leistungsdynamik in der BU", href: "/wissen/berufsunfaehigkeitsversicherung/leistungsdynamik/" },
  { label: "Endalter in der BU", href: "/wissen/berufsunfaehigkeitsversicherung/endalter/" },
  { label: "Abstrakte Verweisung in der BU", href: "/wissen/berufsunfaehigkeitsversicherung/abstrakte-verweisung/" },
  { label: "Konkrete Verweisung in der BU", href: "/wissen/berufsunfaehigkeitsversicherung/konkrete-verweisung/" },
  { label: "Gesundheitsfragen bei der BU", href: "/bu-gesundheitsfragen/" },
  { label: "Risikovoranfrage zur BU", href: "/bu-risikovoranfrage/" },
  { label: "BU für Angestellte", href: "/bu-angestellte-kassel/" },
  { label: "BU für Selbstständige", href: "/bu-selbststaendige-kassel/" },
  { label: "BU für Beamte", href: "/bu-beamte-kassel/" },
  { label: "BU für Studenten", href: "/bu-studenten-kassel/" },
];

export const pkvAvailableLinks: WissenLink[] = [
  { label: "Wie funktioniert die private Krankenversicherung?", href: "/wissen/private-krankenversicherung/wie-funktioniert-die-pkv/" },
  { label: "GKV oder PKV? Gesetzliche und private Krankenversicherung im Vergleich", href: "/wissen/private-krankenversicherung/gkv-oder-pkv/" },
  { label: "Gesundheitsfragen bei der PKV", href: "/pkv-gesundheitsfragen/" },
  { label: "Risikovoranfrage zur PKV", href: "/pkv-risikovoranfrage/" },
  { label: "PKV für Angestellte", href: "/pkv-angestellte-kassel/" },
  { label: "PKV für Selbstständige", href: "/pkv-selbststaendige-kassel/" },
  { label: "PKV für Beamte", href: "/pkv-beamte-kassel/" },
];
