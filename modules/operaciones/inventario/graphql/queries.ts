import { gql } from "@apollo/client";

export const GET_INVENTORY_ITEMS = gql`
  query GetInventoryItems($status: String, $type: String) {
    inventoryItems(status: $status, type: $type) {
      id
      name
      type
      condition
      status
      room
      statusDisplay
    }
  }
`;