import { gql } from "@apollo/client";

export const OBTENER_ROLES = gql`
  query ObtenerRoles {
    roles {
      id
      name
      permissions
      usersCount
    }
  }
`;
