// src/lib/data.ts
import fs from "node:fs";
import path from "node:path";

export type ImageEntry = { role: "input" | "output" | "other"; src: string };
export type CaseItem = {
  id: number;
  slug: string;
  title: { zh: string; en: string };
  tags: string[];
  prompts: { zh: string; en: string };
  images: ImageEntry[];
};
export type Manifest = { cases: CaseItem[] };

let cache: Manifest | null = null;

export function getManifest(): Manifest {
  if (cache) return cache;
  const p = path.join(process.cwd(), "public", "data", "prompts.json");
  const raw = fs.readFileSync(p, "utf-8");
  cache = JSON.parse(raw);
  return cache!;
}

export function getCaseBySlug(slug: string): CaseItem | undefined {
  return getManifest().cases.find((c) => c.slug === slug);
}

export function getTopTags(limit = 16): string[] {
  const set = new Set<string>();
  for (const c of getManifest().cases) for (const t of c.tags) set.add(t);
  return Array.from(set).slice(0, limit);
}
