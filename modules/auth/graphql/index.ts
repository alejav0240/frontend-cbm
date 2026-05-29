import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation TokenAuth($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password) {
      token
      refreshToken
      user {
        id
        databaseId
        username
        email
        firstName
        lastName
        isStaff
        foto
        modules
      }
    }
  }
`;