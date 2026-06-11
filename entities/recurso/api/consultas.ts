import { gql } from "@apollo/client";

export const OBTENER_RECURSOS_DIGITALES = gql`
  query ObtenerRecursosDigitales($type: String, $search: String, $page: Int, $pageSize: Int) {
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
