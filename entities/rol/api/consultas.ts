import { gql } from "@apollo/client";

export const OBTENER_ROLES = gql`
  query ObtenerRoles {
    roles {
      id
      nombre: name
      permisos: permissions
      conteoUsuarios: usersCount
    }
  }
`;
