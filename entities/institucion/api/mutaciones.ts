import {gql} from "@apollo/client";

export const CREAR_INSTITUCION = gql`
  mutation CrearInstitucion(
    $name: String!
    $contactEmail: String!
    $phone: String!
  ) {
    createInstitution(name: $name, contactEmail: $contactEmail, phone: $phone) {
      institution {
        id
        name
      }
    }
  }
`;

export const ELIMINAR_INSTITUCION = gql`
  mutation EliminarInstitucion($id: ID!) {
    deleteInstitution(id: $id) {
      success
    }
  }
`;

export const CREAR_GRUPO = gql`
  mutation CrearGrupo($institutionId: ID!, $name: String!) {
    createInstitutionGroup(institutionId: $institutionId, name: $name) {
      group {
        name
      }
    }
  }
`;

export const ELIMINAR_GRUPO = gql`
  mutation EliminarGrupo($id: ID!) {
    deleteInstitutionGroup(id: $id) {
      success
    }
  }
`;

export const ACTUALIZAR_INSTITUCION = gql`
  mutation ActualizarInstitucion(
    $contactEmail: String
    $id1: ID!
    $name: String
    $phone: String
  ) {
    updateInstitution(
      id: $id1
      contactEmail: $contactEmail
      name: $name
      phone: $phone
    ) {
      institution {
        name
      }
    }
  }
`;

export const ACTUALIZAR_GRUPO = gql`
  mutation ActualizarGrupo($id: ID!, $name: String) {
    updateInstitutionGroup(id: $id, name: $name) {
      group {
        name
      }
    }
  }
`