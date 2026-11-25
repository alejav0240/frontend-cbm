import { gql } from "@apollo/client";

export const OBTENER_POSTS_BLOG = gql`
  query ObtenerPostsBlog($status: String, $type: String, $page: Int, $pageSize: Int, $search: String) {
    blogPosts(status: $status, type: $type, page: $page, pageSize: $pageSize, search: $search) {
      results {
        id
        slug
        titulo: title
        resumen: excerpt
        contenido: content
        categoria: category
        autor: author
        urlImagen: imageUrl
        tiempoLectura: readTime
        estado: status
        tipo: type
        fechaCreacion: createdAt
        updatedAt
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;

export const OBTENER_POSTS_BLOG_PUBLICOS = gql`
  query ObtenerPostsBlogPublicos($page: Int, $pageSize: Int) {
    publicBlogPosts(page: $page, pageSize: $pageSize) {
      results {
        id
        slug
        titulo: title
        resumen: excerpt
        contenido: content
        categoria: category
        autor: author
        urlImagen: imageUrl
        tiempoLectura: readTime
        estado: status
        tipo: type
        fechaCreacion: createdAt
      }
      totalPages
      currentPage
      totalCount
    }
  }
`;

export const OBTENER_POST_BLOG_PUBLICO = gql`
  query ObtenerPostBlogPublico($slug: String!) {
    publicBlogPost(slug: $slug) {
      id
      slug
      titulo: title
      resumen: excerpt
      contenido: content
      categoria: category
      autor: author
      urlImagen: imageUrl
      tiempoLectura: readTime
      estado: status
      tipo: type
      fechaCreacion: createdAt
    }
  }
`;
