import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { KpiField } from "@/lib/kpi/types";
import { computeDelta, formatValue } from "@/lib/kpi/format";
import Sparkline from "./Sparkline";

interface Props {
  field: KpiField;
  history: number[];
}

const DIRECTION_ICON = { up: ArrowUp, down: ArrowDown, flat: Minus };

export default function StatTile({ field, history }: Props) {
  if (history.length === 0) {
    return (
      <div className="shadow-soft rounded-2xl border border-black/5 bg-white p-5">
        <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
        <p className="mt-1 text-3xl font-semibold text-ink-950/30">—</p>
        <p className="mt-2 text-sm text-muted-foreground">Noch keine Daten</p>
      </div>
    );
  }

  const current = history[history.length - 1];
  const previous = history.length > 1 ? history[history.length - 2] : undefined;
  const delta = previous !== undefined ? computeDelta(current, previous, field) : null;
  const DeltaIcon = delta ? DIRECTION_ICON[delta.direction] : Minus;
  const sparklineData = history.slice(-14).map((value) => ({ value }));

  return (
    <div className="shadow-soft rounded-2xl border border-black/5 bg-white p-5">
      <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
      <p className="mt-1 text-3xl font-semibold text-ink-950" data-tabular>
        {formatValue(current, field)}
      </p>
      <div className="mt-2 flex items-center gap-1.5 text-sm">
        {delta ? (
          <span
            className={`inline-flex items-center gap-1 font-medium ${
              delta.direction === "flat"
                ? "text-muted-foreground"
                : delta.isGood
                  ? "text-success-500"
                  : "text-danger-500"
            }`}
          >
            <DeltaIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {delta.label}
          </span>
        ) : (
          <span className="text-muted-foreground">Erster Eintrag</span>
        )}
        <span className="text-muted-foreground">vs. Vortag</span>
      </div>
      <div className="mt-3">
        <Sparkline data={sparklineData} />
      </div>
    </div>
  );
}
