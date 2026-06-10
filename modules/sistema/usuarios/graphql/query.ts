import { gql } from "@apollo/client";

export const GET_THERAPISTS_SEARCH = gql`
  query GetTherapists(
    $search: String
    $pageSize: Int = 50
    $roleName: String = "TERAPEUTA"
    $excludeRole: String = ""
    $page: Int = 1
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
