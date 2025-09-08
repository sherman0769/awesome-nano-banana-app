// src/app/page.tsx
import { getManifest, getTopTags } from "@/lib/data";
import Link from "next/link";

export default function HomePage() {
  const manifest = getManifest();
  const total = manifest.cases.length;
  const tags = getTopTags(12);

  return (
    <main style={{ padding: 16 }}>
      <h1>快速搜尋</h1>
      <p>目前共 {total} 個案例。輸入關鍵字（中/英），或點選標籤。</p>

      <form action="/cases" method="get" style={{ display: "flex", gap: 8, margin: "12px 0 16px" }}>
        <input
          type="search"
          name="q"
          placeholder="例：手辦、Anime、遮罩、光影…"
          style={{ flex: 1, padding: "10px 12px" }}
        />
        <button type="submit">搜尋</button>
      </form>

      <div style={{ marginTop: 8 }}>
        {tags.map((t) => (
          <Link
            key={t}
            href={`/cases?tag=${encodeURIComponent(t)}`}
            style={{ display: "inline-block", padding: "4px 10px", marginRight: 8, marginBottom: 8, background: "#eee", borderRadius: 999 }}
          >
            {t}
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 20 }}>
        <Link href="/cases">→ 前往所有案例列表</Link>
      </p>
    </main>
  );
}
