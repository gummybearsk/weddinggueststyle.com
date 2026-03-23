"use client";

import { useState } from "react";
import { FAQ as FAQType } from "@/lib/types";

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: FAQType;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 sm:py-5 text-left group/faq"
        aria-expanded={isOpen}
      >
        <span
          className={`text-sm sm:text-base font-medium pr-4 transition-colors ${
            isOpen ? "text-rose-700" : "text-gray-800 group-hover/faq:text-rose-600"
          }`}
        >
          {faq.question}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? "bg-rose-100 text-rose-600 rotate-180"
              : "bg-gray-100 text-gray-500 group-hover/faq:bg-rose-50 group-hover/faq:text-rose-500"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-sm sm:text-base text-gray-600 leading-relaxed pr-12">
          {faq.answer}
        </div>
      </div>
    </div>
  );
}

export default function FAQ({ faqs }: { faqs: FAQType[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-10 sm:py-14">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        Frequently Asked Questions
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Quick answers to help you find the perfect wedding guest dress.
      </p>
      <div className="max-w-3xl bg-white rounded-xl border border-gray-100 shadow-sm px-5 sm:px-6">
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
            faq={faq}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}
