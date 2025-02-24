import React from "react";

import { ClipboardItemUnion } from "./clipboardTypes";

export interface ClipboardContext {
  items: ClipboardItemUnion[];
  setItems: (items: ClipboardItemUnion[] | ((prev: ClipboardItemUnion[]) => ClipboardItemUnion[])) => void;
}

export const clipboardContext = React.createContext<ClipboardContext>(null as any);
