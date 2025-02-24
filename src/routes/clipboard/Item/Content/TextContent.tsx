import { Text } from "@mantine/core";

import { ClipboardText } from "~/features/clipboard";

interface TextContentProps {
  item: ClipboardText;
}

export const TextContent = (props: TextContentProps) => {
  return (
    <Text size={"sm"} lineClamp={3} style={{ wordBreak: "break-all", overflowWrap: "break-word", whiteSpace: "normal" }}>
      { props.item.content }
    </Text>
  );
};
