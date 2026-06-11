import { useMutation } from "@apollo/client/react";
import { UPDATE_DIGITAL_RESOURCE } from "@/modules/comunidad/recursos/graphql/mutations";
import { UpdateDigitalResourceInput } from "@/modules/comunidad/recursos/schemas";

export function useUpdateResource(onCompleted?: () => void) {
  const [updateResourceMutation, { loading: isUpdating }] = useMutation(UPDATE_DIGITAL_RESOURCE, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const updateResource = (variables: UpdateDigitalResourceInput) => updateResourceMutation({ variables });

  return {
    updateResource,
    isUpdating,
  };
}
