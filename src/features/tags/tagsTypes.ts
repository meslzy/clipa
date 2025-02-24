export interface Tag {
  id: string;
  label: string;
  icon: string;
  editable: boolean;
}

export interface CrudTag {
  label: string;
  icon: string;
}

export interface TagAssociation {
  tagId: string;
  itemId: string;
}
