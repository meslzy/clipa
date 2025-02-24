import { ActionIcon } from "@mantine/core";

import { IconX } from "@tabler/icons-react";

import { useClipboard, ClipboardItemUnion } from "~/features/clipboard";
import { useTags } from "~/features/tags";


interface DeleteProps {
  item: ClipboardItemUnion;
}

export const Delete = (props: DeleteProps) => {
  const { item } = props;

  //

  const clipboard = useClipboard();
  const tags = useTags();

  //

  const handleDelete = () => {
    clipboard.removeItem(item.id);
    tags.removeAssociations(item.id);
  };

  //

  return (
    <ActionIcon size={"sm"} variant={"default"} onClick={handleDelete}>
      <IconX size={14}/>
    </ActionIcon>
  );
};
