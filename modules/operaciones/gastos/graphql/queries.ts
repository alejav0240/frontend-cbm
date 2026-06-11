import { gql } from '@apollo/client';

export const GET_EXPENSES = gql`
  query GetExpenses($status: String, $category: String) {
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