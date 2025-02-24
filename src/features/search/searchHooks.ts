import React from "react";

import { searchContext } from "./searchContext";

export const useSearch = () => {
  const search = React.useContext(searchContext);

  if (!search) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  return search;
};
