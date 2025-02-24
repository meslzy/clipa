import { Text } from "@mantine/core";

import { ClipboardFiles } from "~/features/clipboard";

interface FilesContentProps {
  item: ClipboardFiles;
}

export const FilesContent = (props: FilesContentProps) => {
  const { item } = props;

  return (
    <Text>
      { item.content.length } files
    </Text>
  );
};
