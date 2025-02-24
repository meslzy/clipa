import React from "react";

import { Box, Menu, Stack, ActionIcon, ScrollArea } from "@mantine/core";

import { IconTransferVertical } from "@tabler/icons-react";

import { setClipboardCommand } from "~/backend/commands";
import { ClipboardItemUnion } from "~/features/clipboard";

interface TransferProps {
  item: ClipboardItemUnion;
}

export const Transfer = (props: TransferProps) => {
  const { item } = props;

  const [menuOpened, setMenuOpened] = React.useState(false);

  //

  const handleCopy = () => {
    setClipboardCommand(item.kind, item.content);
  };

  //

  return (
    <Menu
      width={160}
      position={"left-start"}
      shadow={"md"}
      withinPortal={false}
      opened={menuOpened}
      withArrow
      onChange={setMenuOpened}
    >
      <Menu.Target>
        <ActionIcon size={"sm"} variant={menuOpened ? "filled" : "default"}>
          <IconTransferVertical size={14}/>
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Box pos={"relative"} style={{ overflow: "hidden" }}>
          <ScrollArea.Autosize scrollbars={"y"} mah={160} type={"never"}>
            <Stack gap={"xs"}>
              <Menu.Label fz={"sm"}>Common</Menu.Label>
              <Menu.Item onClick={handleCopy}>
                Copy
              </Menu.Item>
              <Menu.Item>
                Paste
              </Menu.Item>
            </Stack>
          </ScrollArea.Autosize>
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
};
