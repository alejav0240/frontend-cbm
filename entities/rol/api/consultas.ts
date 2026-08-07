import { gql } from "@apollo/client";

export const OBTENER_ROLES = gql`
  query ObtenerRoles($page: Int, $pageSize: Int, $search: String) {
    roles(page: $page, pageSize: $pageSize, search: $search) {
      results {
        id
        nombre: name
        permisos: permissions
        conteoUsuarios: usersCount
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;
