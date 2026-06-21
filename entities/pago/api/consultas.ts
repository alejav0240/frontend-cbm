import { gql } from "@apollo/client";

export const OBTENER_PAGOS = gql`
  query ObtenerPagos(
    $patientId: ID
    $paymentStatus: String
    $search: String
    $page: Int
    $pageSize: Int
  ) {
    payments(
      patientId: $patientId
      paymentStatus: $paymentStatus
      search: $search
      page: $page
      pageSize: $pageSize
    ) {
      objects {
        id
        cantidadSesiones: sessionsCount
        precioPorSesion: pricePerSession
        montoPagado: amountPaid
        montoTotal: totalAmount
        deuda: debt
        metodoPago: paymentMethod
        fechaPago: paymentDate
        estadoPago: paymentStatus
        paciente: patient {
          id
          fullName
        }
        descuento: discount {
          id
          nombre: name
          valor: value
          tipo: type
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
      nombre: name
      valor: value
      tipo: type
      descripcion: description
    }
  }
`;
