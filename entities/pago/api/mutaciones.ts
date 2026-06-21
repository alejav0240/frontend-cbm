import { gql } from "@apollo/client";

export const CREAR_PAGO = gql`
  mutation CrearPago(
    $patientId: ID!
    $sessionsCount: Int!
    $pricePerSession: Float!
    $amountPaid: Float!
    $paymentMethod: String!
    $discountId: ID
  ) {
    createPayment(
      patientId: $patientId
      sessionsCount: $sessionsCount
      pricePerSession: $pricePerSession
      amountPaid: $amountPaid
      paymentMethod: $paymentMethod
      discountId: $discountId
    ) {
      payment {
        id
      }
    }
  }
`;

export const ACTUALIZAR_PAGO = gql`
  mutation ActualizarPago(
    $id: ID!
    $amountPaid: Float
    $paymentStatus: String
  ) {
    updatePayment(
      id: $id
      amountPaid: $amountPaid
      paymentStatus: $paymentStatus
    ) {
      payment {
        id
        amountPaid
        paymentStatus
      }
    }
  }
`;

export const ELIMINAR_PAGO = gql`
  mutation EliminarPago($id: ID!) {
    deletePayment(id: $id) {
      success
    }
  }
`;
