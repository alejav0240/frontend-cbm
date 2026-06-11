import { gql } from "@apollo/client";

export const CREATE_INVENTORY_ITEM = gql`
  mutation CreateInventoryItem($name: String!, $type: String!, $condition: String!, $room: String!, $status: String) {
    createInventoryItem(name: $name, type: $type, condition: $condition, room: $room, status: $status) {
      item {
        id
        name
      }
    }
  }
`;

export const UPDATE_INVENTORY_ITEM = gql`
  mutation UpdateInventoryItem($id: ID!, $name: String, $type: String, $condition: String, $room: String, $status: String) {
    updateInventoryItem(id: $id, name: $name, type: $type, condition: $condition, room: $room, status: $status) {
      item {
        id
        name
      }
    }
  }
`;

export const DELETE_INVENTORY_ITEM = gql`
  mutation DeleteInventoryItem($id: ID!) {
    deleteInventoryItem(id: $id) {
      success
    }
  }
`;