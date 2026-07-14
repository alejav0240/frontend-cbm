import { gql } from "@apollo/client";

export const OBTENER_GASTOS = gql`
  query ObtenerGastos(
    $status: String
    $category: String
    $page: Int
    $pageSize: Int
    $search: String
  ) {
    expenses(
      status: $status
      category: $category
      page: $page
      pageSize: $pageSize
      search: $search
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
