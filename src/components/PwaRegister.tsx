"use client";
import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          console.log("[PWA] SW registered:", reg.scope, "active:", reg.active?.state);
        })
        .catch((err) => {
          console.error("[PWA] SW register failed:", err);
        });

      // 觀察控制權變更
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("[PWA] controller:", navigator.serviceWorker.controller?.state);
      });
    }
  }, []);

  return null;
}
