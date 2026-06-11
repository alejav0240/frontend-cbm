import { gql } from "@apollo/client";

export const OBTENER_CURSOS = gql`
  query ObtenerCursos($state: String) {
    courses(state: $state) {
      id
      name
      description
      price
      state
      studentsCount
      totalIncome
    }
  }
`;

export const OBTENER_INSCRIPCIONES_CURSO = gql`
  query ObtenerInscripcionesCurso($courseId: ID) {
    courseEnrollments(courseId: $courseId) {
      id
      fullName
      carnet
      enrolledAt
      payment {
        id
        amount
        paymentMethod
        paymentStatus
      }
    }
  }
`;
