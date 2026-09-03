export type RecommendationId = "adam-riese" | "haftpflichtkasse" | "baloise" | "bayerische";

export interface InsurerRecommendation {
  id: RecommendationId;
  insurer: string;
  tariff: string;
  /** Short assessment shown on the four-card overview (section 12). */
  shortAssessment: string;
  logo: string;
  /**
   * Central place to fill in the real checkout link once available.
   * Stays null until then — the wizard renders a disabled "Online-Abschluss folgt"
   * state instead of a non-functional public link.
   */
  checkoutUrl: string | null;
}

export const liabilityRecommendations: Record<RecommendationId, InsurerRecommendation> = {
  "adam-riese": {
    id: "adam-riese",
    insurer: "Adam Riese",
    tariff: "riesig",
    shortAssessment:
      "Sehr günstig und gute Onlineprozesse. Für klassische Fälle meine erste Wahl, solange die Entscheidungsmatrix dies zulässt.",
    logo: "/images/insurers/adam-riese.svg",
    checkoutUrl: null,
  },
  haftpflichtkasse: {
    id: "haftpflichtkasse",
    insurer: "Die Haftpflichtkasse",
    tariff: "Einfach komplett",
    shortAssessment: "Für mich besonders stark bei Service und Leistung.",
    logo: "/images/insurers/haftpflichtkasse.svg",
    checkoutUrl: null,
  },
  baloise: {
    id: "baloise",
    insurer: "Baloise",
    tariff: "Ambiente Top All-in",
    shortAssessment:
      "Preislich sehr attraktiv und deshalb insbesondere bei Beamten eine interessante Alternative, wenn der Preis stärker gewichtet wird.",
    logo: "/images/insurers/baloise.svg",
    checkoutUrl: null,
  },
  bayerische: {
    id: "bayerische",
    insurer: "Die Bayerische",
    tariff: "Prestige",
    shortAssessment:
      "Meine Lösung für besondere Beamtenkonstellationen und Fälle, in denen die benötigte Dienst- bzw. Amtshaftpflicht über die normale Auswahl nicht sauber abgebildet werden kann.",
    logo: "/images/insurers/die-bayerische.svg",
    checkoutUrl: null,
  },
};

export type StepId = "beamter" | "alter" | "sonderfall" | "prioritaet" | "haushalt";

export interface WizardOption {
  label: string;
  value: string;
  /** Next step, a final recommendation, or the "unsure" contact bridge. */
  next: StepId | RecommendationId | "unsure";
  /** Short reasoning shown on the result card when this option leads there. */
  reason?: string;
}

export interface WizardStep {
  id: StepId;
  question: string;
  hint?: string;
  options: WizardOption[];
}

export const wizardSteps: Record<StepId, WizardStep> = {
  beamter: {
    id: "beamter",
    question: "Bist du Beamter bzw. Beamtin im aktiven Dienst?",
    options: [
      { label: "Nein", value: "nein", next: "alter" },
      { label: "Ja", value: "ja", next: "sonderfall" },
    ],
  },
  alter: {
    id: "alter",
    question: "Bist du 60 Jahre oder älter?",
    options: [
      {
        label: "Nein",
        value: "nein",
        next: "adam-riese",
        reason: "Du bist kein Beamter im aktiven Dienst und unter 60. Für diesen klassischen Fall ist Adam Riese aufgrund des sehr attraktiven Beitrags und der guten Onlineprozesse meine erste Wahl.",
      },
      {
        label: "Ja",
        value: "ja",
        next: "haftpflichtkasse",
        reason: "Für Kunden ab 60 ist die Haftpflichtkasse in meiner Entscheidungsmatrix meine bevorzugte Lösung.",
      },
    ],
  },
  sonderfall: {
    id: "sonderfall",
    question: "Benötigst du eine besondere Dienst-/Amtshaftpflicht oder lässt sich deine konkrete Tätigkeit bei der Haftpflichtkasse nicht sauber abbilden?",
    hint: "Wenn du nicht sicher bist, wähle „Ich bin unsicher“.",
    options: [
      {
        label: "Ja",
        value: "ja",
        next: "bayerische",
        reason: "Bei deiner Beamtenkonstellation möchte ich die Dienst- bzw. Amtshaftpflicht sauber abbilden. Für diesen Sonderfall ist die Bayerische meine Empfehlung.",
      },
      { label: "Ich bin unsicher", value: "unsicher", next: "unsure" },
      { label: "Nein", value: "nein", next: "prioritaet" },
    ],
  },
  prioritaet: {
    id: "prioritaet",
    question: "Was ist dir wichtiger?",
    options: [
      {
        label: "Sehr guter Service – dafür dürfen es auch ein paar Euro mehr sein.",
        value: "service",
        next: "haftpflichtkasse",
        reason: "Du legst besonderen Wert auf sehr guten Service. Genau deshalb würde ich in deiner Situation zur Haftpflichtkasse greifen.",
      },
      {
        label: "Ein möglichst attraktiver Preis bei trotzdem sehr guter Absicherung.",
        value: "preis",
        next: "baloise",
        reason: "Du bist Beamter im aktiven Dienst und möchtest einen starken Versicherungsschutz mit besonders attraktivem Preis. Dafür ist die Baloise in meiner Auswahl die passende Lösung.",
      },
    ],
  },
  haushalt: {
    id: "haushalt",
    question: "Wer soll versichert werden?",
    options: [
      { label: "Nur ich", value: "nur-ich", next: "haushalt" },
      { label: "Ich und mein Partner / meine Partnerin", value: "paar", next: "haushalt" },
      { label: "Familie", value: "familie", next: "haushalt" },
    ],
  },
};

export const decisionMatrix: { profile: string; recommendation: RecommendationId }[] = [
  { profile: "Singles, Paare & Familien, nicht Beamter und unter 60", recommendation: "adam-riese" },
  { profile: "Nicht-Beamte ab 60", recommendation: "haftpflichtkasse" },
  { profile: "Beamte im aktiven Dienst, Fokus Service", recommendation: "haftpflichtkasse" },
  { profile: "Beamte im aktiven Dienst, Fokus Preis", recommendation: "baloise" },
  { profile: "Beamte mit besonderer Dienst-/Amtshaftpflicht bzw. Sonderfall", recommendation: "bayerische" },
];
