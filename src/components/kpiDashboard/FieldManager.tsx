import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { KpiField } from "@/lib/kpi/types";

interface Props {
  fields: KpiField[];
  onAdd: (field: Omit<KpiField, "id">) => void;
  onUpdate: (id: string, patch: Partial<KpiField>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}

export default function FieldManager({ fields, onAdd, onUpdate, onRemove, onMove }: Props) {
  const [label, setLabel] = useState("");
  const [unit, setUnit] = useState("");
  const [higherIsBetter, setHigherIsBetter] = useState(true);

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd({ label: label.trim(), unit: unit.trim(), decimals: 0, higherIsBetter });
    setLabel("");
    setUnit("");
    setHigherIsBetter(true);
  }

  function handleRemove(field: KpiField) {
    if (window.confirm(`"${field.label}" wirklich löschen? Bereits erfasste Werte dafür gehen verloren.`)) {
      onRemove(field.id);
    }
  }

  return (
    <div>
      <h3 className="font-serif text-lg font-semibold text-ink-950">KPIs verwalten</h3>
      <div className="mt-4 divide-y divide-black/5 rounded-lg border border-black/5">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => onMove(field.id, "up")}
                disabled={index === 0}
                aria-label={`${field.label} nach oben verschieben`}
                className="text-muted-foreground hover:text-brand-700 disabled:opacity-30"
              >
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onMove(field.id, "down")}
                disabled={index === fields.length - 1}
                aria-label={`${field.label} nach unten verschieben`}
                className="text-muted-foreground hover:text-brand-700 disabled:opacity-30"
              >
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <input
              type="text"
              value={field.label}
              onChange={(e) => onUpdate(field.id, { label: e.target.value })}
              className="min-w-0 flex-1 rounded-lg border border-black/10 px-2.5 py-1.5 text-sm text-ink-950 focus:border-brand-500 focus:outline-none"
            />
            <input
              type="text"
              value={field.unit}
              onChange={(e) => onUpdate(field.id, { unit: e.target.value })}
              placeholder="Einheit"
              className="w-24 rounded-lg border border-black/10 px-2.5 py-1.5 text-sm text-ink-950 focus:border-brand-500 focus:outline-none"
            />
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={field.higherIsBetter}
                onChange={(e) => onUpdate(field.id, { higherIsBetter: e.target.checked })}
                className="accent-brand-500"
              />
              mehr ist besser
            </label>
            <button
              type="button"
              onClick={() => handleRemove(field)}
              aria-label={`${field.label} entfernen`}
              className="ml-auto rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-danger-50 hover:text-danger-500"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="px-4 py-3 text-sm text-muted-foreground">Noch keine KPIs angelegt.</p>
        )}
      </div>

      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium text-ink-950">Neue Kennzahl</span>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="z.B. Conversion Rate"
            className="w-56 rounded-lg border border-black/10 px-3 py-2 text-sm text-ink-950 focus:border-brand-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium text-ink-950">Einheit</span>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="€, %, ..."
            className="w-24 rounded-lg border border-black/10 px-3 py-2 text-sm text-ink-950 focus:border-brand-500 focus:outline-none"
          />
        </label>
        <label className="mb-2.5 flex items-center gap-1.5 text-sm text-ink-700/80">
          <input
            type="checkbox"
            checked={higherIsBetter}
            onChange={(e) => setHigherIsBetter(e.target.checked)}
            className="accent-brand-500"
          />
          mehr ist besser
        </label>
        <button
          type="submit"
          className="mb-0.5 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 transition-colors duration-200 hover:bg-brand-100"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> Hinzufügen
        </button>
      </form>
    </div>
  );
}
