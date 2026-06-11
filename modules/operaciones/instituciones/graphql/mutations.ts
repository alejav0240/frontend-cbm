// Auto-generated Mutations
import { gql } from '@apollo/client';

// --- INSTITUTIONS ---

export const CREATE_INSTITUTION = gql`
  mutation CreateInstitution($name: String!, $contactEmail: String!, $phone: String!) {
    createInstitution(name: $name, contactEmail: $contactEmail, phone: $phone) {
      institution {
        name
      }
    }
  }
`;

export const UPDATE_INSTITUTION = gql`
  mutation UpdateInstitution($id: ID!, $name: String, $contactEmail: String, $phone: String) {
    updateInstitution(id: $id, name: $name, contactEmail: $contactEmail, phone: $phone) {
      institution {
        name
      }
    }
  }
`;

export const DELETE_INSTITUTION = gql`
  mutation DeleteInstitution($id: ID!) {
    deleteInstitution(id: $id) {
      success
    }
  }
`;

// --- INSTITUTION GROUPS ---

export const CREATE_INSTITUTION_GROUP = gql`
  mutation CreateInstitutionGroup($institutionId: ID!, $name: String!) {
    createInstitutionGroup(institutionId: $institutionId, name: $name) {
      group {
        name
      }
    }
  }
`;

export const UPDATE_INSTITUTION_GROUP = gql`
  mutation UpdateInstitutionGroup($id: ID!, $name: String!) {
    updateInstitutionGroup(id: $id, name: $name) {
      group {
        name
      }
    }
  }
`;

export const DELETE_INSTITUTION_GROUP = gql`
  mutation DeleteInstitutionGroup($id: ID!) {
    deleteInstitutionGroup(id: $id) {
      success
    }
  }
`;