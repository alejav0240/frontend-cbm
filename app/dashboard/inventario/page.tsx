import { Suspense } from "react";
import { InventarioPage } from "@/views/inventario";

export default function PaginaInventario() {
  return (
    <Suspense fallback={<div />}>
      <InventarioPage />
    </Suspense>
  );
}
