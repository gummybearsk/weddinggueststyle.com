import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Wedding Guest Dresses 2026: 700+ Hand-Picked Styles for Every Wedding",
    template: "%s | Wedding Guest Style",
  },
  description:
    "Find the perfect wedding guest dress for 2026 — 700+ hand-picked styles for every season, dress code, body type, and venue. Black tie, casual, cocktail, formal & more. Honest reviews, sizing advice, real prices.",
  metadataBase: new URL("https://weddinggueststyle.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Wedding Guest Style",
    url: "https://weddinggueststyle.com",
  },
  alternates: {
    canonical: "https://weddinggueststyle.com",
    languages: {
      "en-US": "https://weddinggueststyle.com",
      "x-default": "https://weddinggueststyle.com",
    },
  },
  other: {
    "geo.region": "US",
    "geo.placename": "United States",
    "content-language": "en-US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "w0rf19q2vc");
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
