import { gql } from "@apollo/client";

export const OBTENER_ARTICULOS_INVENTARIO = gql`
  query ObtenerArticulosInventario($status: String, $type: String) {
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
