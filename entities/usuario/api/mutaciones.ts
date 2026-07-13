import {gql} from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser(
    $username: String!
    $email: String!
    $password: String!
    $ci: String!
    $firstName: String!
    $lastName: String!
    $celular: String
    $roleId: ID!
  ) {
    createUser(
      username: $username
      email: $email
      password: $password
      ci: $ci
      firstName: $firstName
      lastName: $lastName
      celular: $celular
      roleId: $roleId
    ) {
      user {
        id
        username
        email
      }
      plainPassword
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $firstName: String
    $lastName: String
    $email: String
    $celular: String
    $ci: String
    $visibility: String
    $isActive: Boolean
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      celular: $celular
      ci: $ci
      visibility: $visibility
      isActive: $isActive
    ) {
      user {
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
        isActive
        foto
        cv
        role {
          id
          name
        }
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($newPassword: String!, $oldPassword: String!) {
    changePassword(newPassword: $newPassword, oldPassword: $oldPassword) {
      success
    }
  }
`;

export const DEACTIVATE_USER = gql`
  mutation DeactivateUser($id: ID!) {
    deactivateUser(id: $id) {
      user {
        id
        isActive
      }
    }
  }
`;
