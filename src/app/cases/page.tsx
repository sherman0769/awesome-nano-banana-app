import { Suspense } from "react";
import CasesClient from "./CasesClient";

export default function CasesPage() {
  return (
    <Suspense fallback={<section style={{ padding: 16 }}>載入中…</section>}>
      <CasesClient />
    </Suspense>
  );
}
