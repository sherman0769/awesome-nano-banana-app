// src/app/cases/[slug]/page.tsx
import { getCaseBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getCaseBySlug(slug);
  if (!item) notFound();

  const outputs = item.images.filter((i) => i.role === "output");
  const gallery = outputs.length ? outputs : item.images;

  return (
    <article style={{ padding: 16 }}>
      <p>
        <Link href="/cases">← 返回列表</Link>
      </p>
      <h1>{item.title.zh}</h1>
      <p style={{ color: "#666" }}>{item.title.en}</p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          margin: "8px 0 16px",
        }}
      >
        {item.tags.map((t) => (
          <Link
            key={t}
            href={{ pathname: "/cases", query: { tag: t } }}
            style={{
              background: "#eee",
              padding: "2px 8px",
              borderRadius: 999,
              fontSize: 12,
            }}
          >
            {t}
          </Link>
        ))}
      </div>

      <h3>參考圖像</h3>
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          marginBottom: 16,
        }}
      >
        {gallery.map((img, i) => (
          <img
            key={i}
            src={`/${img.src.replace(/^\//, "")}`}
            alt={`${item.title.zh}-${img.role}-${i}`}
            loading="lazy"
            style={{ width: "100%", borderRadius: 8, border: "1px solid #eee" }}
          />
        ))}
      </div>

      <h3>提示詞（繁中）</h3>
      <pre>{item.prompts.zh}</pre>

      <h3 style={{ marginTop: 16 }}>Prompt (English)</h3>
      <pre>{item.prompts.en}</pre>
    </article>
  );
}
