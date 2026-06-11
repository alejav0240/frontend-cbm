import { gql } from "@apollo/client";

export const INICIO_SESION_MUTACION = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      refreshToken
    }
  }
`;

export const CONSULTA_YO = gql`
  query Me {
    me {
      id
      databaseId
      username
      email
      firstName
      lastName
      fullName
      ci
      celular
      status
      visibility
      isStaff
      foto
      cv
      modules
      role {
        id
        name
      }
    }
  }
`;
