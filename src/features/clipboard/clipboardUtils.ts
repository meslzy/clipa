import { ClipboardKind, ClipboardText, ClipboardFiles, ClipboardImage, ClipboardItemUnion } from "./clipboardTypes";

export const isText = (item: ClipboardItemUnion): item is ClipboardText => {
  return item.kind === ClipboardKind.Text;
};

export const isImage = (item: ClipboardItemUnion): item is ClipboardImage => {
  return item.kind === ClipboardKind.Image;
};

export const isFiles = (item: ClipboardItemUnion): item is ClipboardFiles => {
  return item.kind === ClipboardKind.Files;
};
