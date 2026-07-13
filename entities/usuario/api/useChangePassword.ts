import { useMutation } from "@apollo/client/react";
import { CHANGE_PASSWORD } from "./mutaciones";

interface ChangePasswordVariables {
  oldPassword: string;
  newPassword: string;
}

export function useChangePassword() {
  const [cambiarPasswordMutation, { loading, error }] =
    useMutation(CHANGE_PASSWORD);

  const cambiarPassword = (variables: ChangePasswordVariables) =>
    cambiarPasswordMutation({ variables });

  return { cambiarPassword, loading, error };
}
