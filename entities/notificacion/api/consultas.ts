import { gql } from "@apollo/client";

export const MIS_NOTIFICACIONES = gql`
  query MisNotificaciones($isRead: Boolean) {
    notifications(isRead: $isRead) {
      id
      message
      tipo
      metadatos
      isRead
      createdAt
    }
  }
`;

export const CONTAR_NO_LEIDAS = gql`
  query ContarNoLeidas {
    unreadNotificationsCount
  }
`;

export const MARCAR_NOTIFICACION_LEIDA = gql`
  mutation MarcarNotificacionLeida($id: ID!) {
    markNotificationRead(id: $id) {
      notification {
        id
        isRead
      }
    }
  }
`;
