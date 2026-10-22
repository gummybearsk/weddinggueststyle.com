import Figure from "./Figure";
import type { WearAvoidVisual } from "@/lib/types";

/** Side-by-side "wear / avoid" lists, usually one column for women and one for men. */
export default function WearAvoid({ title, caption, columns }: WearAvoidVisual) {
  return (
    <Figure title={title} caption={caption}>
      <div className={`grid gap-4 ${columns.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {columns.map((col) => (
          <div key={col.label} className="border border-ink-200">
            <p className="px-4 py-2 bg-ink-900 text-ivory text-xs uppercase tracking-[0.18em]">{col.label}</p>
            <div className="grid grid-cols-2 divide-x divide-ink-200">
              <div className="p-4">
                <p className="text-xs font-semibold text-emerald-800 mb-2">✓ Wear</p>
                <ul className="space-y-1.5 text-sm text-ink-700 font-light leading-snug">
                  {col.wear.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-cream-50">
                <p className="text-xs font-semibold text-red-800 mb-2">✕ Avoid</p>
                <ul className="space-y-1.5 text-sm text-ink-700 font-light leading-snug">
                  {col.avoid.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Figure>
  );
}
