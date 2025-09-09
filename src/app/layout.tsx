// src/app/layout.tsx
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import PwaRegister from "@/components/PwaRegister";
import InstallPWA from "@/components/InstallPWA";

export const viewport: Viewport = {
  themeColor: "#111827",
};

export const metadata: Metadata = {
  title: "Nano Banana Prompts",
  description: "離線可用的 Banana 提示詞與參考圖像索引",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico?v=8", sizes: "any", type: "image/x-icon" }, // ← 加版本參數
      { url: "/icon.png?v=8", type: "image/png" }                      // ← 一併加版本參數
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: "rgba(255,255,255,0.9)",
            borderBottom: "1px solid #eee",
            backdropFilter: "blur(6px)",
          }}
        >
          <b>Nano Banana Prompts</b>
          <nav style={{ display: "flex", gap: 8 }}>
            <Link
              href="/cases"
              style={{
                padding: "8px 12px",
                background: "#eee",
                borderRadius: 8,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              所有案例
            </Link>
            <Link
              href="/favorites"
              style={{
                padding: "8px 12px",
                background: "#eee",
                borderRadius: 8,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              我的收藏
            </Link>
            <InstallPWA />
          </nav>
        </header>

        <main style={{ maxWidth: 1040, margin: "0 auto", padding: 16 }}>{children}</main>
        <PwaRegister />
      </body>
    </html>
  );
}
