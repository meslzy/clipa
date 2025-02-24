import React from "react";

import { key, store } from "~/backend/store";

import { DEFAULT_TAG, PREDEFINED_TAGS } from "./TagsConstants";
import { tagsContext, TagsContext } from "./tagsContext";
import { Tag, TagAssociation } from "./tagsTypes";

export const TagsProvider = (props: React.PropsWithChildren) => {
  const [loading, setLoading] = React.useState(true);

  const [items, setItems] = React.useState<Tag[]>(PREDEFINED_TAGS);

  const [associations, setAssociations] = React.useState<TagAssociation[]>([]);

  const [activeTag, setActiveTag] = React.useState<string>(DEFAULT_TAG.id);

  //

  React.useEffect(() => {
    if (loading) return;
    const customTags = items.filter((tag) => tag.editable);
    store.set(key.tags.items, customTags);
  }, [items, loading]);

  React.useEffect(() => {
    if (loading) return;
    store.set(key.tags.associations, associations);
  }, [associations, loading]);

  React.useEffect(() => {
    Promise.all([
      store.get<Tag[]>(key.tags.items),
      store.get<TagAssociation[]>(key.tags.associations),
    ]).then(([savedItems, savedAssociations]) => {
      if (savedItems) {
        setItems([...PREDEFINED_TAGS, ...savedItems]);
      }
      if (savedAssociations) {
        setAssociations(savedAssociations);
      }
      setLoading(false);
    });
  }, []);

  //

  const context: TagsContext = {
    items,
    setItems,
    //
    associations,
    setAssociations,
    //
    activeTag,
    setActiveTag,
  };

  return (
    <tagsContext.Provider value={context}>
      { props.children }
    </tagsContext.Provider>
  );
};
