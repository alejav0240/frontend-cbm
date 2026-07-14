import { gql } from "@apollo/client";

export const OBTENER_GASTOS = gql`
  query ObtenerGastos(
    $status: String
    $category: String
    $page: Int
    $pageSize: Int
  ) {
    expenses(
      status: $status
      category: $category
      page: $page
      pageSize: $pageSize
    ) {
      results {
        id
        descripcion: description
        categoria: category
        monto: amount
        fechaGasto: expenseDate
        estado: status
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;
