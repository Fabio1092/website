import type { KpiData, KpiEntry, KpiField } from "./types";

const STORAGE_KEY = "fr-makler-kpi-dashboard-v1";

export const DEFAULT_FIELDS: KpiField[] = [
  { id: "pkv-mb", label: "PKV MB", unit: "€", decimals: 2, higherIsBetter: true },
  { id: "lv-bws", label: "LV BWS", unit: "€", decimals: 2, higherIsBetter: true },
  { id: "sach-jahresnetto", label: "Sach Jahresnetto", unit: "€", decimals: 2, higherIsBetter: true },
  { id: "kfz", label: "KFZ", unit: "€", decimals: 2, higherIsBetter: true },
];

function emptyData(): KpiData {
  return { fields: DEFAULT_FIELDS, entries: [] };
}

function isValidData(value: unknown): value is KpiData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return Array.isArray(data.fields) && Array.isArray(data.entries);
}

export function loadData(): KpiData {
  if (typeof window === "undefined") return emptyData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = emptyData();
      saveData(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!isValidData(parsed)) return emptyData();
    return parsed;
  } catch {
    return emptyData();
  }
}

export function saveData(data: KpiData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function upsertEntry(data: KpiData, entry: KpiEntry): KpiData {
  const withoutDate = data.entries.filter((e) => e.date !== entry.date);
  const entries = [...withoutDate, entry].sort((a, b) => a.date.localeCompare(b.date));
  return { ...data, entries };
}

export function deleteEntry(data: KpiData, date: string): KpiData {
  return { ...data, entries: data.entries.filter((e) => e.date !== date) };
}

export function addField(data: KpiData, field: KpiField): KpiData {
  return { ...data, fields: [...data.fields, field] };
}

export function updateField(data: KpiData, fieldId: string, patch: Partial<KpiField>): KpiData {
  return {
    ...data,
    fields: data.fields.map((f) => (f.id === fieldId ? { ...f, ...patch, id: f.id } : f)),
  };
}

export function removeField(data: KpiData, fieldId: string): KpiData {
  return {
    ...data,
    fields: data.fields.filter((f) => f.id !== fieldId),
    entries: data.entries.map((e) => {
      const { [fieldId]: _removed, ...rest } = e.values;
      return { ...e, values: rest };
    }),
  };
}

export function moveField(data: KpiData, fieldId: string, direction: "up" | "down"): KpiData {
  const idx = data.fields.findIndex((f) => f.id === fieldId);
  if (idx === -1) return data;
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= data.fields.length) return data;
  const fields = [...data.fields];
  [fields[idx], fields[swapWith]] = [fields[swapWith], fields[idx]];
  return { ...data, fields };
}

export function slugifyFieldId(label: string, existingIds: string[]): string {
  const base =
    label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "kpi";
  let id = base;
  let n = 2;
  while (existingIds.includes(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  return id;
}

export function todayIso(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}

function triggerDownload(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportJson(data: KpiData): void {
  const stamp = todayIso();
  triggerDownload(`kpi-backup-${stamp}.json`, JSON.stringify(data, null, 2), "application/json");
}

export function parseImportedJson(text: string): KpiData {
  const parsed = JSON.parse(text);
  if (!isValidData(parsed)) {
    throw new Error("Die Datei enthält kein gültiges KPI-Backup.");
  }
  return parsed;
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportCsv(data: KpiData): void {
  const header = ["Datum", ...data.fields.map((f) => f.label)];
  const rows = data.entries.map((entry) => [
    entry.date,
    ...data.fields.map((f) => {
      const v = entry.values[f.id];
      return v === undefined ? "" : String(v);
    }),
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  triggerDownload(`kpi-export-${todayIso()}.csv`, csv, "text/csv");
}
