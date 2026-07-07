import { useMutation } from "@apollo/client/react";
import { CREAR_GASTO } from "./mutaciones";
import {
  CrearGastoMutation,
  CrearGastoMutationVariables,
} from "@/shared/api/generated/graphql";
import { toast } from "sonner";

interface CrearGastoInput {
  description: string;
  category: string;
  amount: number;
  expenseDate: string;
}

export function useCrearGasto() {
  const [crear, { loading }] = useMutation<
    CrearGastoMutation,
    CrearGastoMutationVariables
  >(CREAR_GASTO);

  const crearGasto = async (input: CrearGastoInput) => {
    try {
      const result = await crear({
        variables: {
          description: input.description,
          category: input.category,
          amount: input.amount,
          expenseDate: input.expenseDate,
        },
      });
      toast.success("Gasto registrado correctamente");
      return result.data?.createExpense?.expense;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al registrar el gasto";
      toast.error(message);
      throw err;
    }
  };

  return { crearGasto, creando: loading };
}
