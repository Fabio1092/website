import { useMemo, useRef, useState } from "react";
import type { KpiData, KpiEntry, KpiField } from "@/lib/kpi/types";
import {
  addField,
  deleteEntry,
  exportCsv,
  exportJson,
  loadData,
  moveField,
  parseImportedJson,
  removeField,
  saveData,
  slugifyFieldId,
  todayIso,
  updateField,
  upsertEntry,
} from "@/lib/kpi/storage";
import EntryForm from "./EntryForm";
import StatTile from "./StatTile";
import RangeFilter, { type RangeValue } from "./RangeFilter";
import TrendChart from "./TrendChart";
import EntriesTable from "./EntriesTable";
import FieldManager from "./FieldManager";
import BackupBar from "./BackupBar";

function filterByRange(entries: KpiEntry[], range: RangeValue): KpiEntry[] {
  if (range === "all") return entries;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - range);
  const cutoffIso = cutoff.toISOString().slice(0, 10);
  return entries.filter((e) => e.date >= cutoffIso);
}

export default function KpiDashboard() {
  const [data, setData] = useState<KpiData>(() => loadData());
  const [entryDate, setEntryDate] = useState(() => todayIso());
  const [range, setRange] = useState<RangeValue>(30);
  const formRef = useRef<HTMLDivElement>(null);

  function update(mutator: (current: KpiData) => KpiData) {
    setData((current) => {
      const next = mutator(current);
      saveData(next);
      return next;
    });
  }

  const sortedEntries = useMemo(
    () => [...data.entries].sort((a, b) => a.date.localeCompare(b.date)),
    [data.entries],
  );

  const fieldHistories = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const field of data.fields) {
      map.set(
        field.id,
        sortedEntries
          .filter((e) => e.values[field.id] !== undefined)
          .map((e) => e.values[field.id]),
      );
    }
    return map;
  }, [data.fields, sortedEntries]);

  const rangedEntries = useMemo(() => filterByRange(sortedEntries, range), [sortedEntries, range]);

  const fieldPoints = useMemo(() => {
    const map = new Map<string, { date: string; value: number }[]>();
    for (const field of data.fields) {
      map.set(
        field.id,
        rangedEntries
          .filter((e) => e.values[field.id] !== undefined)
          .map((e) => ({ date: e.date, value: e.values[field.id] })),
      );
    }
    return map;
  }, [data.fields, rangedEntries]);

  function handleSave(entry: KpiEntry) {
    update((current) => upsertEntry(current, entry));
  }

  function handleDeleteEntry(date: string) {
    if (window.confirm(`Eintrag vom ${date} wirklich löschen?`)) {
      update((current) => deleteEntry(current, date));
    }
  }

  function handleEditEntry(date: string) {
    setEntryDate(date);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleAddField(field: Omit<KpiField, "id">) {
    update((current) => {
      const id = slugifyFieldId(field.label, current.fields.map((f) => f.id));
      return addField(current, { ...field, id });
    });
  }

  function handleImportJson(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = parseImportedJson(String(reader.result));
        if (
          window.confirm(
            "Backup importieren? Das ersetzt alle aktuell in diesem Browser gespeicherten KPI-Daten.",
          )
        ) {
          setData(imported);
          saveData(imported);
        }
      } catch (err) {
        window.alert(err instanceof Error ? err.message : "Import fehlgeschlagen.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-ink-950">KPI-Dashboard</h1>
        <p className="mt-2 text-ink-700/70">
          Trage täglich deine Zahlen ein und behalte die Verläufe im Blick.
        </p>
      </div>

      <div ref={formRef}>
        <EntryForm
          fields={data.fields}
          entries={data.entries}
          date={entryDate}
          onDateChange={setEntryDate}
          onSave={handleSave}
        />
      </div>

      {data.fields.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl font-semibold text-ink-950">Übersicht</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.fields.map((field) => (
              <StatTile key={field.id} field={field} history={fieldHistories.get(field.id) ?? []} />
            ))}
          </div>
        </section>
      )}

      {data.fields.length > 0 && (
        <section>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold text-ink-950">Verlauf</h2>
            <RangeFilter value={range} onChange={setRange} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {data.fields.map((field) => (
              <TrendChart key={field.id} field={field} points={fieldPoints.get(field.id) ?? []} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-serif text-2xl font-semibold text-ink-950">Alle Einträge</h2>
        <div className="mt-4">
          <EntriesTable
            fields={data.fields}
            entries={data.entries}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
          />
        </div>
      </section>

      <details className="shadow-soft rounded-2xl border border-black/5 bg-white p-6">
        <summary className="cursor-pointer font-serif text-xl font-semibold text-ink-950">
          Einstellungen &amp; Backup
        </summary>
        <div className="mt-6 space-y-8">
          <FieldManager
            fields={data.fields}
            onAdd={handleAddField}
            onUpdate={(id, patch) => update((current) => updateField(current, id, patch))}
            onRemove={(id) => update((current) => removeField(current, id))}
            onMove={(id, direction) => update((current) => moveField(current, id, direction))}
          />
          <BackupBar
            onExportJson={() => exportJson(data)}
            onExportCsv={() => exportCsv(data)}
            onImportJson={handleImportJson}
          />
        </div>
      </details>
    </div>
  );
}
