import { gql } from "@apollo/client";

export const OBTENER_CAMPANAS_MARKETING = gql`
  query ObtenerCampanasMarketing($status: String, $platform: String) {
    marketingCampaigns(status: $status, platform: $platform) {
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
  }
`;

export const OBTENER_LEADS = gql`
  query ObtenerLeads($campaignId: ID, $status: String) {
    leads(campaignId: $campaignId, status: $status) {
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
  }
`;
