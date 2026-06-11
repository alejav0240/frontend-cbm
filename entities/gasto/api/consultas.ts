import { gql } from "@apollo/client";

export const OBTENER_GASTOS = gql`
  query ObtenerGastos($status: String, $category: String) {
    expenses(status: $status, category: $category) {
      id
      description
      category
      amount
      expenseDate
      status
    }
  }
`;
