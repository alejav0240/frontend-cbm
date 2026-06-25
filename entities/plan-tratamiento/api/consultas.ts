import { gql } from "@apollo/client";

export const OBTENER_PLANES_INTERVENCION = gql`
  query ObtenerPlanesIntervencion(
    $patientId: ID
    $search: String
    $page: Int
    $pageSize: Int
  ) {
    interventionPlans(
      patientId: $patientId
      search: $search
      page: $page
      pageSize: $pageSize
    ) {
      results {
        id
        objetivoPrincipal: mainObjective
        fechaInicio: startDate
        fechaFin: endDate
        porcentajeProgreso: progressPercent
        estado: status
        paciente: patient {
          id
          fullName
          __typename
        }
        pasos: steps {
          id
          momento: moment
          duracionMinutos: durationMinutes
          objetivo: objective
          enfoque: focus
          recursosMusicales: musicalResources
          enfasisMusical: musicalEmphasis
          abordaje: approach
          metodoMlt: mltMethod
          indiceOrden: orderIndex
          __typename
        }
        __typename
      }
      totalCount
      totalPages
      currentPage
      __typename
    }
  }
`;
