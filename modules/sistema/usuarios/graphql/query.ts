import { gql } from "@apollo/client";

export const GET_THERAPISTS_SEARCH = gql`
  query GetTherapists(
    $search: String
    $pageSize: Int
    $roleName: String 
    $excludeRole: String
    $page: Int 
  ) {
    users(
      search: $search
      roleName: $roleName
      pageSize: $pageSize
      excludeRole: $excludeRole
      page: $page
    ) {
      results {
        id
        fullName
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers($page: Int, $pageSize: Int, $search: String, $roleName: String, $excludeRole: String) {
    users(page: $page, pageSize: $pageSize, search: $search, roleName: $roleName, excludeRole: $excludeRole) {
      __typename
      currentPage
      totalPages
      totalCount
      results {
        id
        username
        email
        fullName
        isStaff
        isActive
        celular
        status
        foto
        ci
        role {
          id
          name
        }
      }
    }
  }
`;