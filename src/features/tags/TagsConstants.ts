import { IconTag, IconHeart, IconHistory } from "@tabler/icons-react";

import { Tag } from "./tagsTypes";

export const DEFAULT_TAG: Tag = {
  id: "all",
  label: "All",
  icon: IconHistory.displayName!,
  editable: false,
};

export const FAVORITE_TAG: Tag = {
  id: "favorites",
  label: "Favorites",
  icon: IconHeart.displayName!,
  editable: false,
};

export const FREQUENT_TAG: Tag = {
  id: "frequent",
  label: "Frequent",
  icon: IconHistory.displayName!,
  editable: false,
};

export const PREDEFINED_TAGS: Tag[] = [
  FAVORITE_TAG,
  FREQUENT_TAG,
];

export const DEFAULT_TAG_ICON = IconTag.displayName!;
