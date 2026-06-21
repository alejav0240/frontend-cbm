import { gql } from "@apollo/client";

export const OBTENER_POSTS_BLOG = gql`
  query ObtenerPostsBlog($status: String) {
    blogPosts(status: $status) {
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
  }
`;
