import { gql } from "@apollo/client";

export const GET_PATIENTS = gql`
  query GetPatients($status: String, $search: String, $page: Int, $pageSize: Int) {
    patients(status: $status, search: $search, page: $page, pageSize: $pageSize) {
      totalCount
      totalPages
      currentPage
      results {
        id
        databaseId
        fullName
        firstName
        ci
        status
        registrationComplete
        diagnosis
        birthDate
        createdAt
        imageUrl
        tutor {
          id
          firstName
          celular
        }
      }
    }
  }
`;

export const SEARCH_PATIENTS = gql`
  query SearchPatients($search: String) {
    patients(search: $search, pageSize: 10) {
      results {
        id
        fullName
      }
    }
  }
`;

export const GET_GROWTH = gql`
  query GetPatientGrowth {
    patientGrowth {
      month
      total
    }
  }
`;

export const GET_PATIENT_DETAILS = gql`
query GetPatientDetails($id: ID!) {
  patient(id: $id) {
    id
    databaseId
    fullName
    ci
    birthDate
    imageUrl
    notes
    status
    registrationComplete
    diagnosis
    createdAt
    residence
    tutor {
      id
      fullName
      celular
    }
    clinicalNotes {
      id
      category
      content
      createdAt
      __typename
    }
    __typename
    therapeuticSessions {
      __typename
      edges {
        node {
          id
          sessionNumber
          sessionDate
          sessionStatus
          paymentStatusDisplay
          therapist {
            fullName
            __typename
          }
          __typename
          videoUrl
          notes
        }
        __typename
      }
    }
  }
}
`;

export const GET_INSTITUTIONS = gql`
  query GetInstitutions {
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