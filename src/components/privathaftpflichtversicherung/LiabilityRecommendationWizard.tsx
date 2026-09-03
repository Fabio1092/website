import { useState } from "react";
import { ArrowLeft, RotateCcw, ShieldCheck } from "lucide-react";
import { wizardSteps, liabilityRecommendations, type StepId, type RecommendationId } from "@/lib/privathaftpflicht";
import { siteConfig } from "@/lib/site";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

type Outcome = RecommendationId | "unsure" | null;

interface HistoryEntry {
  stepId: StepId;
}

function pushEvent(event: string) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event });
}

function nextPathTotal(stepId: StepId, next: string): number | null {
  if (stepId === "beamter") return next === "alter" ? 3 : 4;
  if (stepId === "sonderfall") return next === "bayerische" ? 3 : 4;
  return null;
}

const householdLabels: Record<string, string> = {
  "nur-ich": "Nur ich",
  paar: "Ich und mein Partner / meine Partnerin",
  familie: "Familie",
};

export default function LiabilityRecommendationWizard() {
  const [currentStepId, setCurrentStepId] = useState<StepId>("beamter");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [pendingRecommendation, setPendingRecommendation] = useState<RecommendationId | null>(null);
  const [pendingReason, setPendingReason] = useState<string>("");
  const [household, setHousehold] = useState<string | null>(null);
  const [pathTotal, setPathTotal] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const reset = () => {
    setCurrentStepId("beamter");
    setHistory([]);
    setOutcome(null);
    setPendingRecommendation(null);
    setPendingReason("");
    setHousehold(null);
    setPathTotal(null);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentStepId(prev.stepId);
    setOutcome(null);
    setPendingRecommendation(null);
    setPendingReason("");
    setHousehold(null);
  };

  const selectOption = (value: string, next: string, reason?: string) => {
    if (!hasStarted) {
      setHasStarted(true);
      pushEvent("phv_wizard_started");
    }

    const total = nextPathTotal(currentStepId, next);
    if (total !== null) setPathTotal(total);

    if (next === "unsure") {
      setHistory([...history, { stepId: currentStepId }]);
      setOutcome("unsure");
      return;
    }

    if (next === "haushalt") {
      // The household step itself just records the answer and reveals the result.
      setHousehold(value);
      if (pendingRecommendation) {
        setOutcome(pendingRecommendation);
        pushEvent("phv_wizard_completed");
        pushEvent(`phv_recommendation_${pendingRecommendation}`);
      }
      return;
    }

    setHistory([...history, { stepId: currentStepId }]);

    if (next in liabilityRecommendations) {
      setPendingRecommendation(next as RecommendationId);
      setPendingReason(reason ?? "");
      setCurrentStepId("haushalt");
      return;
    }

    setCurrentStepId(next as StepId);
  };

  const resolveUnsureAsSpecialCase = () => {
    setHistory([...history, { stepId: "sonderfall" }]);
    setPendingRecommendation("bayerische");
    setPendingReason(wizardSteps.sonderfall.options.find((o) => o.value === "ja")?.reason ?? "");
    setPathTotal(3);
    setOutcome(null);
    setCurrentStepId("haushalt");
  };

  const stepNumber = history.length + 1;
  const showResult = outcome && outcome !== "unsure";
  const recommendation = showResult ? liabilityRecommendations[outcome as RecommendationId] : null;

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft sm:p-8">
      {!outcome && (
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            {pathTotal ? `Frage ${stepNumber} von ${pathTotal}` : `Frage ${stepNumber}`}
          </p>
          {history.length > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1 text-xs font-medium text-ink-700/60 transition-colors hover:text-ink-950"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Zurück
            </button>
          )}
        </div>
      )}

      {!outcome && (
        <div key={currentStepId} className="animate-[fadeIn_0.3s_ease-out]">
          <h3 className="hyphens-auto break-words font-serif text-xl font-semibold text-ink-950 sm:text-2xl">
            {wizardSteps[currentStepId].question}
          </h3>
          {wizardSteps[currentStepId].hint && (
            <p className="mt-2 text-sm text-ink-700/60">{wizardSteps[currentStepId].hint}</p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            {wizardSteps[currentStepId].options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => selectOption(option.value, option.next, option.reason)}
                className="min-h-[44px] rounded-xl border border-black/10 bg-white px-5 py-3.5 text-left text-sm font-medium text-ink-950 transition-colors duration-150 hover:border-brand-300 hover:bg-brand-50/50"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {outcome === "unsure" && (
        <div className="animate-[fadeIn_0.3s_ease-out] text-center">
          <p className="font-serif text-xl font-semibold text-ink-950 sm:text-2xl">
            Schreib mir bitte kurz, bevor du abschließt.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-700/75">
            Bei besonderen Dienst- oder Amtshaftpflichtkonstellationen schaue ich mir deine
            Tätigkeit lieber persönlich an, statt hier zu raten.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href={siteConfig.emailHref}
              data-cta="phv_beamter_contact_clicked"
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-gold-500 px-6 py-3.5 text-sm font-semibold text-ink-950 shadow-lg shadow-gold-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-gold-400 sm:w-auto"
            >
              Fabio fragen
            </a>
            <button
              type="button"
              onClick={resolveUnsureAsSpecialCase}
              className="text-sm font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              Ich weiß inzwischen, dass es ein Sonderfall ist
            </button>
          </div>
          <button
            type="button"
            onClick={goBack}
            className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-ink-700/60 transition-colors hover:text-ink-950"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Zurück
          </button>
        </div>
      )}

      {showResult && recommendation && (
        <div className="animate-[fadeIn_0.3s_ease-out]">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-brand-600">Meine Empfehlung für dich</p>

          <div className="mx-auto mt-5 flex max-w-md flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-black/5 bg-brand-50/30 p-3">
              <img
                src={recommendation.logo}
                alt={`${recommendation.insurer} Logo`}
                className="h-full w-full object-contain"
                width="64"
                height="64"
                loading="lazy"
              />
            </div>

            <h3 className="mt-4 hyphens-auto break-words font-serif text-2xl font-semibold text-ink-950">
              {recommendation.insurer} – {recommendation.tariff}
            </h3>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-700/50">Warum diese Empfehlung?</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700/85">{pendingReason}</p>

            {household && (
              <p className="mt-4 text-sm text-ink-700/70">
                Deine Auswahl: <span className="font-medium text-ink-950">{householdLabels[household]}</span>
              </p>
            )}

            <div className="mt-7 flex w-full flex-col items-center gap-3">
              {recommendation.checkoutUrl ? (
                <a
                  href={recommendation.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="phv_checkout_clicked"
                  className="inline-flex w-full items-center justify-center rounded-full bg-gold-500 px-6 py-3.5 text-sm font-semibold text-ink-950 shadow-lg shadow-gold-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-gold-400"
                >
                  Jetzt online abschließen
                </a>
              ) : (
                <span
                  aria-disabled="true"
                  className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-6 py-3.5 text-sm font-semibold text-ink-700/50"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Online-Abschluss folgt
                </span>
              )}
              <button type="button" onClick={reset} className="text-sm font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800">
                Auswahl ändern
              </button>
            </div>
          </div>
        </div>
      )}

      {outcome && (
        <div className="mt-8 border-t border-black/5 pt-5 text-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-700/50 transition-colors hover:text-ink-950"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Neu starten
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
