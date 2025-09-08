"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

export default function FavoritesPage() {
  const [allCases, setAllCases] = useState<CaseItem[]>([]);
  const [favSlugs, setFavSlugs] = useState<string[]>([]);

  useEffect(() => {
    fetch("/data/prompts.json")
      .then((r) => r.json())
      .then((j: Manifest) => setAllCases(j.cases));
    try {
      const raw = localStorage.getItem("favorites") || "[]";
      setFavSlugs(JSON.parse(raw));
    } catch {}
  }, []);

  const favSet = useMemo(() => new Set(favSlugs), [favSlugs]);
  const favCases = useMemo(() => allCases.filter((c) => favSet.has(c.slug)), [allCases, favSet]);

  function remove(slug: string) {
    try {
      const set = new Set(favSlugs);
      set.delete(slug);
      const next = [...set];
      localStorage.setItem("favorites", JSON.stringify(next));
      setFavSlugs(next);
    } catch {}
  }

  function clearAll() {
    localStorage.removeItem("favorites");
    setFavSlugs([]);
  }

  return (
    <section style={{ padding: 16 }}>
      <p><Link href="/cases">← 返回列表</Link></p>
      <h1>我的收藏</h1>

      <div style={{ margin: "8px 0 16px", color: "#666" }}>
        共 {favCases.length} 筆
        {favCases.length > 0 && (
          <>
            {" "}
            <button
              onClick={clearAll}
              style={{ marginLeft: 12, padding: "6px 10px", borderRadius: 8, border: "1px solid #eee", background: "#f7f7f7", cursor: "pointer" }}
              title="清空所有收藏"
            >
              清空收藏
            </button>
          </>
        )}
      </div>

      {favCases.length === 0 ? (
        <p className="muted">目前尚無收藏。到 <Link href="/cases">案例列表</Link> 按「☆ 收藏」即可加入。</p>
      ) : (
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {favCases.map((c) => {
            const cover = c.images.find((i) => i.role === "output") || c.images[0];
            return (
              <div key={c.slug} className="card" style={{ position: "relative" }}>
                <Link href={`/cases/${c.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  {cover && <img src={`/${cover.src.replace(/^\//, "")}`} alt={c.title.zh} loading="lazy" style={{ width: "100%", display: "block" }} />}
                  <div className="card-body">
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>{c.title.zh}</div>
                    <div className="muted" style={{ marginBottom: 8 }}>{c.title.en}</div>
                  </div>
                </Link>
                <div style={{ position: "absolute", top: 8, right: 8 }}>
                  <button
                    onClick={() => remove(c.slug)}
                    title="移除收藏"
                    style={{ padding: "6px 10px", borderRadius: 999, border: "1px solid #eee", background: "#fde68a", cursor: "pointer", fontSize: 13 }}
                  >
                    取消收藏
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
