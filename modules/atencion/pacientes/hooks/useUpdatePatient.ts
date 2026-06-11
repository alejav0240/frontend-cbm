import { useMutation } from "@apollo/client/react";
import { UPDATE_PATIENT, UPDATE_CLINICAL_NOTES } from "@/modules/atencion/pacientes";
import { UpdatePatientVars, UpdateClinicalNotesVars } from "@/modules/atencion/pacientes/types/patient";

export function useUpdatePatient(onCompleted?: () => void) {
  const [updateMutation, { loading: isUpdating }] = useMutation(UPDATE_PATIENT, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const [updateNotesMutation, { loading: isUpdatingNotes }] = useMutation(UPDATE_CLINICAL_NOTES, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const updatePatient = (vars: UpdatePatientVars) => updateMutation({ variables: vars });
  const updateClinicalNotes = (vars: UpdateClinicalNotesVars) => updateNotesMutation({ variables: vars });

  return {
    updatePatient,
    updateClinicalNotes,
    isUpdating,
    isUpdatingNotes,
  };
}
