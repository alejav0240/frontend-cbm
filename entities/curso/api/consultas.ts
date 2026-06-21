import { gql } from "@apollo/client";

export const OBTENER_CURSOS = gql`
  query ObtenerCursos($state: String) {
    courses(state: $state) {
      id
      nombre: name
      descripcion: description
      precio: price
      estado: state
      conteoEstudiantes: studentsCount
      ingresosTotales: totalIncome
    }
  }
`;

export const OBTENER_INSCRIPCIONES_CURSO = gql`
  query ObtenerInscripcionesCurso($courseId: ID) {
    courseEnrollments(courseId: $courseId) {
      id
      nombreCompleto: fullName
      carnet
      fechaInscripcion: enrolledAt
      pago: payment {
        id
        monto: amount
        metodoPago: paymentMethod
        estadoPago: paymentStatus
      }
    }
  }
`;
