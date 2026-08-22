import { useId, useState } from "react";
import { Table2, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { KpiField } from "@/lib/kpi/types";
import { formatCompact, formatDateLong, formatDateShort, formatValue } from "@/lib/kpi/format";

interface Point {
  date: string;
  value: number;
}

interface Props {
  field: KpiField;
  points: Point[];
}

function ChartTooltip({
  active,
  payload,
  field,
}: {
  active?: boolean;
  payload?: { payload: Point }[];
  field: KpiField;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="shadow-soft rounded-lg border border-black/5 bg-white px-3 py-2 text-sm">
      <p className="font-semibold text-ink-950" data-tabular>
        {formatValue(point.value, field)}
      </p>
      <p className="text-xs text-muted-foreground">{formatDateLong(point.date)}</p>
    </div>
  );
}

export default function TrendChart({ field, points }: Props) {
  const [showTable, setShowTable] = useState(false);
  const gradientId = useId();

  return (
    <div className="shadow-soft rounded-2xl border border-black/5 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-lg font-semibold text-ink-950">{field.label}</h3>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-brand-50 hover:text-brand-700"
        >
          {showTable ? (
            <>
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" /> Diagramm
            </>
          ) : (
            <>
              <Table2 className="h-3.5 w-3.5" aria-hidden="true" /> Tabelle
            </>
          )}
        </button>
      </div>

      {points.length === 0 ? (
        <p className="mt-8 mb-4 text-center text-sm text-muted-foreground">
          Noch keine Daten in diesem Zeitraum.
        </p>
      ) : showTable ? (
        <div className="mt-4 max-h-60 overflow-y-auto rounded-lg border border-black/5">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Datum</th>
                <th className="px-3 py-2 font-medium">Wert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {[...points]
                .reverse()
                .map((point) => (
                  <tr key={point.date}>
                    <td className="px-3 py-2 text-ink-700/85">{formatDateLong(point.date)}</td>
                    <td className="px-3 py-2 font-medium text-ink-950" data-tabular>
                      {formatValue(point.value, field)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-2 h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDateShort}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                minTickGap={24}
              />
              <YAxis
                tickFormatter={formatCompact}
                tickLine={false}
                axisLine={false}
                width={40}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              />
              <Tooltip
                content={<ChartTooltip field={field} />}
                cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-brand-500)"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "#ffffff" }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
