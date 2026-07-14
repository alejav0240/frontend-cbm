import { useQuery } from "@apollo/client/react";
import { OBTENER_POSTS_BLOG } from "./consultas";
import { PostBlog } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerPostsBlogQuery } from "@/shared/api/generated/graphql";

interface PostsBlogFiltros {
  page?: number;
  pageSize?: number;
  estado?: string;
}

export const usePostsBlog = (filtros: PostsBlogFiltros = {}) => {
  const { data, loading, error, refetch } = useQuery<ObtenerPostsBlogQuery>(
    OBTENER_POSTS_BLOG,
    {
      variables: {
        status: filtros.estado,
        page: filtros.page,
        pageSize: filtros.pageSize,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  const posts = useMemo(() => {
    return (data?.blogPosts?.results || [])
      .filter((p): p is NonNullable<typeof p> => p != null)
      .map((p) => ({
        ...p,
        fechaCreacion: new Date(p.fechaCreacion as string),
      })) as unknown as PostBlog[];
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
