import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getNavGroups } from "@/lib/taxonomy";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif-italic",
  weight: ["300", "400", "500"],
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  title: {
    default: "Wedding Guest Attire for Women & Men: Every Dress Code Decoded",
    template: "%s | Wedding Guest Style",
  },
  description:
    "Wedding guest attire for women and men, decoded for every dress code from white tie to casual. Dress-code guides cited to Emily Post, original data from 10,700 guest questions, and in-stock picks checked daily.",
  metadataBase: new URL("https://weddinggueststyle.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Wedding Guest Style",
    url: "https://weddinggueststyle.com",
  },
  // No site-wide canonical here: every route sets its own (SD-4), so 404s and new routes
  // never declare themselves duplicates of the homepage.
  verification: {
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
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
      <body className={`${inter.variable} ${playfair.variable} ${cormorant.variable} font-sans antialiased`}>
        <Header navGroups={getNavGroups()} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
