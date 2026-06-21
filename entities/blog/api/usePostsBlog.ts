import { useQuery } from "@apollo/client/react";
import { OBTENER_POSTS_BLOG } from "./consultas";
import { PostBlog } from "../model/tipos";
import { useMemo } from "react";
import { ObtenerPostsBlogQuery } from "@/shared/api/generated/graphql";

export const usePostsBlog = (estado?: string) => {
  const { data, loading, error, refetch } = useQuery<ObtenerPostsBlogQuery>(
    OBTENER_POSTS_BLOG,
    {
      variables: { status: estado },
    },
  );

  const posts = useMemo(() => {
    return ((data?.blogPosts || []).filter(Boolean) as any[]).map((p) => ({
      ...p,
      fechaCreacion: new Date(p.fechaCreacion),
    })) as PostBlog[];
  }, [data]);

  return {
    posts,
    cargando: loading,
    error,
    refetch,
  };
};
