import { gql } from "@apollo/client";

export const OBTENER_ARTICULOS_INVENTARIO = gql`
  query ObtenerArticulosInventario(
    $status: String
    $type: String
    $page: Int
    $pageSize: Int
  ) {
    inventoryItems(
      status: $status
      type: $type
      page: $page
      pageSize: $pageSize
    ) {
      results {
        id
        nombre: name
        tipo: type
        condicion: condition
        estado: status
        aula: room
        estadoMostrado: statusDisplay
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;
