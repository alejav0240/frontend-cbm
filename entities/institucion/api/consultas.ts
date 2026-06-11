import { gql } from "@apollo/client";

export const OBTENER_INSTITUCIONES = gql`
  query ObtenerInstituciones {
    institutions {
      id
      name
      address
      contactName
      contactEmail
      contactPhone
      groups {
        id
        name
      }
    }
  }
`;

export const OBTENER_DETALLE_INSTITUCION = gql`
  query ObtenerDetalleInstitucion($id: ID!) {
    institution(id: $id) {
      id
      name
      address
      contactName
      contactEmail
      contactPhone
      groups {
        id
        name
        description
      }
    }
  }
`;
