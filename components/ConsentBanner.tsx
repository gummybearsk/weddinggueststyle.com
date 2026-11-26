'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'

/**
 * Consent notice for EEA / UK / Swiss visitors.
 *
 * Required before AdSense: ADS-PRIV-02. Google requires publishers serving
 * those regions to obtain consent for cookies and personalised advertising,
 * and the site was setting Google Analytics and Microsoft Clarity cookies with
 * no notice at all — which is a problem today, not only once ads are live.
 *
 * TWO THINGS THIS DELIBERATELY DOES.
 *
 * 1. It actually gates the scripts. A banner that appears while analytics has
 *    already loaded is theatre: the cookies are set before anyone clicks
 *    anything. Analytics and Clarity now mount only after a positive choice,
 *    and `Decline` means they never load at all this session.
 *
 * 2. It only asks where consent is legally required. Showing a cookie wall to
 *    every visitor worldwide costs conversions for no benefit, so the region
 *    is inferred from the browser's own IANA timezone — no IP lookup, no third
 *    party, nothing that itself needs consent. Outside those regions analytics
 *    loads as before.
 *
 * The choice is stored in localStorage rather than a cookie, so declining
 * genuinely results in no cookies being set.
 */

const STORAGE_KEY = 'wgs-consent'

export type ConsentChoice = 'granted' | 'denied'

/** IANA timezone prefixes covering the EEA, the UK and Switzerland. */
const CONSENT_REQUIRED_ZONES = [
  'Europe/',
  'Atlantic/Azores',
  'Atlantic/Madeira',
  'Atlantic/Canary',
  'Atlantic/Reykjavik',
]

/** Zones inside Europe/ that are outside the EEA/UK/CH. */
const EXEMPT_EUROPE_ZONES = [
  'Europe/Moscow',
  'Europe/Kaliningrad',
  'Europe/Samara',
  'Europe/Volgograd',
  'Europe/Saratov',
  'Europe/Ulyanovsk',
  'Europe/Astrakhan',
  'Europe/Kirov',
  'Europe/Minsk',
  'Europe/Istanbul',
]

export function consentRequired(): boolean {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ''
    if (EXEMPT_EUROPE_ZONES.includes(zone)) return false
    return CONSENT_REQUIRED_ZONES.some((prefix) => zone.startsWith(prefix))
  } catch {
    // If the timezone cannot be read, ask — the cautious side of the trade.
    return true
  }
}

export function readConsent(): ConsentChoice | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'granted' || stored === 'denied' ? stored : null
  } catch {
    return null
  }
}

/**
 * What the browser already tells us, before anyone clicks.
 *
 * Read through useSyncExternalStore rather than copied into state by an effect:
 * timezone and localStorage are external, they do not change mid-session, and
 * an effect that calls setState on mount is a cascading render for no reason.
 * The server snapshot is null so nothing renders until hydration, which also
 * avoids a hydration mismatch — the server cannot know the visitor's region.
 */
function subscribe() {
  return () => {}
}

function getSnapshot(): ConsentChoice | 'ask' {
  if (!consentRequired()) return 'granted'
  return readConsent() ?? 'ask'
}

export function useConsent(): {
  consent: ConsentChoice | null
  needsAsking: boolean
  decide: (choice: ConsentChoice) => void
} {
  const stored = useSyncExternalStore(subscribe, getSnapshot, () => null)
  const [clicked, setClicked] = useState<ConsentChoice | null>(null)

  const decide = useCallback((choice: ConsentChoice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      // Private mode — the choice simply is not remembered next visit.
    }
    setClicked(choice)
  }, [setClicked])

  const resolved = clicked ?? (stored === 'ask' ? null : stored)
  return {
    consent: resolved,
    needsAsking: clicked === null && stored === 'ask',
    decide,
  }
}

export function ConsentBanner({
  onDecide,
}: {
  onDecide: (choice: ConsentChoice) => void
}) {
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-slate-900 bg-white p-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-slate-700">
          We use cookies for analytics, to understand which pages are
          used and where the site is broken. Nothing loads until you choose. See our{' '}
          <a href="/privacy" className="font-medium text-slate-900 underline">
            privacy policy
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onDecide('denied')}
            className="rounded-lg border-2 border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-500"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => onDecide('granted')}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
