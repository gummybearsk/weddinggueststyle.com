'use client'

import Script from 'next/script'
import { ConsentBanner, useConsent } from './ConsentBanner'

/**
 * Analytics, gated behind consent.
 *
 * These scripts previously mounted unconditionally, which meant Google
 * Analytics and Microsoft Clarity set cookies for EEA/UK visitors with no
 * notice — a problem now, and an AdSense blocker (ADS-PRIV-02) later.
 *
 * The gate is real rather than cosmetic: nothing renders until a decision
 * exists, so `denied` means the scripts never load and no cookie is written.
 * Outside the EEA/UK/CH the banner never appears and consent resolves to
 * granted immediately, so the overwhelming majority of visitors see no change.
 */
export function Analytics() {
  const { consent, needsAsking, decide } = useConsent()

  return (
    <>
      {needsAsking && <ConsentBanner onDecide={decide} />}

      {consent === 'granted' && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-9NBJF1PB8E"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9NBJF1PB8E');
            `}
          </Script>
          <Script id="ms-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "w0rf19q2vc");
            `}
          </Script>
        </>
      )}
    </>
  )
}
