import React from "react";

import { Box, Stack, ScrollArea } from "@mantine/core";

import Fuse from "fuse.js";

import { isImage, useClipboard } from "~/features/clipboard";
import { useSearch } from "~/features/search";
import { useTags, DEFAULT_TAG } from "~/features/tags";

import { Item } from "./Item";

export const ClipboardComponent = () => {
  const tags = useTags();
  const search = useSearch();
  const clipboard = useClipboard();

  //

  const filterdItems = React.useMemo(() => {
    let items = clipboard.items;

    if (tags.activeTag !== DEFAULT_TAG.id) {
      items = items.filter((item) => tags.hasAssociation(tags.activeTag, item.id));
    }

    if (search.query) {
      const fuse = new Fuse(items, {
        threshold: 0.4,
        ignoreLocation: true,
        shouldSort: true,
        keys: [
          {
            name: "keywords",
            getFn: (item) => item.keywords,
          },
          {
            name: "content",
            getFn: (item) => {
              if (isImage(item)) {
                return "";
              }

              return item.content;
            },
          },
        ],
      });

      const searchResults = fuse.search(search.query);

      items = searchResults.map((result) => result.item);
    }

    return items;
  }, [tags.activeTag, search.query, clipboard.items]);

  //

  return (
    <Box flex={1} pos={"relative"} style={{ overflow: "hidden" }}>
      <ScrollArea scrollbars={"y"} pos={"absolute"} inset={0} type={"never"}>
        <Stack gap={"xs"}>
          {
            filterdItems.map((item) => (
              <Item key={item.id} item={item}/>
            ))
          }
        </Stack>
      </ScrollArea>
    </Box>
  );
};
