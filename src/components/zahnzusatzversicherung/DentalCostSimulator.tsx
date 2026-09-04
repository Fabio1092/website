import { useMemo, useState } from "react";
import { ChevronDown, Info, Pencil, ExternalLink, Check } from "lucide-react";
import {
  dentalTreatments,
  treatmentOrder,
  bonusLevelLabels,
  bonusLevelOrder,
  dentalTariffs,
  tariffOrder,
  getStaircaseRows,
  calculateDentalScenario,
  formatEuro,
  getDentalCheckoutUrl,
  type TreatmentId,
  type BonusLevel,
  type TariffLevel,
  type DentalScenarioResult,
} from "@/lib/dentalCalculator";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function pushEvent(event: string) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event });
}

interface BarSegment {
  label: string;
  value: number;
  colorClass: string;
}

function CostSplitBar({ segments }: { segments: BarSegment[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const summary = segments.map((s) => `${s.label}: ${formatEuro(s.value)}`).join(", ");

  return (
    <div>
      <div
        role="img"
        aria-label={summary}
        className="flex h-8 w-full overflow-hidden rounded-full border border-black/5 bg-black/5"
      >
        {segments.map((s) => {
          const pct = total > 0 ? (s.value / total) * 100 : 0;
          if (pct <= 0) return null;
          return (
            <div
              key={s.label}
              className={`h-full transition-[width] duration-500 ease-out motion-reduce:transition-none ${s.colorClass}`}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-xs text-ink-700/75">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-sm ${s.colorClass}`} aria-hidden="true" />
            <span>
              {s.label}: <span className="font-medium text-ink-950">{formatEuro(s.value)}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccordionPanel({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium text-ink-950">{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-ink-700/50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <div className="grid overflow-hidden transition-all duration-300 ease-out" style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <div className="border-t border-black/5 px-5 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function DentalCostSimulator() {
  const [treatmentId, setTreatmentId] = useState<TreatmentId | null>(null);
  const [bonusLevel, setBonusLevel] = useState<BonusLevel | null>(null);
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [costOverride, setCostOverride] = useState<number | null>(null);
  const [costInputValue, setCostInputValue] = useState("");
  const [tariff, setTariff] = useState<TariffLevel | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [bonusInfoOpen, setBonusInfoOpen] = useState(false);
  const [calcExplainOpen, setCalcExplainOpen] = useState(false);
  const [staircaseOpen, setStaircaseOpen] = useState(false);

  const treatment = treatmentId ? dentalTreatments[treatmentId] : null;
  const treatmentCost = costOverride ?? treatment?.defaultCost ?? 0;

  const tariffResults = useMemo<Record<TariffLevel, DentalScenarioResult> | null>(() => {
    if (!treatmentId || !bonusLevel) return null;
    const entries = tariffOrder.map((level) => [
      level,
      calculateDentalScenario({
        treatmentId,
        treatmentCost,
        bonusLevel,
        coverageRate: dentalTariffs[level].coverageRate,
      }),
    ]);
    return Object.fromEntries(entries) as Record<TariffLevel, DentalScenarioResult>;
  }, [treatmentId, treatmentCost, bonusLevel]);

  // supplementaryPayment ist 0 bei coverageRate 0, daher liefert jedes Ergebnis dieselbe Basis.
  const baseline = tariffResults ? tariffResults[75] : null;
  const selectedResult = tariff && tariffResults ? tariffResults[tariff] : null;
  const selectedTariffConfig = tariff ? dentalTariffs[tariff] : null;

  function selectTreatment(id: TreatmentId) {
    if (!hasStarted) {
      setHasStarted(true);
      pushEvent("zahnzusatz_rechner_started");
    }
    setTreatmentId(id);
    setBonusLevel(null);
    setTariff(null);
    setCostOverride(null);
    setIsEditingCost(false);
  }

  function selectBonus(level: BonusLevel) {
    setBonusLevel(level);
    setTariff(null);
  }

  function selectTariff(level: TariffLevel) {
    setTariff(level);
    pushEvent(`zahnzusatz_${level}_selected`);
    pushEvent("zahnzusatz_rechner_completed");
  }

  function openCostEditor() {
    setCostInputValue(String(treatmentCost));
    setIsEditingCost(true);
  }

  function handleCostChange(event: React.ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value;
    setCostInputValue(raw);
    const parsed = Number.parseFloat(raw.replace(",", "."));
    if (Number.isFinite(parsed) && parsed > 0) {
      setCostOverride(parsed);
    }
  }

  function handleCostBlur() {
    if (!Number.isFinite(costOverride) || (costOverride ?? 0) <= 0) {
      setCostInputValue(String(treatment?.defaultCost ?? 0));
      setCostOverride(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Schritt 1: Behandlung */}
      <div>
        <h3 className="font-serif text-lg font-semibold text-ink-950 sm:text-xl">Welche Behandlung möchtest du simulieren?</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {treatmentOrder.map((id) => {
            const t = dentalTreatments[id];
            const isSelected = treatmentId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectTreatment(id)}
                aria-pressed={isSelected}
                className={`min-h-[44px] rounded-2xl border p-4 text-left transition-colors duration-150 ${
                  isSelected ? "border-brand-400 bg-brand-50/60 ring-1 ring-brand-300" : "border-black/10 bg-white hover:border-brand-300 hover:bg-brand-50/40"
                }`}
              >
                <p className="font-serif text-base font-semibold text-ink-950">{t.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-700/70">{t.description}</p>
                <p className="mt-3 text-xs font-medium text-brand-700">Beispielrechnung mit {formatEuro(t.defaultCost)}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Schritt 2: Bonusheft */}
      {treatment && (
        <div data-reveal className="is-visible animate-[fadeIn_0.3s_ease-out] motion-reduce:animate-none">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-semibold text-ink-950 sm:text-xl">Wie sieht dein Bonusheft aus?</h3>
            <button
              type="button"
              onClick={() => setBonusInfoOpen((open) => !open)}
              aria-expanded={bonusInfoOpen}
              aria-label="Warum frage ich nach meinem Bonusheft?"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink-700/50 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              <Info className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {bonusInfoOpen && (
            <div className="mt-3 rounded-xl border border-black/5 bg-brand-50/30 p-4 text-sm leading-relaxed text-ink-700/85">
              <p>
                Bei Zahnersatz orientiert sich die gesetzliche Krankenversicherung an einer festgelegten
                Regelversorgung. Ohne Bonus beträgt der Festzuschuss grundsätzlich 60 % der durchschnittlichen
                Kosten dieser Regelversorgung. Nach mindestens fünf lückenlos dokumentierten Jahren erhöht er
                sich auf 70 %, nach zehn Jahren auf 75 %.
              </p>
              <p className="mt-2 font-medium text-ink-950">
                Das bedeutet nicht, dass deine Krankenkasse 60 %, 70 % oder 75 % deiner tatsächlichen Implantat-
                oder Keramikkosten bezahlt.
              </p>
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {bonusLevelOrder.map((level) => {
              const isSelected = bonusLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => selectBonus(level)}
                  aria-pressed={isSelected}
                  className={`min-h-[44px] rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors duration-150 ${
                    isSelected ? "border-brand-400 bg-brand-50/60 text-ink-950 ring-1 ring-brand-300" : "border-black/10 bg-white text-ink-950 hover:border-brand-300 hover:bg-brand-50/40"
                  }`}
                >
                  {bonusLevelLabels[level]}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-700/60">
            Bei klassischem Zahnersatz erhöht ein lückenlos geführtes Bonusheft den Festzuschuss deiner
            gesetzlichen Krankenversicherung.
          </p>
        </div>
      )}

      {/* Behandlungskosten anzeigen/anpassen + Ergebnis ohne ZZV */}
      {treatment && bonusLevel && baseline && (
        <div data-reveal className="is-visible animate-[fadeIn_0.3s_ease-out] motion-reduce:animate-none space-y-6" aria-live="polite">
          <div className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/50">Geschätzte Behandlungskosten</p>

            {!isEditingCost ? (
              <>
                <p className="mt-1.5 font-serif text-3xl font-semibold text-ink-950">{formatEuro(treatmentCost)}</p>
                <p className="mt-1 text-xs text-ink-700/60">
                  Orientierungswert für {treatment.label === "Implantat" ? "ein Einzelimplantat inkl. Krone" : `eine Behandlung des Typs „${treatment.label}“`}. {treatment.costRangeLabel}.
                </p>
                <button
                  type="button"
                  onClick={openCostEditor}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Du hast bereits einen Kostenvoranschlag? Kosten anpassen
                </button>
              </>
            ) : (
              <div className="mt-2">
                <label htmlFor="dental-cost-input" className="text-sm font-medium text-ink-950">
                  Behandlungskosten laut deinem Kostenvoranschlag
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    id="dental-cost-input"
                    type="number"
                    inputMode="decimal"
                    min="1"
                    step="1"
                    value={costInputValue}
                    onChange={handleCostChange}
                    onBlur={handleCostBlur}
                    className="w-40 rounded-lg border border-black/15 px-3 py-2.5 text-base text-ink-950 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                  <span className="text-base text-ink-700/70">€</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-700/60">
                  Der gesetzliche Zuschuss verändert sich dabei bewusst nicht automatisch: Er richtet sich nach
                  dem zugrunde liegenden Befund und deinem Bonusstatus, nicht proportional nach dem Preis der
                  gewählten Behandlung.
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="font-serif text-lg font-semibold text-ink-950">Ohne Zahnzusatzversicherung</p>
            <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-ink-700/60">Behandlungskosten</dt>
                <dd className="font-medium text-ink-950">{formatEuro(baseline.treatmentCost)}</dd>
              </div>
              <div>
                <dt className="text-ink-700/60">Gesetzliche Krankenversicherung</dt>
                <dd className="font-medium text-ink-950">{formatEuro(baseline.gkvContribution)}</dd>
              </div>
              <div>
                <dt className="text-ink-700/60">Dein möglicher Eigenanteil</dt>
                <dd className="font-serif text-xl font-semibold text-ink-950">{formatEuro(baseline.ownWithoutSupplementary)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm leading-relaxed text-ink-700/70">
              Diesen Betrag müsstest du in unserer Beispielrechnung ohne zusätzliche Absicherung selbst tragen.
            </p>

            <div className="mt-5">
              <CostSplitBar
                segments={[
                  { label: "Gesetzliche Krankenkasse", value: baseline.gkvContribution, colorClass: "bg-brand-500" },
                  { label: "Dein Eigenanteil", value: baseline.ownWithoutSupplementary, colorClass: "bg-ink-800" },
                ]}
              />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-ink-700/55">
              Die gesetzliche Krankenkasse bezuschusst bei Zahnersatz grundsätzlich den zugrunde liegenden
              Befund und die Regelversorgung. Deshalb steigt der Kassenzuschuss nicht automatisch, nur weil du
              dich beispielsweise statt einer Brücke für ein teureres Implantat entscheidest.
              {treatmentId === "inlay" && (
                <>
                  {" "}Bei einem Inlay beteiligt sich die gesetzliche Krankenkasse grundsätzlich nur in Höhe der
                  entsprechenden Kassenfüllung. Das Bonusheft verändert diesen Betrag in unserer Modellrechnung
                  deshalb nicht.
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Schritt 3: Tarifstufe wählen (Cards zeigen nach Auswahl zusätzlich die Zahlen). */}
      {treatment && bonusLevel && tariffResults && (
        <div data-reveal className="is-visible animate-[fadeIn_0.3s_ease-out] motion-reduce:animate-none">
          <h3 className="font-serif text-lg font-semibold text-ink-950 sm:text-xl">Wie stark möchtest du deinen Eigenanteil reduzieren?</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-700/75">
            Bei meiner Empfehlung kannst du zwischen drei Leistungsstufen für hochwertigen Zahnersatz wählen.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {tariffOrder.map((level) => {
              const config = dentalTariffs[level];
              const result = tariffResults[level];
              const isSelected = tariff === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => selectTariff(level)}
                  aria-pressed={isSelected}
                  className={`min-h-[44px] rounded-2xl border p-5 text-left transition-colors duration-150 ${
                    isSelected ? "border-brand-400 bg-brand-50/50 ring-1 ring-brand-300" : "border-black/10 bg-white hover:border-brand-300 hover:bg-brand-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-serif text-2xl font-semibold text-ink-950">{level} %</span>
                    {isSelected && (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-ink-950">{config.name}</p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-700/70">{config.pitch}</p>

                  {tariff && (
                    <dl className="mt-4 space-y-1.5 border-t border-black/5 pt-3 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-ink-700/60">Behandlungskosten</dt>
                        <dd className="font-medium text-ink-950">{formatEuro(result.treatmentCost)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-ink-700/60">Modellhafte Allianz-Leistung</dt>
                        <dd className="font-medium text-ink-950">{formatEuro(result.supplementaryPayment)}</dd>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <dt className="text-ink-700/60">Rechnerischer Eigenanteil</dt>
                        <dd className="font-semibold text-ink-950">{formatEuro(result.ownWithSupplementary)}</dd>
                      </div>
                    </dl>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Ergebnis mit Zahnzusatz */}
      {selectedResult && selectedTariffConfig && baseline && (
        <div data-reveal className="is-visible animate-[fadeIn_0.3s_ease-out] motion-reduce:animate-none" aria-live="polite">
          <p className="font-serif text-lg font-semibold text-ink-950">Mit {selectedTariffConfig.name}</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-ink-700/60">Gesamtkosten</dt>
              <dd className="font-medium text-ink-950">{formatEuro(selectedResult.treatmentCost)}</dd>
            </div>
            <div>
              <dt className="text-ink-700/60">GKV</dt>
              <dd className="font-medium text-ink-950">{formatEuro(selectedResult.gkvContribution)}</dd>
            </div>
            <div>
              <dt className="text-ink-700/60">Modellhafte Allianz-Leistung</dt>
              <dd className="font-medium text-ink-950">{formatEuro(selectedResult.supplementaryPayment)}</dd>
            </div>
            <div>
              <dt className="text-ink-700/60">Dein rechnerischer Eigenanteil</dt>
              <dd className="font-serif text-xl font-semibold text-ink-950">{formatEuro(selectedResult.ownWithSupplementary)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-sm leading-relaxed text-ink-700/70">
            Statt {formatEuro(baseline.ownWithoutSupplementary)} ohne Zahnzusatzversicherung. Dein Eigenanteil würde
            sich in dieser Modellrechnung um {formatEuro(selectedResult.supplementaryPayment)} reduzieren.
          </p>

          <div className="mt-5">
            <CostSplitBar
              segments={[
                { label: "GKV", value: selectedResult.gkvContribution, colorClass: "bg-brand-500" },
                { label: "Allianz MeinZahnschutz", value: selectedResult.supplementaryPayment, colorClass: "bg-gold-500" },
                { label: "Dein Eigenanteil", value: selectedResult.ownWithSupplementary, colorClass: "bg-ink-800" },
              ]}
            />
          </div>

          <p className="mt-6 text-sm text-ink-700/70">
            Diese Beispielrechnung berücksichtigt das volle tarifliche Leistungsniveau, noch ohne die
            Erstattungshöchstbeträge der ersten Kalenderjahre (Zahnstaffel, siehe unten).
          </p>
        </div>
      )}

      {/* "Wie wird gerechnet?" */}
      {selectedResult && selectedTariffConfig && baseline && (
        <AccordionPanel title="Wie kommt das Ergebnis zustande?" isOpen={calcExplainOpen} onToggle={() => setCalcExplainOpen((o) => !o)}>
          <p className="text-sm leading-relaxed text-ink-700/80">
            Bei einem {selectedTariffConfig.name}-Tarif rechnen wir bei hochwertigem Zahnersatz vereinfacht mit
            einer Gesamtleistung von {selectedTariffConfig.level} % der berücksichtigten Kosten einschließlich
            der Zahlung deiner gesetzlichen Krankenversicherung. Kostet eine Behandlung beispielsweise{" "}
            {formatEuro(selectedResult.treatmentCost)}, entsprechen {selectedTariffConfig.level} % insgesamt{" "}
            {formatEuro(selectedResult.targetTotalReimbursement)}. Übernimmt die GKV in unserem Beispiel{" "}
            {formatEuro(selectedResult.gkvContribution)}, entfallen rechnerisch weitere{" "}
            {formatEuro(selectedResult.supplementaryPayment)} auf die Zahnzusatzversicherung. Es verbleiben{" "}
            {formatEuro(selectedResult.ownWithSupplementary)} Eigenanteil.
          </p>
        </AccordionPanel>
      )}

      {/* Produktempfehlung */}
      {selectedResult && selectedTariffConfig && (
        <div data-reveal className="is-visible animate-[fadeIn_0.3s_ease-out] motion-reduce:animate-none rounded-2xl border border-black/5 bg-brand-50/30 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Meine Empfehlung</p>

          <div className="mt-4 flex items-start gap-4">
            <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl border border-black/5 bg-white p-2">
              <img src="/images/partners/allianz.png" alt="Allianz Logo" className="h-full w-full object-contain" width="64" height="40" loading="lazy" />
            </div>
            <div className="min-w-0">
              <h3 className="hyphens-auto break-words font-serif text-2xl font-semibold text-ink-950">{selectedTariffConfig.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700/85">
                Du hast dich für ein Leistungsniveau von {selectedTariffConfig.level} % entschieden. Dafür passt
                innerhalb meiner Empfehlung der {selectedTariffConfig.name}.
              </p>
              <p className="mt-2 text-xs leading-relaxed text-ink-700/60">
                Die Prozentangabe berücksichtigt bei hochwertigem Zahnersatz die Vorleistung der gesetzlichen
                Krankenversicherung.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-gold-200 bg-gold-50 p-4">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-950">
              <Info className="h-4 w-4 shrink-0 text-gold-700" aria-hidden="true" />
              Wichtig
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-700/85">
              Der Rechner zeigt dir, wie der gewählte Versicherungsschutz bei einem zukünftigen versicherten
              Behandlungsfall modellhaft wirken kann. Eine Zahnzusatzversicherung kann keine Behandlung
              nachträglich versichern, die vor Vertragsabschluss bereits angeraten, begonnen oder beabsichtigt
              war.
            </p>
          </div>

          <a
            href={getDentalCheckoutUrl(selectedTariffConfig.level)}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="zahnzusatz_allianz_checkout_clicked"
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-semibold text-ink-950 shadow-lg shadow-gold-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-gold-400 sm:w-auto"
          >
            {selectedTariffConfig.name} online berechnen &amp; beantragen
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>

          <div className="mt-6">
            <AccordionPanel
              title="Neu abgeschlossen? Dann ist die Zahnstaffel wichtig."
              isOpen={staircaseOpen}
              onToggle={() => setStaircaseOpen((o) => !o)}
            >
              <div className="space-y-5">
                {tariffOrder.map((level) => {
                  const config = dentalTariffs[level];
                  return (
                    <div key={level}>
                      <p className="font-medium text-ink-950">{config.name}</p>
                      <dl className="mt-2 space-y-1.5 text-sm">
                        {getStaircaseRows(config).map((row) => (
                          <div key={row.label} className="flex items-center justify-between gap-3">
                            <dt className="text-ink-700/70">{row.label}</dt>
                            <dd className="font-medium text-ink-950">{row.amount !== null ? `max. ${formatEuro(row.amount)}` : row.note}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  );
                })}
                <p className="text-xs leading-relaxed text-ink-700/60">
                  Die konkrete Erstattung richtet sich immer nach den gültigen Versicherungsbedingungen.
                </p>
              </div>
            </AccordionPanel>
          </div>
        </div>
      )}

      {/* Allgemeiner Transparenzhinweis */}
      <div className="rounded-2xl border border-black/5 bg-white p-5 text-sm leading-relaxed text-ink-700/70 sm:p-6">
        <p className="font-medium text-ink-950">Bitte beachte</p>
        <p className="mt-2">
          Diese Berechnung ist eine vereinfachte Modellrechnung und keine verbindliche Leistungszusage. Die
          tatsächlichen Kosten einer Zahnbehandlung können je nach Zahnarzt, Befund, Material, Labor und
          Behandlungsaufwand abweichen. Auch die konkrete Leistung der gesetzlichen Krankenkasse richtet sich
          nach deinem individuellen Befund und deinem Heil- und Kostenplan.
        </p>
        <p className="mt-2">
          Die tatsächliche Leistung der Zahnzusatzversicherung richtet sich nach den Versicherungsbedingungen,
          den erstattungsfähigen Kosten, der Gebührenordnung sowie eventuell geltenden Leistungsbegrenzungen.
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[fadeIn_0\\.3s_ease-out\\] {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
