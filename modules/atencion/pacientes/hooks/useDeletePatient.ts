import { useMutation } from "@apollo/client/react";
import { DELETE_PATIENT } from "@/modules/atencion/pacientes";

export function useDeletePatient(onCompleted?: () => void) {
  const [deleteMutation, { loading: isDeleting }] = useMutation<{
    deletePatient: { success: boolean; message: string };
  }>(DELETE_PATIENT, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const deletePatient = (id: string) => deleteMutation({ variables: { id } });

  return {
    deletePatient,
    isDeleting,
  };
}
