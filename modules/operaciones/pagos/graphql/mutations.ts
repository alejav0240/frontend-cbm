import { gql } from "@apollo/client";

export const CREATE_PAYMENT = gql`
  mutation CreatePayment(
    $patientId: ID!,
    $sessionsCount: Int!,
    $pricePerSession: Float!,
    $amountPaid: Float!,
    $paymentMethod: String!,
    $discountId: ID
  ) {
    createPayment(
      patientId: $patientId,
      sessionsCount: $sessionsCount,
      pricePerSession: $pricePerSession,
      amountPaid: $amountPaid,
      paymentMethod: $paymentMethod,
      discountId: $discountId
    ) {
      payment {
        id
      }
    }
  }
`;

export const UPDATE_PAYMENT = gql`
  mutation UpdatePayment($id: ID!, $amountPaid: Float, $paymentStatus: String) {
    updatePayment(id: $id, amount_paid: $amountPaid, paymentStatus: $paymentStatus) {
      payment {
        id
        amountPaid
        paymentStatus
      }
    }
  }
`;

export const DELETE_PAYMENT = gql`
  mutation DeletePayment($id: ID!) {
    deletePayment(id: $id) {
      success
    }
  }
`;

export const CREATE_DISCOUNT = gql`
    mutation CreateDiscount {
      createDiscount(name: "", type: "", value: 1.5, description: "") {
        discount {
          name
        }
      }
    }
`;

export const UPDATE_DISCOUNT = gql`
    mutation UpdateDiscount {
      updateDiscount(id: "", description: "", name: "", type: "", value: 1.5) {
        discount {
          name
        }
      }
    }
`;

export const DELETE_DISCOUNT = gql`
  mutation DeletePayment($id: ID!) {
    deletePayment(id: $id) {
      success
    }
  }
`;