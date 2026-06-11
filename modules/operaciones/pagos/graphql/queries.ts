import { gql } from '@apollo/client';

export const GET_PAYMENTS = gql`
  query GetPayments($patientId: ID, $paymentStatus: String, $search: String, $page: Int, $pageSize: Int) {
    payments(patientId: $patientId, paymentStatus: $paymentStatus, search: $search, page: $page, pageSize: $pageSize) {
      objects {
        id
        sessionsCount
        pricePerSession
        amountPaid
        totalAmount
        debt
        paymentMethod
        paymentDate
        paymentStatus
        patient {
          id
          fullName
        }
        discount {
          id
          name
          value
          type
        }
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;

export const GET_DISCOUNTS = gql`
  query GetDiscounts {
    discounts {
      id
      name
      value
      type
      description
    }
  }
`;
