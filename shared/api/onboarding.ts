import { gql } from "@apollo/client";

export const CONSULTA_ONBOARDING_VISTA = gql`
  query OnboardingView($viewKey: String!) {
    onboardingView(viewKey: $viewKey) {
      viewKey
      completedAt
    }
  }
`;

export const MARCAR_ONBOARDING_VISTA = gql`
  mutation MarkOnboardingViewSeen($viewKey: String!) {
    markOnboardingViewSeen(viewKey: $viewKey) {
      onboardingView {
        viewKey
        completedAt
      }
    }
  }
`;
