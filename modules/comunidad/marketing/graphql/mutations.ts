import { gql } from "@apollo/client";

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign($name: String!, $platform: String!, $budget: Float!, $status: String) {
    createCampaign(name: $name, platform: $platform, budget: $budget, status: $status) {
      campaign {
        id
      }
    }
  }
`;

export const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign($id: ID!, $name: String, $platform: String, $budget: Float, $status: String) {
    updateCampaign(id: $id, name: $name, platform: $platform, budget: $budget, status: $status) {
      campaign {
        id
      }
    }
  }
`;

export const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($id: ID!) {
    deleteCampaign(id: $id) {
      success
    }
  }
`;

export const CREATE_LEAD = gql`
  mutation CreateLead($name: String!, $phone: String, $email: String, $campaignId: ID) {
    createLead(name: $name, phone: $phone, email: $email, campaignId: $campaignId) {
      lead {
        id
      }
    }
  }
`;

export const UPDATE_LEAD_STATUS = gql`
  mutation UpdateLeadStatus($id: ID!, $status: String!) {
    updateLeadStatus(id: $id, status: $status) {
      lead {
        id
        status
      }
    }
  }
`;

export const DELETE_LEAD = gql`
  mutation DeleteLead($id: ID!) {
    deleteLead(id: $id) {
      success
    }
  }
`;
