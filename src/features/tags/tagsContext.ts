import React from "react";

import { Tag, TagAssociation } from "./tagsTypes";

export interface TagsContext {
  items: Tag[];
  setItems: (items: Tag[] | ((prev: Tag[]) => Tag[])) => void;
  //
  associations: TagAssociation[];
  setAssociations: (associations: TagAssociation[] | ((prev: TagAssociation[]) => TagAssociation[])) => void;
  //
  activeTag: string;
  setActiveTag: (tagId: string) => void;
}

export const tagsContext = React.createContext<TagsContext>(null as any);
