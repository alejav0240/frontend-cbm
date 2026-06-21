import {useMutation} from "@apollo/client/react";
import {ACTUALIZAR_NOTAS_CLINICAS, usePacientes} from "@/entities/paciente";
import {FormularioClinicoDataSchema} from "@/features/gestion-paciente/model/FormularioClinicoData.schema";
import {
    UpdateClinicalNotesMutation,
    UpdateClinicalNotesMutationVariables,
    ClinicalPatientClinicalNoteCategoryChoices,
} from "@/shared/api/generated/graphql";

export function useActualizarNotasClinicas() {
    const {refetch} = usePacientes();

    const [updateNotesMutation, {loading}] = useMutation<
        UpdateClinicalNotesMutation,
        UpdateClinicalNotesMutationVariables
    >(ACTUALIZAR_NOTAS_CLINICAS, {
        // Se ejecuta automáticamente al terminar la mutación con éxito
        onCompleted: () => refetch(),
    });

    const updateClinicalNotes = (
        patientId: string,
        authorId: string,
        data: FormularioClinicoDataSchema,
    ) => {
        const notes = [
            {
                category:
                    "GENERAL_OBJECTIVE" as ClinicalPatientClinicalNoteCategoryChoices,
                content: data.objetivosGenerales,
            },
            {
                category: "PHYSICAL_AREA" as ClinicalPatientClinicalNoteCategoryChoices,
                content: data.fisico,
            },
            {
                category:
                    "EMOTIONAL_AREA" as ClinicalPatientClinicalNoteCategoryChoices,
                content: data.emocional,
            },
            {
                category:
                    "COGNITIVE_AREA" as ClinicalPatientClinicalNoteCategoryChoices,
                content: data.cognitivo,
            },
            {
                category: "SOCIAL_AREA" as ClinicalPatientClinicalNoteCategoryChoices,
                content: data.social,
            },
            {
                category: "METHODS" as ClinicalPatientClinicalNoteCategoryChoices,
                content: data.metodosAUsar,
            },
            {
                category:
                    "ADDITIONAL_NOTES" as ClinicalPatientClinicalNoteCategoryChoices,
                content: data.notas || "",
            },
        ];

        return updateNotesMutation({
            variables: {
                patientId,
                authorId,
                notes,
            },
        });
    };

    return {
        updateClinicalNotes,
        loading,
        refetch, // <-- Agregado para permitir ejecuciones manuales desde la UI
    };
}