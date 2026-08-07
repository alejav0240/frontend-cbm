import { Suspense } from "react";
import { RolesPage } from "@/views/roles";

export default function PaginaRoles() {
  return (
    <Suspense fallback={<div />}>
      <RolesPage />
    </Suspense>
  );
}
