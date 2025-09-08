"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import MiniSearch from "minisearch";
import type { SearchResult } from "minisearch";

type ImageEntry = { role: "input" | "output" | "other"; src: string };
type CaseItem = {
  id: number;
  slug: string;
  title: { zh: string; en: string };
  tags: string[];
  prompts: { zh: string; en: string };
  images: ImageEntry[];
};
type Manifest = { cases: CaseItem[] };
type Doc = {
  id: number;
  titleZh: string;
  titleEn: string;
  promptZh: string;
  promptEn: string;
  tagsJoined: string;
};

// CJK 分詞器：單字 + 雙字詞 + 英數詞
function cjkTokenizer(text: string): string[] {
  const lower = text.toLowerCase();
  const tokens: string[] = [];
  const ascii = lower.match(/[a-z0-9]+/g);
  if (ascii) tokens.push(...ascii);
  const hanChars = Array.from(lower).filter((ch) => /\p{Script=Han}/u.test(ch));
  tokens.push(...hanChars);
  for (let i = 0; i < hanChars.length - 1; i++) tokens.push(hanChars[i] + hanChars[i + 1]);
  return tokens;
}

export default function CasesClient() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const sp = useSearchParams();
  const q = (sp.get("q") || "").trim();

  useEffect(() => {
    fetch("/data/prompts.json")
      .then((r) => r.json())
      .then((j: Manifest) => setCases(j.cases));
  }, []);

  // 全部標籤（前 30）
  const allTags = useMemo(() => {
    const count = new Map<string, number>();
    for (const c of cases) for (const t of c.tags) count.set(t, (count.get(t) || 0) + 1);
    return Array.from(count.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([t]) => t)
      .slice(0, 30);
  }, [cases]);

  // 解析多選標籤（tags=* 多值，兼容舊的 tag=*）
  const selectedTags = useMemo(() => {
    const many = sp.getAll("tags");
    const single = sp.get("tag");
    const set = new Set<string>(many);
    if (single) set.add(single);
    return Array.from(set);
  }, [sp]);

  // MiniSearch 索引
  const index = useMemo(() => {
    const mini = new MiniSearch<Doc>({
      fields: ["titleZh", "titleEn", "promptZh", "promptEn", "tagsJoined"],
      storeFields: ["id"],
      searchOptions: {
        boost: { titleZh: 3, titleEn: 2, tagsJoined: 2, promptZh: 1.5, promptEn: 1 },
        prefix: true,
        fuzzy: 0.2,
      },
      tokenize: cjkTokenizer,
    });
    const docs: Doc[] = cases.map((c) => ({
      id: c.id,
      titleZh: c.title.zh,
      titleEn: c.title.en,
      promptZh: c.prompts.zh,
      promptEn: c.prompts.en,
      tagsJoined: c.tags.join(" "),
    }));
    if (docs.length) mini.addAll(docs);
    return mini;
  }, [cases]);

  // OR 標籤 + 全文檢索交集
  const filtered = useMemo(() => {
    let arr = cases;
    if (selectedTags.length > 0) {
      arr = arr.filter((c) => c.tags.some((t) => selectedTags.includes(t)));
    }
    if (q) {
      const hits = index.search(q) as SearchResult[];
      const hitIds = new Set<number>(hits.map((h) => Number(h.id)));
      arr = arr.filter((c) => hitIds.has(c.id));
    }
    return arr;
  }, [cases, selectedTags, q, index]);

  return (
    <section style={{ padding: 16 }}>
      <h1>案例列表</h1>

      {/* 搜尋 + 多選標籤 */}
      <form action="/cases" method="get" style={{ display: "grid", rowGap: 12, margin: "12px 0 16px" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="搜尋提示詞 / 標題 / 標籤（中英皆可）"
            style={{ flex: 1, padding: "10px 12px" }}
          />
          <button type="submit">套用</button>
          <Link href={q ? `/cases?q=${encodeURIComponent(q)}` : "/cases"} style={{ padding: "8px 12px", background: "#eee", borderRadius: 8 }}>
            清除標籤
          </Link>
        </div>

        <fieldset style={{ border: "1px solid #eee", borderRadius: 8, padding: 10 }}>
          <legend style={{ padding: "0 6px", color: "#666", fontSize: 13 }}>標籤（可多選）</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {allTags.map((t) => {
              const id = `tag-${t}`;
              const checked = selectedTags.includes(t);
              return (
                <label key={t} htmlFor={id} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f7f7f7", padding: "4px 8px", borderRadius: 999 }}>
                  <input id={id} type="checkbox" name="tags" value={t} defaultChecked={checked} />
                  <span style={{ fontSize: 13 }}>{t}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </form>

      <div style={{ marginBottom: 8, color: "#666", fontSize: 13 }}>
        共 {filtered.length} 筆
        {q ? `（關鍵字：「${q}」）` : ""}
        {selectedTags.length > 0 ? `（標籤：${selectedTags.join("、")}）` : ""}
      </div>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {filtered.map((c) => {
          const cover = c.images.find((i) => i.role === "output") || c.images[0];
          return (
            <Link
              key={c.slug}
              href={`/cases/${c.slug}`}
              style={{ background: "#fff", border: "1px solid #eee", borderRadius: 10, overflow: "hidden", textDecoration: "none", color: "inherit" }}
              className="card"
            >
              {cover && <img src={`/${cover.src.replace(/^\//, "")}`} alt={c.title.zh} loading="lazy" style={{ width: "100%", display: "block" }} />}
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>{c.title.zh}</div>
                <div style={{ color: "#666", fontSize: 13, marginBottom: 8 }}>{c.title.en}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {c.tags.slice(0, 3).map((t) => (
                    <span key={t} style={{ background: "#f2f2f2", padding: "2px 8px", borderRadius: 999, fontSize: 12 }}>{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && <p style={{ color: "#666", marginTop: 16 }}>無符合結果，試試其他關鍵字或清除標籤。</p>}
    </section>
  );
}
