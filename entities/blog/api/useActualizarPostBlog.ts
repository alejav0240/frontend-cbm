import { useMutation } from "@apollo/client/react";
import { UPDATE_BLOG_POST } from "./mutaciones";
import { OBTENER_POSTS_BLOG } from "./consultas";

interface ActualizarPostBlogVars {
  id: string;
  title?: string;
  content?: string;
  category?: string;
  author?: string;
  excerpt?: string;
  imageUrl?: string;
  readTime?: string;
  status?: string;
}

export function useActualizarPostBlog() {
  const [mutation, { loading, error }] = useMutation(UPDATE_BLOG_POST, {
    refetchQueries: [{ query: OBTENER_POSTS_BLOG }],
  });

  const actualizarPost = (variables: ActualizarPostBlogVars) => {
    return mutation({ variables });
  };

  return { actualizarPost, actualizando: loading, error };
}
