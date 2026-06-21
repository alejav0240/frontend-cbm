import { gql } from "@apollo/client";

export const OBTENER_GASTOS = gql`
  query ObtenerGastos($status: String, $category: String) {
    expenses(status: $status, category: $category) {
      id
      descripcion: description
      categoria: category
      monto: amount
      fechaGasto: expenseDate
      estado: status
    }
  }
`;
