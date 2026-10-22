import Figure from "./Figure";
import type { VerdictVisual } from "@/lib/types";

const BADGE = {
  yes: { label: "Yes", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  caution: { label: "Check first", cls: "bg-amber-50 text-amber-900 border-amber-200" },
  no: { label: "Skip it", cls: "bg-red-50 text-red-800 border-red-200" },
} as const;

/** A yes / check-first / skip verdict per situation, for "can I wear ___" questions. */
export default function VerdictTable({ title, caption, rows }: VerdictVisual) {
  return (
    <Figure title={title} caption={caption}>
      <ul className="divide-y divide-ink-200 border-y border-ink-200">
        {rows.map((r) => (
          <li key={r.context} className="grid sm:grid-cols-[1fr_8rem_2fr] gap-2 sm:gap-4 py-3 items-start">
            <span className="text-sm text-ink-900">{r.context}</span>
            <span className={`justify-self-start text-xs font-medium border px-2 py-0.5 ${BADGE[r.verdict].cls}`}>
              {BADGE[r.verdict].label}
            </span>
            <span className="text-sm text-ink-600 font-light leading-snug">{r.note}</span>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
