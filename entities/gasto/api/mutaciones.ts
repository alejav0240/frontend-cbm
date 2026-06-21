import { gql } from "@apollo/client";

export const CREAR_GASTO = gql`
  mutation CrearGasto(
    $description: String!
    $category: String!
    $amount: Float!
    $expenseDate: DateTime!
  ) {
    createExpense(
      description: $description
      category: $category
      amount: $amount
      expenseDate: $expenseDate
    ) {
      expense {
        id
      }
    }
  }
`;

export const ACTUALIZAR_ESTADO_GASTO = gql`
  mutation ActualizarEstadoGasto($id: ID!, $status: String!) {
    updateExpenseStatus(id: $id, status: $status) {
      expense {
        id
        status
      }
    }
  }
`;

export const ELIMINAR_GASTO = gql`
  mutation EliminarGasto($id: ID!) {
    deleteExpense(id: $id) {
      success
    }
  }
`;
