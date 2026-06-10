import { gql } from "@apollo/client";

/**
 * Mutación para refresh de token
 * Ajusta los campos según la respuesta de tu backend
 */
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken {
    refreshToken {
      payload
      refreshExpiresIn
      # Agrega aquí otros campos que devuelva tu backend:
      # token
      # user { id email }
    }
  }
`;

/**
 * Mutación de login (opcional, para referencia)
 */
export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      payload
      refreshExpiresIn
      user {
        id
        username
        email
        firstName
        lastName
      }
    }
  }
`;

/**
 * Mutación de logout (opcional, si tu backend la requiere)
 */
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;
