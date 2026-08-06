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
    <div className="divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-medium text-ink-950">{faq.question}</span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-brand-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
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
