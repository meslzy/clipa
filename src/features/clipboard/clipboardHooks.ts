import React from "react";

import { clipboardContext } from "./clipboardContext";
import { ClipboardItemUnion } from "./clipboardTypes";

export const useClipboard = () => {
  const clipboard = React.useContext(clipboardContext);

  if (!clipboard) {
    throw new Error("useClipboard must be used within a ClipboardProvider");
  }

  //

  const removeItem = (itemId: string) => {
    clipboard.setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateItem = (id: string, item: ClipboardItemUnion) => {
    clipboard.setItems((prev) => prev.map((prevItem) => {
      if (prevItem.id === id) {
        return item;
      }

      return prevItem;
    }));
  };

  //

  return {
    ...clipboard,
    removeItem,
    updateItem,
  };
};
