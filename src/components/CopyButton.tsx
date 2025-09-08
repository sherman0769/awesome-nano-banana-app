"use client";
import { useState } from "react";

export default function CopyButton({
  text,
  label = "複製"
}: {
  text: string;
  label?: string;
}) {
  const [ok, setOk] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text || "");
      setOk(true);
      setTimeout(() => setOk(false), 1500);
    } catch {
      // 失敗就不提示，避免干擾
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: "8px 12px",
        borderRadius: 8,
        background: "#111827",
        color: "#fff",
        border: "none",
        cursor: "pointer"
      }}
    >
      {ok ? "已複製 ✓" : label}
    </button>
  );
}
