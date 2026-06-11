import { gql } from "@apollo/client";

export const GET_BLOG_POSTS = gql`
  query GetBlogPosts($status: String) {
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