import { Suspense } from "react";
import { PagosPage } from "@/views/pagos";

export default function PaginaPagos() {
  return (
    <Suspense fallback={<div />}>
      <PagosPage />
    </Suspense>
  );
}
