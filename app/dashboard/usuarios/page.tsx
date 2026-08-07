import { Suspense } from "react";
import { UsuariosPage } from "@/views/usuarios";

export default function PaginaUsuarios() {
  return (
    <Suspense fallback={<div />}>
      <UsuariosPage />
    </Suspense>
  );
}
