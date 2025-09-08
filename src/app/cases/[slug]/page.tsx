// src/app/cases/[slug]/page.tsx
import { getCaseBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import FavoriteButton from "@/components/FavoriteButton";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getCaseBySlug(slug);
  if (!item) notFound();

  // 僅把 input 視為參考圖；output 優先，其次用 other 補成品圖
  const inputImages = item.images.filter((i) => i.role === "input");
  const outputImages = item.images.filter((i) => i.role === "output");
  const otherImages = item.images.filter((i) => i.role === "other");

  const refImages = inputImages;                          // 參考圖 = input
  const outImages = outputImages.length ? outputImages : otherImages; // 成品圖 = output；若沒有就用 other

  const RoleBadge = ({ role }: { role: string }) => (
    <span style={{ fontSize: 12, background: "#f2f2f2", padding: "2px 8px", borderRadius: 999 }}>
      {role}
    </span>
  );

  return (
    <article style={{ padding: 16 }}>
      <p><Link href="/cases">← 返回列表</Link></p>
      <h1>{item.title.zh}</h1>
      <div style={{ margin: "8px 0 12px" }}>
        <FavoriteButton slug={item.slug} />
      </div>
      <p style={{ color: "#666" }}>{item.title.en}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "8px 0 16px" }}>
        {item.tags.map((t) => (
          <Link
            key={t}
            href={{ pathname: "/cases", query: { tag: t } }}
            style={{ background: "#eee", padding: "2px 8px", borderRadius: 999, fontSize: 12 }}
          >
            {t}
          </Link>
        ))}
      </div>

      <section style={{ marginBottom: 16 }}>
        <h3>參考圖（原圖 Reference）</h3>
        {refImages.length > 0 ? (
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {refImages.map((img, i) => (
              <div key={`ref-${i}`} style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
                <img
                  src={`/${img.src.replace(/^\//, "")}`}
                  alt={`${item.title.zh}-ref-${i}`}
                  loading="lazy"
                  style={{ width: "100%", display: "block" }}
                />
                <div style={{ padding: 8 }}><RoleBadge role={img.role} /></div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#666" }}>此案例未提供 <code>input</code> 參考圖。</p>
        )}
      </section>

      <section style={{ marginBottom: 16 }}>
        <h3>成品圖（輸出 Output）</h3>
        {outImages.length > 0 ? (
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {outImages.map((img, i) => (
              <div key={`out-${i}`} style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
                <img
                  src={`/${img.src.replace(/^\//, "")}`}
                  alt={`${item.title.zh}-out-${i}`}
                  loading="lazy"
                  style={{ width: "100%", display: "block" }}
                />
                <div style={{ padding: 8 }}><RoleBadge role={img.role} /></div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#666" }}>此案例未提供成品圖。</p>
        )}
      </section>

      <h3>提示詞（繁中）</h3>
      <pre>{item.prompts.zh}</pre>
      <div style={{ marginTop: 8 }}>
        <CopyButton text={item.prompts.zh} />
      </div>

      <h3 style={{ marginTop: 16 }}>Prompt (English)</h3>
      <pre>{item.prompts.en}</pre>
      <div style={{ marginTop: 8 }}>
        <CopyButton text={item.prompts.en} label="Copy" />
      </div>
    </article>
  );
}