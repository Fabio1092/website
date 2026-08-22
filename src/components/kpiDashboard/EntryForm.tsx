import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { KpiEntry, KpiField } from "@/lib/kpi/types";

interface Props {
  fields: KpiField[];
  entries: KpiEntry[];
  date: string;
  onDateChange: (date: string) => void;
  onSave: (entry: KpiEntry) => void;
}

export default function EntryForm({ fields, entries, date, onDateChange, onSave }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const existing = entries.find((e) => e.date === date);
    const next: Record<string, string> = {};
    for (const field of fields) {
      const value = existing?.values[field.id];
      next[field.id] = value === undefined ? "" : String(value);
    }
    setValues(next);
  }, [date, entries, fields]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsedValues: Record<string, number> = {};
    for (const field of fields) {
      const raw = values[field.id];
      const parsed = raw === "" || raw === undefined ? NaN : Number(raw.replace(",", "."));
      if (!Number.isNaN(parsed)) {
        parsedValues[field.id] = parsed;
      }
    }
    onSave({ date, values: parsedValues });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="shadow-soft rounded-2xl border border-black/5 bg-white p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink-950">Werte erfassen</h2>
          <p className="mt-1 text-sm text-ink-700/70">
            Wähle einen Tag und trage deine Zahlen ein.
          </p>
        </div>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium text-ink-950">Datum</span>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink-950 focus:border-brand-500 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <label key={field.id} className="flex flex-col text-sm">
            <span className="mb-1 font-medium text-ink-950">
              {field.label}
              {field.unit ? <span className="text-muted-foreground"> ({field.unit})</span> : null}
            </span>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              value={values[field.id] ?? ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
              placeholder="0"
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink-950 focus:border-brand-500 focus:outline-none"
            />
          </label>
        ))}
      </div>

      {fields.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Noch keine KPIs angelegt. Füge unten in den Einstellungen deine ersten Kennzahlen hinzu.
        </p>
      ) : (
        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            className="shadow-soft inline-flex items-center gap-2 rounded-full bg-ink-950 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-700"
          >
            Speichern
          </button>
          {savedFlash && (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-success-500">
              <Check className="h-4 w-4" aria-hidden="true" /> Gespeichert
            </span>
          )}
        </div>
      )}
    </form>
  );
}
