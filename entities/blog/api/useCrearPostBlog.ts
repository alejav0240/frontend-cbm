import { useMutation } from "@apollo/client/react";
import { CREATE_BLOG_POST } from "./mutaciones";
import { OBTENER_POSTS_BLOG } from "./consultas";

interface CrearPostBlogVars {
  title: string;
  content: string;
  category: string;
  author: string;
  excerpt?: string;
  imageUrl?: string;
  readTime?: string;
  status?: string;
}

export function useCrearPostBlog() {
  const [mutation, { loading, error }] = useMutation(CREATE_BLOG_POST, {
    refetchQueries: [{ query: OBTENER_POSTS_BLOG }],
  });

  const crearPost = (variables: CrearPostBlogVars) => {
    return mutation({ variables });
  };

  return { crearPost, creando: loading, error };
}
