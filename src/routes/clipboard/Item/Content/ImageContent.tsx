import { Image } from "@mantine/core";

import { ClipboardImage } from "~/features/clipboard";

interface ImageContentProps {
  item: ClipboardImage;
}

export const ImageContent = (props: ImageContentProps) => {
  return (
    <Image
      alt={props.item.id}
      src={props.item.content}
      height={60}
      width={"fit-content"}
      fit={"contain"}
    />
  );
};
