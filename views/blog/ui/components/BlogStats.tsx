"use client";

import React from "react";
import { StatCard } from "@/shared/ui/StatCard";
import { FileText, Globe, FileEdit, Layers } from "lucide-react";

interface BlogStatsProps {
  total: number;
  posts: Array<{ estado: string; categoria: string }>;
}

export function BlogStats({ total, posts }: BlogStatsProps) {
  const publicados = posts.filter((p) => p.estado === "PUBLISHED").length;
  const borradores = posts.filter((p) => p.estado === "DRAFT").length;
  const categorias = new Set(posts.map((p) => p.categoria)).size;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={<FileText />}
        label="Total Artículos"
        value={String(total)}
        color="teal"
      />
      <StatCard
        icon={<Globe />}
        label="Publicados"
        value={String(publicados)}
        color="green"
      />
      <StatCard
        icon={<FileEdit />}
        label="Borradores"
        value={String(borradores)}
        color="amber"
      />
      <StatCard
        icon={<Layers />}
        label="Categorías"
        value={String(categorias)}
        color="purple"
      />
    </div>
  );
}
