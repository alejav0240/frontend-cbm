import { Suspense } from "react";
import EscalasPage from "@/views/escalas/ui/EscalasPage";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <EscalasPage />
    </Suspense>
  );
}
