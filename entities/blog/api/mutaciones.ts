import {gql} from "@apollo/client";

export const CREATE_BLOG_POST = gql`
  mutation CreateBlogPost($title: String!, $content: String!, $category: String!, $author: String!, $excerpt: String, $imageUrl: String, $readTime: String, $status: String) {
    createBlogPost(title: $title, content: $content, category: $category, author: $author, excerpt: $excerpt, imageUrl: $imageUrl, readTime: $readTime, status: $status) {
      post {
        id
        title
      }
    }
  }
`;

export const UPDATE_BLOG_POST = gql`
  mutation UpdateBlogPost($id: ID!, $title: String, $content: String, $category: String, $author: String, $excerpt: String, $imageUrl: String, $readTime: String, $status: String) {
    updateBlogPost(id: $id, title: $title, content: $content, category: $category, author: $author, excerpt: $excerpt, imageUrl: $imageUrl, readTime: $readTime, status: $status) {
      post {
        id
        title
      }
    }
  }
`;

export const DELETE_BLOG_POST = gql`
  mutation DeleteBlogPost($id: ID!) {
    deleteBlogPost(id: $id) {
      success
    }
  }
`;
