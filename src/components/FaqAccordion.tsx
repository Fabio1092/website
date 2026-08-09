import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="shadow-soft divide-y divide-black/5 overflow-hidden rounded-2xl border border-black/5 bg-white">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question} className={isOpen ? "bg-brand-50/30" : undefined}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-brand-50/40"
            >
              <span className="font-medium text-ink-950">{faq.question}</span>
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${isOpen ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600"}`}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </span>
            </button>
            <div
              className="grid overflow-hidden transition-all duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-ink-700/80">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
