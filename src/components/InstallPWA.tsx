"use client";
import { useEffect, useState } from "react";

type PromptOutcome = "accepted" | "dismissed";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: PromptOutcome; platform: string }>;
  prompt: () => Promise<void>;
}

export default function InstallPWA() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    function onPrompt(e: Event) {
      const ev = e as BeforeInstallPromptEvent;
      ev.preventDefault();
      setDeferred(ev);
    }
    function onInstalled() {
      setInstalled(true);
      setDeferred(null);
    }

    window.addEventListener("beforeinstallprompt", onPrompt as EventListener);
    window.addEventListener("appinstalled", onInstalled as EventListener);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt as EventListener);
      window.removeEventListener("appinstalled", onInstalled as EventListener);
    };
  }, []);

  if (installed || !deferred) return null;

  return (
    <button
      className="btn secondary"
      onClick={async () => {
        await deferred.prompt();
        await deferred.userChoice;
        setDeferred(null);
      }}
      title="安裝為桌面 App（Android/桌面 Chrome 支援；iOS 請用分享選單「加入主畫面」）"
    >
      安裝到主畫面
    </button>
  );
}
