import { gql } from "@apollo/client";

export const OBTENER_CAMPANAS_MARKETING = gql`
  query ObtenerCampanasMarketing(
    $status: String
    $platform: String
    $page: Int
    $pageSize: Int
  ) {
    marketingCampaigns(
      status: $status
      platform: $platform
      page: $page
      pageSize: $pageSize
    ) {
      results {
        id
        nombre: name
        plataforma: platform
        estado: status
        presupuesto: budget
        gastado: spent
        presupuestoRestante: remainingBudget
        leads {
          id
        }
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;

export const OBTENER_LEADS = gql`
  query ObtenerLeads(
    $campaignId: ID
    $status: String
    $page: Int
    $pageSize: Int
  ) {
    leads(
      campaignId: $campaignId
      status: $status
      page: $page
      pageSize: $pageSize
    ) {
      results {
        id
        nombre: name
        telefono: phone
        email
        estado: status
        fechaCreacion: createdAt
        campana: campaign {
          id
          nombre: name
        }
      }
      totalCount
      totalPages
      currentPage
    }
  }
`;
