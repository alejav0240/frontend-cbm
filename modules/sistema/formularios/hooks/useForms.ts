import { useSuspenseQuery } from "@apollo/client/react";
import { GET_FORMS, GET_FORM_ASSIGNMENTS } from "@/modules/sistema/formularios/graphql/queries";
import { FormAsignment, FormDataResponse, FormFilter } from "@/modules/sistema/formularios/types";

interface Props {
  filters: FormFilter;
}

export function useForms({ filters }: Props) {
  const { data: formsData, refetch: refetchForms } = useSuspenseQuery<FormDataResponse>(GET_FORMS);

  const { data: assignmentsData, refetch: refetchAssignments } = useSuspenseQuery<FormAsignment>(GET_FORM_ASSIGNMENTS, {
    variables: {
      search: filters.search,
    },
  });

  return {
    forms: formsData?.forms ?? [],
    assignments: assignmentsData?.formAssignments ?? [], // Added for completeness based on useSuspenseQuery
    refetchForms,
    refetchAssignments,
  };
}
