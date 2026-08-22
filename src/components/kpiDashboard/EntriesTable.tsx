import { Pencil, Trash2 } from "lucide-react";
import type { KpiEntry, KpiField } from "@/lib/kpi/types";
import { formatDateLong, formatValue } from "@/lib/kpi/format";

interface Props {
  fields: KpiField[];
  entries: KpiEntry[];
  onEdit: (date: string) => void;
  onDelete: (date: string) => void;
}

export default function EntriesTable({ fields, entries, onEdit, onDelete }: Props) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Noch keine Einträge vorhanden. Trage oben deinen ersten Tag ein.
      </p>
    );
  }

  return (
    <div className="max-h-96 overflow-auto rounded-lg border border-black/5">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Datum</th>
            {fields.map((field) => (
              <th key={field.id} className="px-3 py-2 font-medium whitespace-nowrap">
                {field.label}
              </th>
            ))}
            <th className="px-3 py-2 font-medium text-right">Aktionen</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {sorted.map((entry) => (
            <tr key={entry.date}>
              <td className="px-3 py-2 whitespace-nowrap text-ink-700/85">
                {formatDateLong(entry.date)}
              </td>
              {fields.map((field) => {
                const value = entry.values[field.id];
                return (
                  <td key={field.id} className="px-3 py-2 font-medium text-ink-950" data-tabular>
                    {value === undefined ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      formatValue(value, field)
                    )}
                  </td>
                );
              })}
              <td className="px-3 py-2">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(entry.date)}
                    aria-label={`Eintrag vom ${formatDateLong(entry.date)} bearbeiten`}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-brand-50 hover:text-brand-700"
                  >
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry.date)}
                    aria-label={`Eintrag vom ${formatDateLong(entry.date)} löschen`}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-danger-50 hover:text-danger-500"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
