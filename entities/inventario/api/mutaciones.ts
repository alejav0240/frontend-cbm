import {gql} from "@apollo/client";

export const BULK_ADD_SESSION_INVENTORY_ITEMS = gql`
  mutation BulkAddSessionInventoryItems($itemIds: [ID!]!, $sessionId: ID!) {
    bulkAddSessionInventoryItems(itemIds: $itemIds, sessionId: $sessionId) {
      addedCount
      __typename
    }
  }
`;
