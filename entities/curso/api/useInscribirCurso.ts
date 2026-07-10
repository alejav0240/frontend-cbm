import { useMutation } from "@apollo/client/react";
import { ENROLL_IN_COURSE } from "./mutaciones";
import { toast } from "sonner";

interface InscribirCursoInput {
  courseId: string | number;
  fullName: string;
  paymentMethod: string;
  amount: number;
  carnet?: string;
}

export function useInscribirCurso() {
  const [inscribir, { loading }] = useMutation(ENROLL_IN_COURSE);

  const inscribirCurso = async (input: InscribirCursoInput) => {
    try {
      await inscribir({
        variables: {
          courseId: input.courseId,
          fullName: input.fullName,
          paymentMethod: input.paymentMethod,
          amount: input.amount,
          carnet: input.carnet,
        },
      });
      toast.success("Estudiante inscrito correctamente");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al inscribir al estudiante";
      toast.error(message);
      throw err;
    }
  };

  return { inscribirCurso, inscribiendo: loading };
}
