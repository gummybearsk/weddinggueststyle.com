import Figure from "./Figure";
import type { CompareVisual } from "@/lib/types";

/** Two or more codes (or men vs women) compared aspect by aspect. */
export default function CompareTable({ title, caption, columns, rows }: CompareVisual) {
  return (
    <Figure title={title} caption={caption}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[30rem]">
          <thead>
            <tr>
              <th className="text-left p-3 border-b-2 border-ink-900 text-[11px] uppercase tracking-[0.15em] text-ink-500 font-medium w-1/4"></th>
              {columns.map((c) => (
                <th key={c} className="text-left p-3 border-b-2 border-ink-900 display-serif text-base text-ink-900 font-normal">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-ink-200 align-top">
                <th scope="row" className="text-left p-3 text-[11px] uppercase tracking-[0.12em] text-ink-600 font-medium">
                  {r.label}
                </th>
                {r.cells.map((cell, i) => (
                  <td key={i} className="p-3 text-ink-700 font-light leading-snug">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Figure>
  );
}
