import {gql} from "@apollo/client";

export const BULK_ADD_SESSION_RESOURCES = gql`
  mutation BulkAddSessionResources($resourceIds: [ID!]!, $sessionId: ID!) {
    bulkAddSessionResources(resourceIds: $resourceIds, sessionId: $sessionId) {
      addedCount
      __typename
    }
  }
`;
