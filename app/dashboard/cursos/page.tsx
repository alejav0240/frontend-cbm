import { Suspense } from "react";
import { CursosPage } from "@/views/cursos";

export default function PaginaCursos() {
  return (
    <Suspense fallback={<div />}>
      <CursosPage />
    </Suspense>
  );
}
