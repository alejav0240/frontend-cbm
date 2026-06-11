import { useQuery } from "@apollo/client/react";
import { OBTENER_POSTS_BLOG } from "./consultas";
import { PostBlog } from "../model/tipos";
import { useMemo } from "react";

export const usePostsBlog = (estado?: string) => {
  const { data, loading, error, refetch } = useQuery<any>(OBTENER_POSTS_BLOG, {
    variables: { status: estado },
  });

  const posts: PostBlog[] = useMemo(() => {
    return (data?.blogPosts || []).map((p: any) => ({
      id: p.id,
      titulo: p.title,
      resumen: p.excerpt,
      contenido: p.content,
      categoria: p.category,
      autor: p.author,
      urlImagen: p.imageUrl,
      tiempoLectura: p.readTime,
      estado: p.status,
      fechaCreacion: new Date(p.createdAt),
    }));
  }, [data]);

  return {
    posts,
    cargando: loading,
    error,
    refetch,
  };
};
