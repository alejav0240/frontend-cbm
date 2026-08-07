import { Suspense } from "react";
import { SesionesPage } from "@/views/sesiones";

export default function PaginaSesiones() {
  return (
    <Suspense fallback={<div />}>
      <SesionesPage />
    </Suspense>
  );
}
