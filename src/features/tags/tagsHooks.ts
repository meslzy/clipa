import React from "react";

import { generateId } from "~/utils/id";

import { tagsContext } from "./tagsContext";
import { Tag, CrudTag } from "./tagsTypes";

export const useTags = () => {
  const tags = React.useContext(tagsContext);

  if (!tags) {
    throw new Error("useTags must be used within a TagsProvider");
  }

  //

  const addTag = (tag: CrudTag) => {
    tags.setItems((prev) => [...prev, {
      ...tag,
      id: generateId(),
      editable: true,
    }]);
  };

  const removeTag = (tagId: string) => {
    tags.setItems((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const updateTag = (tagId: string, tag: Partial<CrudTag>) => {
    tags.setItems((prev) => prev.map((t) => t.id === tagId ? { ...t, ...tag } : t));
  };

  //

  const addAssociation = (tagId: string, itemId: string) => {
    tags.setAssociations((prev) => [...prev, { tagId, itemId }]);
  };

  const removeAssociation = (tagId: string, itemId: string) => {
    tags.setAssociations((prev) => prev.filter((association) => association.tagId !== tagId || association.itemId !== itemId));
  };

  const hasAssociation = (tagId: string, itemId: string) => {
    return tags.associations.some((association) => association.tagId === tagId && association.itemId === itemId);
  };

  const removeAssociations = (itemId: string) => {
    tags.setAssociations((prev) => prev.filter((association) => association.itemId !== itemId));
  };

  const hasAssociations = (itemId: string) => {
    return tags.associations.some((association) => association.itemId === itemId);
  };

  //

  const getItemTags = (itemId: string) => {
    return tags.associations
      .filter((association) => association.itemId === itemId)
      .map((association) => tags.items.find((tag) => tag.id === association.tagId))
      .filter((tag): tag is Tag => tag !== undefined);
  };

  //

  return {
    ...tags,
    //
    addTag,
    removeTag,
    updateTag,
    //
    addAssociation,
    removeAssociation,
    hasAssociation,
    removeAssociations,
    hasAssociations,
    //
    getItemTags,
  };
};
