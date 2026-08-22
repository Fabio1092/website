export interface KpiField {
  id: string;
  label: string;
  unit: string;
  decimals: number;
  /** Whether a rising value is an improvement (colors the delta accordingly). */
  higherIsBetter: boolean;
}

export interface KpiEntry {
  date: string;
  values: Record<string, number>;
}

export interface KpiData {
  fields: KpiField[];
  entries: KpiEntry[];
}
