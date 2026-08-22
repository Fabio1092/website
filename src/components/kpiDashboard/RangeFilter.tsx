export type RangeValue = 7 | 30 | 90 | "all";

const OPTIONS: { value: RangeValue; label: string }[] = [
  { value: 7, label: "7 Tage" },
  { value: 30, label: "30 Tage" },
  { value: 90, label: "90 Tage" },
  { value: "all", label: "Alle" },
];

interface Props {
  value: RangeValue;
  onChange: (value: RangeValue) => void;
}

export default function RangeFilter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Zeitraum">
      {OPTIONS.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "bg-ink-950 text-white"
                : "bg-muted text-muted-foreground hover:bg-brand-50 hover:text-brand-700"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
