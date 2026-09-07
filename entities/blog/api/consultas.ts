import { gql } from "@apollo/client";

export const OBTENER_POSTS_BLOG = gql`
  query ObtenerPostsBlog($status: String, $type: String, $page: Int, $pageSize: Int, $search: String) {
    blogPosts(status: $status, type: $type, page: $page, pageSize: $pageSize, search: $search) {
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
