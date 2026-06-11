import { gql } from "@apollo/client";

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

export const GET_INSTITUTION_DETAIL = gql`
  query GetInstitutionDetail($id: ID!) {
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

export const GET_GROUP_DETAIL = gql`
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
