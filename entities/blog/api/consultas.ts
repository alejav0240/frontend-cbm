import { gql } from "@apollo/client";

export const OBTENER_POSTS_BLOG = gql`
  query ObtenerPostsBlog($status: String, $page: Int, $pageSize: Int, $search: String) {
    blogPosts(status: $status, page: $page, pageSize: $pageSize, search: $search) {
      results {
        id
        titulo: title
        resumen: excerpt
        contenido: content
        categoria: category
        autor: author
        urlImagen: imageUrl
        tiempoLectura: readTime
        estado: status
        fechaCreacion: createdAt
        updatedAt
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;
