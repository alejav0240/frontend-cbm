import { gql } from "@apollo/client";

export const CREATE_PATIENT = gql`
  mutation CreatePatient(
    $authorId: ID!,
    $firstName: String!, 
    $lastName: String!, 
    $birthDate: Date, 
    $ci: String, 
    $imageUrl: String, 
    $diagnosis: String, 
    $notes: String, 
    $residence: String, 
    $tutorCelular: String, 
    $tutorCi: String, 
    $tutorEmail: String, 
    $tutorName: String,
    $selectedDay: String,
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

export const UPDATE_PATIENT = gql`
  mutation UpdatePatient(
    $id: ID!, 
    $imageUrl: String, 
    $residence: String, 
    $diagnosis: String, 
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

export const UPDATE_CLINICAL_NOTES = gql`
  mutation UpdateClinicalNotes(
    $patientId: ID!, 
    $authorId: ID!, 
    $notes: [BasicNote]!
  ) {
    updateClinicalNotes(
      patientId: $patientId
      authorId: $authorId
      notes: $notes
    ) {
      notesUpdated {
        id
        category
        content
      }
    }
  }
`;

export const DELETE_PATIENT = gql`
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id) {
      success
      message
    }
  }
`;

export const CREATE_PATIENT_WITH_TUTOR = gql`
  mutation CreatePatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      patient {
        id
        fullName
      }
    }
  }
`;
