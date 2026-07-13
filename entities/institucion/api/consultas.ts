import { gql } from "@apollo/client";

export const OBTENER_INSTITUCIONES = gql`
  query ObtenerInstituciones {
    institutions {
      id
      nombre: name
      direccion: address
      nombreContacto: contactName
      emailContacto: contactEmail
      telefonoContacto: contactPhone
      grupos: groups {
        id
        nombre: name
      }
    }
  }
`;

export const OBTENER_DETALLE_INSTITUCION = gql`
  query ObtenerDetalleInstitucion($id: ID!) {
    institution(id: $id) {
      id
      nombre: name
      direccion: address
      nombreContacto: contactName
      emailContacto: contactEmail
      telefonoContacto: contactPhone
      grupos: groups {
        id
        nombre: name
        descripcion: description
      }
    }
  }
`;

export const OBTENER_DETALLE_GRUPO = gql`
  query GetGroupDetail($id: ID!) {
    institutionGroup(id: $id) {
      id
      name
      description
      therapeuticSessions {
        id
        sessionNumber
        sessionDate
        sessionStatus
        paymentStatus
        durationMinutes
        therapist {
          fullName
        }
        notes
      }
    }
  }
`;
