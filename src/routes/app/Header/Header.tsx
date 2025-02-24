import { Group, Image, Stack, Divider, Tooltip, ActionIcon } from "@mantine/core";

import { IconUser, IconClearAll } from "@tabler/icons-react";

import { useClipboard } from "~/features/clipboard";
import { useTags } from "~/features/tags";

export const Header = () => {
  const tags = useTags();
  const clipboard = useClipboard();

  const handleClearAll = () => {
    clipboard.setItems((items) => items.filter((item) => {
      return tags.associations.some((tag) => tag.itemId === item.id);
    }));
  };

  return (
    <Stack align={"center"} justify={"center"} component={"header"} p={"sm"}>
      <Group w={"100%"} justify={"space-between"} data-tauri-drag-region>
        <Tooltip color={"dark.5"} label={"Clear"} position={"right"}>
          <ActionIcon variant={"default"} onClick={handleClearAll}>
            <IconClearAll size={18}/>
          </ActionIcon>
        </Tooltip>
        <Image
          w={26}
          src={"./logo.svg"}
          draggable={false}
          data-tauri-drag-region
        />
        <Tooltip color={"dark.5"} label={"Account"} position={"left"}>
          <ActionIcon variant={"default"} onClick={handleClearAll}>
            <IconUser size={18}/>
          </ActionIcon>
        </Tooltip>
      </Group>
      <Divider
        orientation={"horizontal"}
        w={"100%"}
      />
    </Stack>
  );
};
