import { useQuery } from "@apollo/client/react";
import { OBTENER_POSTS_BLOG } from "./consultas";
import { PostBlog } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerPostsBlogQuery } from "@/shared/api/generated/graphql";

interface PostsBlogFiltros {
  page?: number;
  pageSize?: number;
  estado?: string;
  busqueda?: string;
  tipo?: string;
}

export const usePostsBlog = (filtros: PostsBlogFiltros = {}) => {
  const { data, loading, error, refetch } = useQuery<ObtenerPostsBlogQuery>(
    OBTENER_POSTS_BLOG,
    {
      variables: {
        status: filtros.estado,
        type: filtros.tipo,
        page: filtros.page,
        pageSize: filtros.pageSize,
        search: filtros.busqueda || "",
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const posts = useMemo(() => {
    return (data?.blogPosts?.results || [])
      .filter((p): p is NonNullable<typeof p> => p != null)
      .map((p) => {
        const item = p as typeof p & { tipo?: string };
        return {
          ...item,
          tipo: (item.tipo || "MARKDOWN").toUpperCase(),
          fechaCreacion: new Date(item.fechaCreacion as string),
        };
      }) as unknown as PostBlog[];
  }, [data]);

  return {
    posts,
    paginas: data?.blogPosts?.totalPages || 0,
    paginaActual: data?.blogPosts?.currentPage || 0,
    total: data?.blogPosts?.totalCount || 0,
    cargando: loading,
    error,
    refetch,
  };
};
