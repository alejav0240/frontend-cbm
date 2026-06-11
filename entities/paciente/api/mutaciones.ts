import { gql } from "@apollo/client";

export const CREAR_PACIENTE = gql`
  mutation CrearPaciente(
    $authorId: ID!
    $firstName: String!
    $lastName: String!
    $birthDate: Date
    $ci: String
    $imageUrl: String
    $diagnosis: String
    $notes: String
    $residence: String
    $tutorCelular: String
    $tutorCi: String
    $tutorEmail: String
    $tutorName: String
    $selectedDay: String
    $selectedTime: String
  ) {
    createPatient(
      authorId: $authorId
      firstName: $firstName
      lastName: $lastName
      birthDate: $birthDate
      ci: $ci
      imageUrl: $imageUrl
      diagnosis: $diagnosis
      notes: $notes
      residence: $residence
      tutorCelular: $tutorCelular
      tutorCi: $tutorCi
      tutorEmail: $tutorEmail
      tutorName: $tutorName
      selectedDay: $selectedDay
      selectedTime: $selectedTime
    ) {
      patient {
        id
        fullName
        databaseId
      }
    }
  }
`;

export const ACTUALIZAR_PACIENTE = gql`
  mutation ActualizarPaciente(
    $id: ID!
    $imageUrl: String
    $residence: String
    $diagnosis: String
    $registrationComplete: Boolean
  ) {
    updatePatient(
      id: $id
      imageUrl: $imageUrl
      residence: $residence
      diagnosis: $diagnosis
      registrationComplete: $registrationComplete
    ) {
      patient {
        id
        registrationComplete
        status
      }
    }
  }
`;

export const ELIMINAR_PACIENTE = gql`
  mutation EliminarPaciente($id: ID!) {
    deletePatient(id: $id) {
      success
      message
    }
  }
`;
