import { gql } from "@apollo/client";

export const GET_DIGITAL_RESOURCES = gql`
  query GetDigitalResources($type: String, $search: String, $page: Int, $pageSize: Int) {
    digitalResources(type: $type, search: $search, page: $page, pageSize: $pageSize) {
      results {
        id
        title
        type
        category
        url
        typeDisplay
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;
