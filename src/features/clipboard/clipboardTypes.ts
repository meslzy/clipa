export enum ClipboardKind {
  Unknown = "unknown",
  Text = "text",
  Image = "image",
  Files = "files",
}

export type ClipboardContent = string | string[];

export interface ClipboardItem {
  id: string;
  kind: ClipboardKind;
  timestamp: number;
  keywords: string[];
  content: ClipboardContent;
}

export interface ClipboardText extends ClipboardItem {
  kind: ClipboardKind.Text;
  content: string;
}

export interface ClipboardImage extends ClipboardItem {
  kind: ClipboardKind.Image;
  content: string;
}

export interface ClipboardFiles extends ClipboardItem {
  kind: ClipboardKind.Files;
  content: string[];
}

export type ClipboardItemUnion = (
  | ClipboardText
  | ClipboardImage
  | ClipboardFiles
);
