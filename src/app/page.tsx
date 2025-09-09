// src/app/page.tsx
import { getManifest, getTopTags } from "@/lib/data";
import Link from "next/link";

export default function HomePage() {
  const manifest = getManifest();
  const total = manifest.cases.length;
  const tags = getTopTags(12);

  return (
    <main className="container" style={{ minHeight: "100vh" }}>
      <h1>快速搜尋</h1>
      <p className="muted">目前共 {total} 個案例。輸入關鍵字（中/英），或點選標籤。</p>

      <form action="/cases" method="get" className="row" style={{ margin: "12px 0 16px" }}>
        <input type="search" name="q" placeholder="例：手辦、Anime、遮罩、光影…" />
        <button type="submit" className="btn">
          搜尋
        </button>
      </form>

      <div style={{ marginTop: 8 }}>
        {tags.map((t) => (
          <Link key={t} href={`/cases?tag=${encodeURIComponent(t)}`} className="badge">
            {t}
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 20 }}>
        <Link href="/cases">→ 前往所有案例列表</Link>
      </p>

      <div className="watermark">Li&apos;s Meet AI Studio</div>
    </main>
  );
}
