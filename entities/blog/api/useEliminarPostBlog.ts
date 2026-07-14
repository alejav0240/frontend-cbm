import { useMutation } from "@apollo/client/react";
import { DELETE_BLOG_POST } from "./mutaciones";
import { OBTENER_POSTS_BLOG } from "./consultas";

export function useEliminarPostBlog() {
  const [mutation, { loading, error }] = useMutation(DELETE_BLOG_POST, {
    refetchQueries: [{ query: OBTENER_POSTS_BLOG }],
  });

  const eliminarPost = (id: string) => {
    return mutation({ variables: { id } });
  };

  return { eliminarPost, eliminando: loading, error };
}
