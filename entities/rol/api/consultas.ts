import { gql } from "@apollo/client";

export const OBTENER_ROLES = gql`
  query ObtenerRoles($page: Int, $pageSize: Int) {
    roles(page: $page, pageSize: $pageSize) {
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
