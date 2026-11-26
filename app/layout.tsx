import { Analytics } from "@/components/Analytics";
import type { Metadata } from "next";
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google";
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
    default: "Wedding Guest Attire for Women & Men: All 7 Dress Codes",
    template: "%s | Wedding Guest Style",
  },
  description:
    "Wedding guest attire for women and men, decoded for every dress code from white tie to casual, with Emily Post–cited guides and in-stock picks checked daily.",
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
      <body className={`${inter.variable} ${playfair.variable} ${cormorant.variable} font-sans antialiased`}>
        <Header navGroups={getNavGroups()} />
        <main>{children}</main>
        <Footer />
        {/* Analytics + EEA/UK/CH consent gate: must stay in <body> (Rule 64). */}
        <Analytics />
      </body>
    </html>
  );
}
