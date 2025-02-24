import { invoke } from "@tauri-apps/api/core";

import { ClipboardKind, ClipboardContent } from "~/features/clipboard";

export const setClipboardCommand = (kind: ClipboardKind, content: ClipboardContent) => {
  return invoke<void>("set_clipboard_command", {
    kind,
    content,
  });
};

export const pasteClipboardCommand = (kind: ClipboardKind, content: ClipboardContent) => {
  return invoke<void>("paste_clipboard_command", {
    kind,
    content,
  });
};
