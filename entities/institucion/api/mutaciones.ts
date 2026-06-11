import { gql } from "@apollo/client";

export const CREAR_INSTITUCION = gql`
  mutation CrearInstitucion($name: String!, $contactEmail: String!, $phone: String!) {
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
