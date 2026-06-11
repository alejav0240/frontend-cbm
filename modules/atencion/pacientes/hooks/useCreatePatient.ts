import { useMutation } from "@apollo/client/react";
import { useEffect } from "react";
import { CREATE_PATIENT } from "@/modules/atencion/pacientes";
import { CreatePatientVars } from "@/modules/atencion/pacientes/types/patient";
import { useLoadingStore, LOADING_KEYS } from "@/shared/store/loadingStore";

const K = LOADING_KEYS.pacientes;

export function useCreatePatient(onCompleted?: () => void) {
  const { start, stop } = useLoadingStore();

  const [addMutation, { loading: isAdding }] = useMutation(CREATE_PATIENT, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  useEffect(() => {
    isAdding ? start(K.create) : stop(K.create);
  }, [isAdding, start, stop]);

  const addPatient = (vars: CreatePatientVars) => addMutation({ variables: vars });

  return {
    addPatient,
    isAdding,
  };
}
