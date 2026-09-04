import { siteConfig } from "@/lib/site";

export type RecommendationId = "adam-riese" | "haftpflichtkasse" | "baloise" | "bayerische";

export interface InsurerRecommendation {
  id: RecommendationId;
  insurer: string;
  tariff: string;
  /** Short assessment shown on the four-card overview. */
  shortAssessment: string;
  logo: string;
}

export const liabilityRecommendations: Record<RecommendationId, InsurerRecommendation> = {
  "adam-riese": {
    id: "adam-riese",
    insurer: "Adam Riese",
    tariff: "riesig",
    shortAssessment:
      "Sehr günstig und gute Onlineprozesse. Für den klassischen Fall ohne Besonderheiten meine erste Empfehlung.",
    logo: "/images/insurers/adam-riese.png",
  },
  haftpflichtkasse: {
    id: "haftpflichtkasse",
    insurer: "Die Haftpflichtkasse",
    tariff: "Einfach komplett",
    shortAssessment: "Für mich besonders stark bei Service und Leistung.",
    logo: "/images/insurers/haftpflichtkasse.png",
  },
  baloise: {
    id: "baloise",
    insurer: "Baloise",
    tariff: "Ambiente Top All-in",
    shortAssessment:
      "Preislich sehr attraktiv und deshalb insbesondere bei Beamten eine interessante Alternative, wenn der Preis stärker gewichtet wird.",
    logo: "/images/insurers/baloise.png",
  },
  bayerische: {
    id: "bayerische",
    insurer: "Die Bayerische",
    tariff: "Prestige",
    shortAssessment:
      "Meine Lösung für besondere Beamtenkonstellationen und Fälle, in denen die benötigte Dienst- bzw. Amtshaftpflicht über die normale Auswahl nicht sauber abgebildet werden kann.",
    logo: "/images/insurers/die-bayerische.webp",
  },
};

export type StepId = "haushalt" | "beamter" | "alter" | "sonderfall" | "prioritaet";

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
  haushalt: {
    id: "haushalt",
    question: "Wer soll versichert werden?",
    options: [
      { label: "Nur ich", value: "single", next: "beamter" },
      { label: "Ich und mein Partner / meine Partnerin", value: "couple", next: "beamter" },
      { label: "Familie", value: "family", next: "beamter" },
    ],
  },
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
        reason:
          "Du bist kein Beamter im aktiven Dienst und unter 60. Für diesen klassischen Fall ist Adam Riese aufgrund des sehr attraktiven Beitrags und der guten digitalen Prozesse meine erste Wahl.",
      },
      {
        label: "Ja",
        value: "ja",
        next: "haftpflichtkasse",
        reason: "Für Kunden ab 60 ist die Haftpflichtkasse meine bevorzugte Lösung.",
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
        reason:
          "Bei deiner Beamtenkonstellation möchte ich die Dienst- bzw. Amtshaftpflicht sauber abbilden. Für diesen Sonderfall ist die Bayerische meine Empfehlung.",
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
};

export const decisionMatrix: { profile: string; recommendation: RecommendationId }[] = [
  { profile: "Nicht Beamter, unter 60", recommendation: "adam-riese" },
  { profile: "Nicht Beamter, ab 60", recommendation: "haftpflichtkasse" },
  { profile: "Beamter, Service wichtiger", recommendation: "haftpflichtkasse" },
  { profile: "Beamter, Preis stärker im Fokus", recommendation: "baloise" },
  { profile: "Besondere Dienst-/Amtshaftpflicht bzw. Sonderfall", recommendation: "bayerische" },
];

// ---------------------------------------------------------------------------
// WhatsApp handoff (replaces the previous direct-checkout flow entirely)
// ---------------------------------------------------------------------------

export type Household = "single" | "couple" | "family";

export const householdLabels: Record<Household, string> = {
  single: "Nur ich",
  couple: "Ich und mein Partner / meine Partnerin",
  family: "Familie",
};

const civilServantLabels: Record<"ja" | "nein", string> = { ja: "Ja", nein: "Nein" };
const ageGroupLabels: Record<"unter60" | "ab60", string> = { unter60: "unter 60", ab60: "60 oder älter" };
const officialLiabilityLabels: Record<"ja" | "nein", string> = { ja: "Ja", nein: "Nein" };
const priorityLabels: Record<"service" | "preis", string> = {
  service: "Sehr guter Service – dafür dürfen es auch ein paar Euro mehr sein.",
  preis: "Ein möglichst attraktiver Preis bei trotzdem sehr guter Absicherung.",
};

/** Only the fields actually asked along the taken decision path are set. */
export interface WizardAnswers {
  household?: Household;
  civilServant?: "ja" | "nein";
  ageGroup?: "unter60" | "ab60";
  officialLiability?: "ja" | "nein";
  priority?: "service" | "preis";
}

export interface AnswerSummaryLine {
  label: string;
  value: string;
}

/** Drives both the on-page "Deine Angaben" summary and the WhatsApp message — single source of truth. */
export function buildAnswerSummary(answers: WizardAnswers): AnswerSummaryLine[] {
  const lines: AnswerSummaryLine[] = [];
  if (answers.household) lines.push({ label: "Versicherungsschutz für", value: householdLabels[answers.household] });
  if (answers.civilServant) lines.push({ label: "Beamter im aktiven Dienst", value: civilServantLabels[answers.civilServant] });
  if (answers.ageGroup) lines.push({ label: "Alter", value: ageGroupLabels[answers.ageGroup] });
  if (answers.officialLiability) lines.push({ label: "Dienst-/Amtshaftpflicht", value: officialLiabilityLabels[answers.officialLiability] });
  if (answers.priority) lines.push({ label: "Priorität", value: priorityLabels[answers.priority] });
  return lines;
}

export function buildWhatsAppMessage(recommendation: InsurerRecommendation, answers: WizardAnswers): string {
  const summary = buildAnswerSummary(answers);
  const lines = [
    "Hallo Fabio,",
    "",
    "ich habe deine Empfehlungshilfe zur Privathaftpflicht genutzt und möchte den empfohlenen Tarif gerne umsetzen.",
    "",
    "Meine Empfehlung:",
    `Gesellschaft: ${recommendation.insurer}`,
    `Tarif: ${recommendation.tariff}`,
    "",
    "Meine Angaben:",
    ...summary.map((line) => `${line.label}: ${line.value}`),
    "",
    "Bitte gib mir kurz Bescheid, welche Angaben oder Unterlagen du für den Abschluss noch von mir benötigst.",
    "",
    "Viele Grüße",
  ];
  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string): string {
  return `${siteConfig.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

export const beamterUnsureMessage = `Hallo Fabio,

ich bin Beamter bzw. Beamtin und interessiere mich für eine Privathaftpflicht mit Dienst-/Amtshaftpflicht.

Ich bin mir bei meiner konkreten Tätigkeit allerdings unsicher, welche Lösung passend ist.

Meine Tätigkeit / Berufsbezeichnung:
[bitte ergänzen]

Kannst du mir kurz sagen, welche Variante du empfehlen würdest?

Viele Grüße`;

export const beamterUnsureWhatsAppUrl = buildWhatsAppUrl(beamterUnsureMessage);
