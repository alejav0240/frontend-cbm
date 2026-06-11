import { gql } from "@apollo/client";

export const OBTENER_POSTS_BLOG = gql`
  query ObtenerPostsBlog($status: String) {
    blogPosts(status: $status) {
      id
      title
      excerpt
      content
      category
      author
      imageUrl
      readTime
      status
      createdAt
      updatedAt
    }
  }
`;
