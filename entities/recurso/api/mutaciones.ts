import {gql} from "@apollo/client";

export const BULK_ADD_SESSION_RESOURCES = gql`
  mutation BulkAddSessionResources($resourceIds: [ID!]!, $sessionId: ID!) {
    bulkAddSessionResources(resourceIds: $resourceIds, sessionId: $sessionId) {
      addedCount
      __typename
    }
  }
`;

export const CREATE_DIGITAL_RESOURCE = gql`
  mutation CreateDigitalResource($title: String!, $type: String!, $url: String!, $category: String) {
    createDigitalResource(title: $title, type: $type, url: $url, category: $category) {
      resource {
        id
        title
      }
    }
  }
`;

export const UPDATE_DIGITAL_RESOURCE = gql`
  mutation UpdateDigitalResource($id: ID!, $title: String, $type: String, $url: String, $category: String) {
    updateDigitalResource(id: $id, title: $title, type: $type, url: $url, category: $category) {
      resource {
        id
        title
      }
    }
  }
`;

export const DELETE_DIGITAL_RESOURCE = gql`
  mutation DeleteDigitalResource($id: ID!) {
    deleteDigitalResource(id: $id) {
      success
    }
  }
`;