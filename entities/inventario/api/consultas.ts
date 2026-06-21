import { gql } from "@apollo/client";

export const OBTENER_ARTICULOS_INVENTARIO = gql`
  query ObtenerArticulosInventario($status: String, $type: String) {
    inventoryItems(status: $status, type: $type) {
      id
      nombre: name
      tipo: type
      condicion: condition
      estado: status
      aula: room
      estadoMostrado: statusDisplay
    }
  }
`;
