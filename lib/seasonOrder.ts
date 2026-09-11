import type { HomepageSection } from "./types";

/**
 * Order the season sections so the CURRENT season leads, then the one people are already
 * shopping for next.
 *
 * The homepage previously hardcoded summer → fall → spring → winter, so in September the
 * site opened on summer dresses. Wedding guests shop 4-10 weeks ahead of an event, so the
 * useful order is current season first, next season second.
 *
 * Rotating by date rather than hardcoding "fall first" means this never goes stale — the
 * homepage revalidates every 12h (app/page.tsx), so the order follows the calendar on its own.
 *
 * Northern-hemisphere seasons: 78% of this site's Bing clicks are US, 5% GB.
 */
export type SeasonKey = "spring" | "summer" | "fall" | "winter";

/** Meteorological seasons — month is 0-indexed, as from Date#getMonth(). */
export function seasonForMonth(month: number): SeasonKey {
  if (month <= 1 || month === 11) return "winter"; // Dec, Jan, Feb
  if (month <= 4) return "spring"; // Mar, Apr, May
  if (month <= 7) return "summer"; // Jun, Jul, Aug
  return "fall"; // Sep, Oct, Nov
}

const CYCLE: SeasonKey[] = ["spring", "summer", "fall", "winter"];

/** Current season first, then the rest of the year in calendar order. */
export function seasonPriority(now: Date = new Date()): SeasonKey[] {
  const start = CYCLE.indexOf(seasonForMonth(now.getMonth()));
  return CYCLE.slice(start).concat(CYCLE.slice(0, start));
}

/** Reorder season sections in place-safe fashion; unknown sections keep their relative order at the end. */
export function orderSeasonSections(sections: HomepageSection[], now: Date = new Date()): HomepageSection[] {
  const rank = new Map(seasonPriority(now).map((s, i) => [s, i]));
  const keyOf = (s: HomepageSection): SeasonKey | undefined =>
    CYCLE.find((c) => s.id.includes(c) || s.slug.includes(c));

  return [...sections].sort((a, b) => {
    const ra = rank.get(keyOf(a) as SeasonKey) ?? 99;
    const rb = rank.get(keyOf(b) as SeasonKey) ?? 99;
    return ra - rb;
  });
}
