import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      refreshToken
    }
  }
`;

export const ME_QUERY = gql`
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