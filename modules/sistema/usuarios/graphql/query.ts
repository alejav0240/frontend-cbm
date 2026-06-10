import {gql} from "@apollo/client";

export const GET_THERAPISTS_SEARCH = gql`
  query GetTherapists($search: String, $pageSize: Int = 100) {
    users(search: $search, roleName: "TERAPEUTA", pageSize: $pageSize) {
      results {
        id
        fullName
      }
    }
  }
`;