import { gql } from "@apollo/client";

export const OBTENER_USUARIOS = gql`
  query ObtenerUsuarios(
    $page: Int
    $pageSize: Int
    $search: String
    $roleName: String
    $excludeRole: String
  ) {
    users(
      page: $page
      pageSize: $pageSize
      search: $search
      roleName: $roleName
      excludeRole: $excludeRole
    ) {
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
        rol: role {
          id
          nombre: name
        }
      }
    }
  }
`;

export const BUSCAR_TERAPEUTAS = gql`
  query BuscarTerapeutas(
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
