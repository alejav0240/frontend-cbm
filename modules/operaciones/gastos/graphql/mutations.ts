import {gql} from "@apollo/client";

export const CREATE_EXPENSE = gql`
  mutation CreateExpense(
    $description: String!,
    $category: String!,
    $amount: Float!,
    $expenseDate: DateTime!
  ) {
    createExpense(
      description: $description,
      category: $category,
      amount: $amount,
      expenseDate: $expenseDate
    ) {
      expense {
        id
      }
    }
  }
`;

export const UPDATE_EXPENSE_STATUS = gql`
  mutation UpdateExpenseStatus($id: ID!, $status: String!) {
    updateExpenseStatus(id: $id, status: $status) {
      expense {
        id
        status
      }
    }
  }
`;

export const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id) {
      success
    }
  }
`;