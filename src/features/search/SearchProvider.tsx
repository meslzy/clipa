import React from "react";

import { searchContext, SearchContext } from "./searchContext";

export const SearchProvider = (props: React.PropsWithChildren) => {
  const [query, setQuery] = React.useState<string>("");

  const context: SearchContext = {
    query,
    setQuery,
  };

  return (
    <searchContext.Provider value={context}>
      { props.children }
    </searchContext.Provider>
  );
};
