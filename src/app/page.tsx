// src/app/page.tsx
import { getManifest, getTopTags } from "@/lib/data";
import Link from "next/link";

export default function HomePage() {
  const tags = getTopTags(12);
  const total = getManifest().cases.length;

  return (
    <>
      <section>
        <h1>快速搜尋</h1>
        <p className="muted">目前共 {total} 個案例。輸入關鍵字（中/英），或點選標籤。</p>

        <form action="/cases" method="get" style={{ margin: "12px 0 16px" }}>
          <input type="search" name="q" placeholder="例：手辦、Anime、遮罩、光影…" />
        </form>

        <div className="row" style={{ marginTop: 8 }}>
          {tags.map((t) => (
            <Link key={t} className="badge" href={`/cases?tag=${encodeURIComponent(t)}`}>
              {t}
            </Link>
          ))}
        </div>

        <p style={{ marginTop: 20 }}>
          <Link href="/cases">→ 前往所有案例列表</Link>
        </p>
      </section>

      {/* 右下角品牌標示（首頁專用） */}
      <div
        style={{
          position: "fixed",
          right: 14,
          bottom: 14,
          zIndex: 50,
          background: "var(--brand)",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: 999,
          fontSize: 12,
          letterSpacing: ".3px",
          boxShadow: "var(--shadow)",
          opacity: 0.9
        }}
        aria-label="Li`s Meet AI studio"
      >
        Li`s Meet AI studio
      </div>
    </>
  );
}