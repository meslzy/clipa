import React from "react";

import { listen } from "@tauri-apps/api/event";

import { key, store } from "~/backend/store";
import { generateId } from "~/utils/id";

import { clipboardContext, ClipboardContext } from "./clipboardContext";
import { ClipboardItem, ClipboardKind, ClipboardItemUnion } from "./clipboardTypes";

export const ClipboardProvider = (props: React.PropsWithChildren) => {
  const mountedRef = React.useRef(false);

  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<ClipboardItemUnion[]>([]);

  //

  const addItem = (item: ClipboardItemUnion) => {
    setItems((prev) => {
      return [item, ...prev];
    });
  };

  //

  const init = async () => {
    if (mountedRef.current) return;

    mountedRef.current = true;

    listen<[string, any]>("clipboard_update", (event) => {
      const [kind, content] = event.payload;

      const common: ClipboardItem = {
        id: generateId(),
        content: content,
        kind: ClipboardKind.Unknown,
        timestamp: Date.now(),
        keywords: [],
      };

      switch (kind) {
        case "text": {
          addItem({
            ...common,
            kind: ClipboardKind.Text,
            content: content,
          });

          break;
        }
        case "image": {
          addItem({
            ...common,
            kind: ClipboardKind.Image,
            content: "data:image/png;base64," + content,
          });

          break;
        }
        case "files": {
          addItem({
            ...common,
            kind: ClipboardKind.Files,
            content: JSON.parse(content),
          });

          break;
        }
      }
    });
  };

  //

  React.useEffect(() => {
    if (loading) return;
    store.set(key.clipboard.items, items);
  }, [items, loading]);

  React.useEffect(() => {
    init();

    store.get<ClipboardItemUnion[]>(key.clipboard.items).then((savedItems) => {
      if (savedItems) {
        setItems(savedItems);
      }

      setLoading(false);
    });
  }, []);

  //

  const context: ClipboardContext = {
    items,
    setItems,
  };

  return (
    <clipboardContext.Provider value={context}>
      { props.children }
    </clipboardContext.Provider>
  );
};
