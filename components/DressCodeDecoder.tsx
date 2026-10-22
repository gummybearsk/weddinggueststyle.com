"use client";

import { useState } from "react";
import Link from "next/link";
import type { DressCodeRung } from "@/lib/dressCodes";

/**
 * "What does my invitation mean?" — pick the code printed on the invitation and see what
 * women and men wear. All rungs are server-rendered into the HTML (hidden ones use the
 * `hidden` attribute), so crawlers and no-JS readers get every answer; JS only switches
 * which one is shown.
 */
export default function DressCodeDecoder({
  rungs,
  sourceLabel,
}: {
  rungs: (DressCodeRung & { links: { slug: string; label: string }[] })[];
  sourceLabel: string;
}) {
  const [active, setActive] = useState(rungs[3]?.key ?? rungs[0].key);
  return (
    <div className="border border-ink-200 bg-white">
      <div className="p-5 sm:p-7 border-b border-ink-200">
        <p className="eyebrow">Dress-code decoder</p>
        <p className="display-serif text-xl sm:text-2xl text-ink-900 mt-1">What does your invitation say?</p>
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Dress codes">
          {rungs.map((r) => (
            <button
              key={r.key}
              type="button"
              role="tab"
              aria-selected={active === r.key}
              aria-controls={`code-${r.key}`}
              onClick={() => setActive(r.key)}
              className={`px-3 py-1.5 text-sm border transition-colors ${
                active === r.key
                  ? "bg-ink-900 text-ivory border-ink-900"
                  : "bg-ivory text-ink-800 border-ink-200 hover:border-blush-400"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      {rungs.map((r) => (
        <div key={r.key} id={`code-${r.key}`} role="tabpanel" hidden={active !== r.key} className="p-5 sm:p-7">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2">Women wear</p>
              <ul className="space-y-1.5 text-ink-800 font-light">
                {r.women.map((w) => (
                  <li key={w}>· {w}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500 mb-2">Men wear</p>
              <ul className="space-y-1.5 text-ink-800 font-light">
                {r.men.map((m) => (
                  <li key={m}>· {m}</li>
                ))}
              </ul>
            </div>
          </div>
          {r.note && <p className="mt-5 text-sm text-ink-600 italic font-light">{r.note}</p>}
          {r.links.length > 0 && (
            <p className="mt-5 text-sm">
              {r.links.map((l, i) => (
                <span key={l.slug}>
                  {i > 0 && " · "}
                  <Link href={`/${l.slug}`} className="text-blush-600 hover:underline">
                    Full {l.label.toLowerCase()} guide →
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>
      ))}
      <p className="px-5 pb-5 sm:px-7 text-xs text-ink-500 font-light">{sourceLabel}</p>
    </div>
  );
}
