import { gql } from "@apollo/client";

export const CREATE_ROLE = gql`
  mutation CreateRole($name: String!, $permissions: [String]) {
    createRole(name: $name, permissions: $permissions) {
      role {
        id
        name
        permissions
      }
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UpdateRole($id: ID!, $name: String, $permissions: [String]) {
    updateRole(id: $id, name: $name, permissions: $permissions) {
      role {
        id
        name
        permissions
      }
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id) {
      success
    }
  }
`;
