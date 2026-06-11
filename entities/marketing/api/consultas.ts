import { gql } from "@apollo/client";

export const OBTENER_CAMPANAS_MARKETING = gql`
  query ObtenerCampanasMarketing($status: String, $platform: String) {
    marketingCampaigns(status: $status, platform: $platform) {
      id
      name
      platform
      status
      budget
      spent
      remainingBudget
      leads {
        id
      }
    }
  }
`;

export const OBTENER_LEADS = gql`
  query ObtenerLeads($campaignId: ID, $status: String) {
    leads(campaignId: $campaignId, status: $status) {
      id
      name
      phone
      email
      status
      createdAt
      campaign {
        id
        name
      }
    }
  }
`;
