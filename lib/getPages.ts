import fs from "fs";
import path from "path";
import { PageData } from "./types";

const contentDir = path.join(process.cwd(), "content", "pages");

function isPublished(page: PageData): boolean {
  if (!page.publishDate) return true;
  const today = new Date().toISOString().split("T")[0];
  return page.publishDate <= today;
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(".json", ""))
    .filter((slug) => {
      const page = getPageData(slug);
      return page ? isPublished(page) : false;
    });
}

// Returns ALL slugs including future-dated pages (for generateStaticParams)
export function getAllSlugsIncludingScheduled(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(".json", ""));
}

export function getPageData(slug: string): PageData | null {
  const filePath = path.join(contentDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as PageData;
}

export function getPublishedPageData(slug: string): PageData | null {
  const page = getPageData(slug);
  if (!page || !isPublished(page)) return null;
  return page;
}

// A related-page link is safe to render when the target is not a content page
// (a hub such as /dress-code) or is a content page whose publishDate has arrived.
// Linking a queued page early serves crawlers a 404 that the ISR cache then pins.
export function isLinkableSlug(slug: string): boolean {
  const page = getPageData(slug);
  return page ? isPublished(page) : true;
}

export function getAllPages(): PageData[] {
  return getAllSlugs()
    .map((slug) => getPageData(slug))
    .filter((page): page is PageData => page !== null);
}
