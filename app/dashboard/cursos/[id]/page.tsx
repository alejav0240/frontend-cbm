"use client";

import { use } from "react";
import { CursoDetallePage } from "@/views/cursos";

type RouteParams = { id: string };

interface PageProps {
  params: Promise<RouteParams>;
}

export default function PaginaCursoDetalle({ params }: PageProps) {
  const { id } = use(params);
  return <CursoDetallePage id={id} />;
}
