import { gql } from "@apollo/client";

export const OBTENER_ESCALAS = gql`
  query ObtenerEscalas {
    scales {
      results {
        id
        nombre: name
        descripcion: description
        tipoEscala: scaleType
        subescalas: subscales {
          id
          nombre: name
          valorMaximo: maxValue
        }
        valores: values {
          id
          etiqueta: label
          valor: value
        }
      }
    }
  }
`;

export const OBTENER_EVALUACIONES = gql`
  query ObtenerEvaluaciones(
    $patientId: ID
    $scaleId: ID
    $page: Int
    $pageSize: Int
    $search: String
  ) {
    scaleEvaluations(
      patientId: $patientId
      inSession: false
      scaleId: $scaleId
      page: $page
      pageSize: $pageSize
      search: $search
    ) {
      currentPage
      totalCount
      totalPages
      results {
        id
        fechaEvaluacion: evaluatedAt
        puntajeTotal: totalScore
        paciente: patient {
          id
          fullName
        }
        escala: scale {
          id
          nombre: name
        }
        respuestasSubescala: subscaleResponses {
          id
          puntaje: score
          subescala: subscale {
            id
            nombre: name
          }
        }
      }
    }
  }
`;
