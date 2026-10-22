import Figure from "./Figure";
import type { BarsVisual } from "@/lib/types";

/** Horizontal bars on one shared scale, for counts and shares from our own datasets. */
export default function BarChart({ title, caption, data, unit = "" }: BarsVisual) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <Figure title={title} caption={caption}>
      <ul className="space-y-2.5">
        {data.map((d) => (
          <li key={d.label} className="grid grid-cols-[minmax(8rem,14rem)_1fr_4.5rem] items-center gap-3 text-sm">
            <span className="text-ink-700 font-light leading-snug">{d.label}</span>
            <span className="h-3 bg-ink-100 block" aria-hidden="true">
              <span
                className={`h-3 block ${d.highlight ? "bg-blush-600" : "bg-blush-300"}`}
                style={{ width: `${(d.value / max) * 100}%` }}
              />
            </span>
            <span className="text-right tabular-nums text-ink-900">
              {d.value.toLocaleString("en-US")}
              {unit}
            </span>
          </li>
        ))}
      </ul>
    </Figure>
  );
}
