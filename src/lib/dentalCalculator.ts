// Zahnersatz-/Zahnzusatzrechner: zentrale Konfiguration + Berechnungslogik.
// Alle Kosten-, GKV- und Tarifwerte werden ausschließlich hier gepflegt und
// von der UI (DentalCostSimulator.tsx) nur gelesen, nie dupliziert.

export type TreatmentId = "inlay" | "crown" | "bridge" | "implant";
export type GkvModel = "filling" | "crown" | "single-tooth-gap";
export type BonusLevel = "none" | "bonus5" | "bonus10";
export type TariffLevel = 75 | 90 | 100;

export interface DentalTreatmentConfig {
  id: TreatmentId;
  label: string;
  description: string;
  /** Orientierungswert, kein verbindlicher Zahnarztpreis. */
  defaultCost: number;
  costRangeLabel: string;
  gkvModel: GkvModel;
}

/** Beispiel- und Orientierungswerte – ausdrücklich keine verbindlichen Zahnarztpreise. */
export const dentalTreatments: Record<TreatmentId, DentalTreatmentConfig> = {
  inlay: {
    id: "inlay",
    label: "Keramik-Inlay",
    description: "Hochwertige Einlagefüllung",
    defaultCost: 900,
    costRangeLabel: "ca. 300–900 €",
    gkvModel: "filling",
  },
  crown: {
    id: "crown",
    label: "Vollkeramikkrone",
    description: "Hochwertige Versorgung eines Zahns",
    defaultCost: 1000,
    costRangeLabel: "ca. 550–1.150 €",
    gkvModel: "crown",
  },
  bridge: {
    id: "bridge",
    label: "Brücke",
    description: "3-gliedrige Brücke bei einem fehlenden Zahn",
    defaultCost: 2000,
    costRangeLabel: "ca. 1.400–2.100 €",
    gkvModel: "single-tooth-gap",
  },
  implant: {
    id: "implant",
    label: "Implantat",
    description: "Einzelimplantat inkl. Zahnersatz/Krone",
    defaultCost: 2900,
    costRangeLabel: "ca. 2.600–3.000 €",
    gkvModel: "single-tooth-gap",
  },
};

export const treatmentOrder: TreatmentId[] = ["inlay", "crown", "bridge", "implant"];

export const bonusLevelLabels: Record<BonusLevel, string> = {
  none: "Kein bzw. weniger als 5 Jahre Bonus",
  bonus5: "Mindestens 5 Jahre lückenlos",
  bonus10: "Mindestens 10 Jahre lückenlos",
};

export const bonusLevelOrder: BonusLevel[] = ["none", "bonus5", "bonus10"];

/**
 * GKV-Modellrechnung 2026 (vereinfacht). Kronen/Brücken/Implantate folgen dem
 * Festzuschusssystem für einen zahnbegrenzte-Lücke- bzw. Kronen-Musterbefund,
 * Inlays folgen NICHT diesem System und bleiben deshalb bonusunabhängig.
 */
export const gkvContributions: Record<GkvModel, Record<BonusLevel, number>> = {
  filling: { none: 40, bonus5: 40, bonus10: 40 },
  crown: { none: 239.03, bonus5: 278.87, bonus10: 298.79 },
  "single-tooth-gap": { none: 552.96, bonus5: 645.12, bonus10: 691.2 },
};

export interface DentalTariffConfig {
  level: TariffLevel;
  name: string;
  coverageRate: number;
  /** [1. Kalenderjahr, 1.–2. zusammen, 1.–3. zusammen] – jeweils Höchstbetrag in Euro. */
  staircase: [number, number, number];
  pitch: string;
}

export const dentalTariffs: Record<TariffLevel, DentalTariffConfig> = {
  75: {
    level: 75,
    name: "Allianz MeinZahnschutz 75",
    coverageRate: 0.75,
    staircase: [1000, 1500, 2000],
    pitch: "Du bist bereit, bei hochwertigem Zahnersatz einen größeren Teil selbst zu tragen.",
  },
  90: {
    level: 90,
    name: "Allianz MeinZahnschutz 90",
    coverageRate: 0.9,
    staircase: [1000, 2000, 3000],
    pitch: "Du möchtest deinen möglichen Eigenanteil deutlich begrenzen.",
  },
  100: {
    level: 100,
    name: "Allianz MeinZahnschutz 100",
    coverageRate: 1,
    staircase: [1000, 2500, 4000],
    pitch: "Du möchtest bei erstattungsfähigem hochwertigem Zahnersatz das höchste der drei Leistungsniveaus.",
  },
};

export const tariffOrder: TariffLevel[] = [75, 90, 100];

export interface StaircaseRow {
  label: string;
  amount: number | null;
  note?: string;
}

export function getStaircaseRows(tariff: DentalTariffConfig): StaircaseRow[] {
  const [year1, year12, year123] = tariff.staircase;
  return [
    { label: "1. Kalenderjahr", amount: year1 },
    { label: "1.–2. Kalenderjahr zusammen", amount: year12 },
    { label: "1.–3. Kalenderjahr zusammen", amount: year123 },
    { label: "ab 4. Kalenderjahr", amount: null, note: "keine Zahnstaffel-Begrenzung innerhalb dieser Staffel" },
  ];
}

// ---------------------------------------------------------------------------
// Online-Abschluss (Allianz) — zentral, nicht mehrfach hardcoden.
// ---------------------------------------------------------------------------

export const ALLIANZ_DENTAL_CHECKOUT_URL =
  "https://www.allianz.de/angebot/kooperation/gesundheit/zahnzusatzversicherung/rechner/#Fonds_Finanz_Maklerservice_GmbH?fom2=MAK170460";

/** Vorbereitet für spätere tarifabhängige Deep-Links; aktuell ein gemeinsamer Link. */
export const dentalCheckoutUrls: Record<TariffLevel, string> = {
  75: ALLIANZ_DENTAL_CHECKOUT_URL,
  90: ALLIANZ_DENTAL_CHECKOUT_URL,
  100: ALLIANZ_DENTAL_CHECKOUT_URL,
};

export function getDentalCheckoutUrl(tariff: TariffLevel): string {
  return dentalCheckoutUrls[tariff];
}

// ---------------------------------------------------------------------------
// Berechnung — vollständig getrennt von der Darstellung.
// ---------------------------------------------------------------------------

export interface DentalScenarioInput {
  treatmentId: TreatmentId;
  treatmentCost: number;
  bonusLevel: BonusLevel;
  /** 0 liefert die Modellrechnung "ohne Zahnzusatzversicherung". */
  coverageRate: number;
}

export interface DentalScenarioResult {
  treatmentCost: number;
  gkvContribution: number;
  ownWithoutSupplementary: number;
  coverageRate: number;
  targetTotalReimbursement: number;
  supplementaryPayment: number;
  ownWithSupplementary: number;
}

export function getGkvContribution(treatmentId: TreatmentId, bonusLevel: BonusLevel): number {
  const gkvModel = dentalTreatments[treatmentId].gkvModel;
  return gkvContributions[gkvModel][bonusLevel];
}

export function calculateDentalScenario({
  treatmentId,
  treatmentCost,
  bonusLevel,
  coverageRate,
}: DentalScenarioInput): DentalScenarioResult {
  const safeCost = Number.isFinite(treatmentCost) && treatmentCost > 0 ? treatmentCost : 0;
  const rawGkvContribution = getGkvContribution(treatmentId, bonusLevel);
  // GKV darf die Behandlungskosten bei manuell reduzierten Preisen nie übersteigen.
  const gkvContribution = Math.min(rawGkvContribution, safeCost);
  const ownWithoutSupplementary = Math.max(0, safeCost - gkvContribution);

  const targetTotalReimbursement = safeCost * coverageRate;
  const supplementaryPayment = Math.min(
    safeCost - gkvContribution,
    Math.max(0, targetTotalReimbursement - gkvContribution),
  );
  const ownWithSupplementary = Math.max(0, safeCost - gkvContribution - supplementaryPayment);

  return {
    treatmentCost: safeCost,
    gkvContribution,
    ownWithoutSupplementary,
    coverageRate,
    targetTotalReimbursement,
    supplementaryPayment,
    ownWithSupplementary,
  };
}

const euroFormatter = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export function formatEuro(value: number): string {
  if (!Number.isFinite(value)) return "–";
  return euroFormatter.format(value);
}
