import { PriceInsights } from "@/lib/priceInsights";

/**
 * Original data table — the page's Rule 22 "Experience" signal.
 *
 * Every figure is measured from our own daily Amazon API tracking of the exact dresses
 * curated on this page, not sourced from anyone else. Rows render only when the
 * underlying data supports them, so no page ever shows a fabricated zero.
 */
export default function PriceSnapshot({
  insights,
  category,
}: {
  insights: PriceInsights | null;
  category: string;
}) {
  if (!insights) return null;
  const i = insights;
  const money = (n: number) => `$${n.toFixed(0)}`;

  const rows: { label: string; value: string }[] = [
    { label: "Pieces tracked on this page", value: String(i.count) },
    { label: "Price range", value: `${money(i.min)} – ${money(i.max)}` },
    { label: "Median price", value: money(i.median) },
    { label: "Under $50", value: `${i.underFifty} of ${i.count}` },
  ];

  if (i.onSale > 0) {
    rows.push({
      label: "Discounted right now",
      value:
        i.averageDiscount !== null
          ? `${i.onSale} (avg ${i.averageDiscount}% off, deepest ${i.deepestDiscount}%)`
          : String(i.onSale),
    });
  }
  if (i.sleeved > 0) {
    rows.push({ label: "With sleeve coverage", value: `${i.sleeved} of ${i.count}` });
  }
  if (i.petiteFriendly > 0) {
    rows.push({ label: "Listed in petite sizing", value: `${i.petiteFriendly} of ${i.count}` });
  }
  if (i.plusSizeFriendly > 0) {
    rows.push({ label: "Listed in plus sizing", value: `${i.plusSizeFriendly} of ${i.count}` });
  }

  return (
    <figure className="my-12 border border-ink-200 bg-cream-50">
      <figcaption className="px-6 py-4 border-b border-ink-200">
        <p className="eyebrow text-blush-600 mb-1">At a glance</p>
        <p className="text-sm text-ink-700 font-light leading-relaxed">
          What the {category.toLowerCase()} on this page cost today.
        </p>
      </figcaption>

      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, n) => (
            <tr
              key={r.label}
              className={n % 2 ? "bg-ivory/60" : undefined}
            >
              <th
                scope="row"
                className="text-left font-light text-ink-600 px-6 py-3 w-[62%]"
              >
                {r.label}
              </th>
              <td className="px-6 py-3 text-ink-900 font-medium tabular-nums">
                {r.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="px-6 py-3 border-t border-ink-200 text-xs text-ink-500 font-light">
        Prices change often — check the current price before you buy.
      </p>
    </figure>
  );
}
