import { Box, Text, Group, Paper, Stack, useMantineTheme, MantineStyleProp } from "@mantine/core";

import { DyIcon } from "~/components/DyIcon";
import { ClipboardKind, ClipboardItemUnion } from "~/features/clipboard";
import { useTags } from "~/features/tags";
import { readbleDate } from "~/utils/date";

import { Delete, Transfer, TagManager } from "./Actions";
import { TextContent, FilesContent, ImageContent } from "./Content";


interface ItemProps {
  item: ClipboardItemUnion;
}

export const Item = (props: ItemProps) => {
  const { item } = props;

  const theme = useMantineTheme();
  const tags = useTags();

  //

  const getBorderColor = (kind: ClipboardItemUnion["kind"]) => {
    switch (kind) {
      case ClipboardKind.Text: {
        return theme.colors.red[7];
      }
      case ClipboardKind.Image: {
        return theme.colors.green[7];
      }
      case ClipboardKind.Files: {
        return theme.colors.yellow[7];
      }
    }
  };

  const paperStyles: MantineStyleProp = () => ({
    borderLeft: `4px solid ${getBorderColor(item.kind)}`,
  });

  //

  const renderContent = () => {
    switch (item.kind) {
      case ClipboardKind.Text: {
        return <TextContent item={item}/>;
      }
      case ClipboardKind.Image: {
        return <ImageContent item={item}/>;
      }
      case ClipboardKind.Files: {
        return <FilesContent item={item}/>;
      }
    }
  };

  return (
    <Paper component={Group} style={paperStyles} pos={"relative"} p={"xs"} shadow={"sm"} withBorder>
      <Stack ml={"sm"} pos={"relative"} flex={1} gap={"sm"}>
        <Box
          children={renderContent()}
          display={"flex"} h={46}
          w={"100%"}
          style={{ overflow: "hidden" }}
        />
        <Group justify={"space-between"}>
          <Group flex={1} gap={"xs"} wrap={"nowrap"}>
            {
              tags.getItemTags(item.id).map((tag) => (
                <DyIcon
                  key={tag.id}
                  icon={tag.icon}
                  size={14}
                />
              ))
            }
          </Group>
          <Text size={"xs"}>
            { readbleDate(item.timestamp) }
          </Text>
        </Group>
      </Stack>
      <Stack gap={"xs"}>
        <Transfer item={item}/>
        <TagManager item={item}/>
        <Delete item={item}/>
      </Stack>
    </Paper>
  );
};
