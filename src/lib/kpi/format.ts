import type { KpiField } from "./types";

const numberFormatCache = new Map<number, Intl.NumberFormat>();

function getFormatter(decimals: number): Intl.NumberFormat {
  let formatter = numberFormatCache.get(decimals);
  if (!formatter) {
    formatter = new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    numberFormatCache.set(decimals, formatter);
  }
  return formatter;
}

export function formatValue(value: number, field: Pick<KpiField, "decimals" | "unit">): string {
  const formatted = getFormatter(field.decimals).format(value);
  return field.unit ? `${formatted} ${field.unit}` : formatted;
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("de-DE", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatDateShort(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short" }).format(date);
}

export function formatDateLong(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export type DeltaDirection = "up" | "down" | "flat";

export interface Delta {
  direction: DeltaDirection;
  isGood: boolean;
  absolute: number;
  percent: number | null;
  label: string;
}

export function computeDelta(current: number, previous: number, field: KpiField): Delta {
  const absolute = current - previous;
  const direction: DeltaDirection = absolute > 0 ? "up" : absolute < 0 ? "down" : "flat";
  const isGood =
    direction === "flat" ? true : direction === "up" ? field.higherIsBetter : !field.higherIsBetter;
  const percent = previous !== 0 ? (absolute / Math.abs(previous)) * 100 : null;
  const sign = absolute > 0 ? "+" : "";
  const label = `${sign}${formatValue(absolute, field)}`;
  return { direction, isGood, absolute, percent, label };
}
