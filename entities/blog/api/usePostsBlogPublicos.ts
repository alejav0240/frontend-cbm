import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import {
  ObtenerPostsBlogPublicosQuery,
  ObtenerPostBlogPublicoQuery,
} from "@/shared/api/generated/graphql";
import {
  OBTENER_POSTS_BLOG_PUBLICOS,
  OBTENER_POST_BLOG_PUBLICO,
} from "./consultas";
import { PostBlog } from "../model/tipos";

export function usePostsBlogPublicos(page = 1, pageSize = 9) {
  const { data, loading, error } = useQuery<ObtenerPostsBlogPublicosQuery>(
    OBTENER_POSTS_BLOG_PUBLICOS,
    { variables: { page, pageSize } },
  );
  const posts = useMemo(
    () =>
      (data?.publicBlogPosts?.results ?? [])
        .filter((post): post is NonNullable<typeof post> => post !== null)
        .map((post) => ({
          ...post,
          tipo: (post.tipo || "MARKDOWN").toUpperCase(),
          fechaCreacion: new Date(post.fechaCreacion as string),
        })) as unknown as PostBlog[],
    [data],
  );
  return {
    posts,
    paginas: data?.publicBlogPosts?.totalPages ?? 0,
    total: data?.publicBlogPosts?.totalCount ?? 0,
    cargando: loading,
    error,
  };
}

export function usePostBlogPublico(slug: string) {
  const { data, loading, error } = useQuery<ObtenerPostBlogPublicoQuery>(
    OBTENER_POST_BLOG_PUBLICO,
    { variables: { slug }, skip: !slug },
  );
  return {
    post: (data?.publicBlogPost ?? null) as PostBlog | null,
    cargando: loading,
    error,
  };
}
