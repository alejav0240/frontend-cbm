import { Suspense } from "react";
import { PacientesPage } from "@/views/pacientes";

export default function PaginaPacientes() {
  return (
    <Suspense fallback={<div />}>
      <PacientesPage />
    </Suspense>
  );
}
