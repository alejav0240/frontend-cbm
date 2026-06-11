import { gql } from "@apollo/client";

export const OBTENER_PAGOS = gql`
  query ObtenerPagos($patientId: ID, $paymentStatus: String, $search: String, $page: Int, $pageSize: Int) {
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

export const OBTENER_DESCUENTOS = gql`
  query ObtenerDescuentos {
    discounts {
      id
      name
      value
      type
      description
    }
  }
`;
