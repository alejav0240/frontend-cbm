import { gql } from "@apollo/client";

export const GET_MARKETING_CAMPAIGNS = gql`
  query GetMarketingCampaigns($status: String, $platform: String) {
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

export const GET_LEADS = gql`
  query GetLeads($campaignId: ID, $status: String) {
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
