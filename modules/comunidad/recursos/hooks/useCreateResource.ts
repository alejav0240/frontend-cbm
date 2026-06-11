import { useMutation } from "@apollo/client/react";
import { CREATE_DIGITAL_RESOURCE } from "@/modules/comunidad/recursos/graphql/mutations";
import { CreateDigitalResourceInput } from "@/modules/comunidad/recursos/schemas";

export function useCreateResource(onCompleted?: () => void) {
  const [createResourceMutation, { loading: isCreating }] = useMutation(CREATE_DIGITAL_RESOURCE, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const createResource = (variables: CreateDigitalResourceInput) => createResourceMutation({ variables });

  return {
    createResource,
    isCreating,
  };
}
