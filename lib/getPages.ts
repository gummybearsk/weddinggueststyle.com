import fs from "fs";
import path from "path";
import { PageData } from "./types";

const contentDir = path.join(process.cwd(), "content", "pages");

export function getAllSlugs(): string[] {
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

export function getAllPages(): PageData[] {
  return getAllSlugs()
    .map((slug) => getPageData(slug))
    .filter((page): page is PageData => page !== null);
}
