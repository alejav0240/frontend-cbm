import { useMutation } from "@apollo/client/react";
import { DELETE_DIGITAL_RESOURCE } from "@/modules/comunidad/recursos/graphql/mutations";

export function useDeleteResource(onCompleted?: () => void) {
  const [deleteResourceMutation, { loading: isDeleting }] = useMutation(DELETE_DIGITAL_RESOURCE, {
    onCompleted: () => {
      if (onCompleted) onCompleted();
    },
  });

  const deleteResource = (id: string | number) => deleteResourceMutation({ variables: { id } });

  return {
    deleteResource,
    isDeleting,
  };
}
