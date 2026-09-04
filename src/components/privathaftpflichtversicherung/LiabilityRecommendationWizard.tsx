import { useState } from "react";
import { ArrowLeft, RotateCcw, MessageCircle } from "lucide-react";
import {
  wizardSteps,
  liabilityRecommendations,
  buildAnswerSummary,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  beamterUnsureWhatsAppUrl,
  type StepId,
  type RecommendationId,
  type WizardAnswers,
  type Household,
} from "@/lib/privathaftpflicht";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

type Outcome = RecommendationId | "unsure" | null;

interface HistoryEntry {
  stepId: StepId;
  answers: WizardAnswers;
}

function pushEvent(event: string) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event });
}

function nextPathTotal(stepId: StepId, next: string): number | null {
  if (stepId === "sonderfall" && next === "prioritaet") return 4;
  return null;
}

const INITIAL_PATH_TOTAL = 3;

export default function LiabilityRecommendationWizard() {
  const [currentStepId, setCurrentStepId] = useState<StepId>("haushalt");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [answers, setAnswers] = useState<WizardAnswers>({});
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [pendingReason, setPendingReason] = useState<string>("");
  const [pathTotal, setPathTotal] = useState<number>(INITIAL_PATH_TOTAL);
  const [hasStarted, setHasStarted] = useState(false);

  const reset = () => {
    setCurrentStepId("haushalt");
    setHistory([]);
    setAnswers({});
    setOutcome(null);
    setPendingReason("");
    setPathTotal(INITIAL_PATH_TOTAL);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentStepId(prev.stepId);
    setAnswers(prev.answers);
    setOutcome(null);
    setPendingReason("");
  };

  const selectOption = (value: string, next: string, reason?: string) => {
    if (!hasStarted) {
      setHasStarted(true);
      pushEvent("phv_wizard_started");
    }

    const total = nextPathTotal(currentStepId, next);
    if (total !== null) setPathTotal(total);

    const historyBefore = [...history, { stepId: currentStepId, answers }];

    const updatedAnswers: WizardAnswers = { ...answers };
    if (currentStepId === "haushalt") updatedAnswers.household = value as Household;
    else if (currentStepId === "beamter") updatedAnswers.civilServant = value as "ja" | "nein";
    else if (currentStepId === "alter") updatedAnswers.ageGroup = value === "ja" ? "ab60" : "unter60";
    else if (currentStepId === "sonderfall" && value !== "unsicher") updatedAnswers.officialLiability = value as "ja" | "nein";
    else if (currentStepId === "prioritaet") updatedAnswers.priority = value as "service" | "preis";

    setAnswers(updatedAnswers);

    if (next === "unsure") {
      setHistory(historyBefore);
      setOutcome("unsure");
      pushEvent("phv_beamter_unsure");
      return;
    }

    if (next in liabilityRecommendations) {
      setHistory(historyBefore);
      setPendingReason(reason ?? "");
      setOutcome(next as RecommendationId);
      pushEvent("phv_wizard_completed");
      pushEvent(`phv_recommendation_${next}`);
      return;
    }

    setHistory(historyBefore);
    setCurrentStepId(next as StepId);
  };

  const stepNumber = history.length + 1;
  const showResult = outcome && outcome !== "unsure";
  const recommendation = showResult ? liabilityRecommendations[outcome as RecommendationId] : null;
  const summary = showResult ? buildAnswerSummary(answers) : [];
  const whatsappUrl = recommendation ? buildWhatsAppUrl(buildWhatsAppMessage(recommendation, answers)) : "";

  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-soft sm:p-8">
      {!outcome && (
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
            Frage {stepNumber} von {pathTotal}
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
            Du bist dir bei deiner Tätigkeit nicht sicher?
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-700/75">
            Kein Problem. Schreib mir einfach kurz deine genaue Berufsbezeichnung und Tätigkeit.
            Dann sage ich dir, wie ich es lösen würde.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href={beamterUnsureWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="phv_whatsapp_clicked"
              className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-semibold text-ink-950 shadow-lg shadow-gold-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-gold-400 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Fabio per WhatsApp fragen
            </a>
            <p className="max-w-xs text-xs leading-relaxed text-ink-700/50">
              Es wird noch nichts automatisch versendet. Die Nachricht öffnet sich zunächst nur in
              WhatsApp.
            </p>
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
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-black/5 bg-brand-50 p-3">
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

            {summary.length > 0 && (
              <div className="mt-5 w-full rounded-xl border border-black/5 bg-brand-50/25 p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/50">Deine Angaben</p>
                <ul className="mt-2.5 space-y-1">
                  {summary.map((line) => (
                    <li key={line.label} className="text-sm text-ink-700/80">
                      {line.label}: <span className="font-medium text-ink-950">{line.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-7 flex w-full flex-col items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="phv_whatsapp_clicked"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3.5 text-sm font-semibold text-ink-950 shadow-lg shadow-gold-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-gold-400"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Tarif über WhatsApp anfragen
              </a>
              <p className="text-xs leading-relaxed text-ink-700/50">
                Es wird noch nichts automatisch versendet. Die Nachricht öffnet sich zunächst nur
                in WhatsApp.
              </p>
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
