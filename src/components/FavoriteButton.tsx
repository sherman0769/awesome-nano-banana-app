"use client";
import { useEffect, useState } from "react";

type Props = { slug: string };

export default function FavoriteButton({ slug }: Props) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("favorites") || "[]";
      const arr: string[] = JSON.parse(raw);
      setIsFav(arr.includes(slug));
    } catch {}
  }, [slug]);

  function toggle() {
    try {
      const raw = localStorage.getItem("favorites") || "[]";
      const arr: string[] = JSON.parse(raw);
      const set = new Set(arr);
      if (set.has(slug)) set.delete(slug); else set.add(slug);
      localStorage.setItem("favorites", JSON.stringify([...set]));
      setIsFav(set.has(slug));
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      title={isFav ? "取消收藏" : "加入收藏"}
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #eee",
        background: isFav ? "#fde68a" : "#f7f7f7",
        cursor: "pointer",
        fontSize: 13
      }}
    >
      {isFav ? "★ 已收藏" : "☆ 收藏"}
    </button>
  );
}
