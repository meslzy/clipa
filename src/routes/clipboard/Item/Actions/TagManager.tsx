import React from "react";

import { Box, Menu, Stack, Button, ActionIcon, ScrollArea } from "@mantine/core";

import { IconPlus } from "@tabler/icons-react";

import { DyIcon } from "~/components/DyIcon";
import { ClipboardItemUnion } from "~/features/clipboard";
import { Tag, useTags } from "~/features/tags";


interface TagManagerProps {
  item: ClipboardItemUnion;
}

export const TagManager = (props: TagManagerProps) => {
  const { item } = props;

  //

  const tags = useTags();

  const [menuOpened, setMenuOpened] = React.useState(false);

  //

  const { predefinedTags, customTags } = React.useMemo(() => {
    return tags.items.reduce<{
      predefinedTags: Tag[];
      customTags: Tag[];
    }>(
      (acc, tag) => {
        if (tag.editable) {
          acc.customTags.push(tag);
        } else {
          acc.predefinedTags.push(tag);
        }
        return acc;
      },
      {
        predefinedTags: [],
        customTags: [],
      },
    );
  }, [tags.items]);

  //

  const handleTagSelect = (tagId: string) => {
    const hasAssociation = tags.hasAssociation(tagId, item.id);

    if (hasAssociation) {
      tags.removeAssociation(tagId, item.id);
    } else {
      tags.addAssociation(tagId, item.id);
    }
  };

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
          <IconPlus size={14}/>
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Box pos={"relative"} style={{ overflow: "hidden" }}>
          <ScrollArea.Autosize scrollbars={"y"} mah={160} type={"never"}>
            <Stack gap={"xs"}>
              <Menu.Label fz={"sm"}>Presets</Menu.Label>
              {
                predefinedTags.map((tag) => (
                  <Button
                    key={tag.id}
                    size={"sm"}
                    variant={tags.hasAssociation(tag.id, item.id) ? "filled" : "default"}
                    leftSection={(
                      <DyIcon
                        icon={tag.icon}
                        size={16}
                      />
                    )}
                    onClick={() => handleTagSelect(tag.id)}
                  >
                    { tag.label }
                  </Button>
                ))
              }
              <Menu.Label display={customTags.length > 0 ? "block" : "none"} fz={"sm"}>Custom</Menu.Label>
              {
                customTags.map((tag) => (
                  <Button
                    key={tag.id}
                    size={"sm"}
                    variant={tags.hasAssociation(tag.id, item.id) ? "filled" : "default"}
                    leftSection={(
                      <DyIcon
                        icon={tag.icon}
                        size={16}
                      />
                    )}
                    onClick={() => handleTagSelect(tag.id)}
                  >
                    { tag.label }
                  </Button>
                ))
              }
            </Stack>
          </ScrollArea.Autosize>
        </Box>
      </Menu.Dropdown>
    </Menu>
  );
};
