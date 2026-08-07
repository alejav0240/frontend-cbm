import { Suspense } from "react";
import { GastosPage } from "@/views/gastos";

export default function PaginaGastos() {
  return (
    <Suspense fallback={<div />}>
      <GastosPage />
    </Suspense>
  );
}
