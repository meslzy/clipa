import React from "react";

export interface SearchContext {
  query: string;
  setQuery: (query: string) => void;
}

export const searchContext = React.createContext<SearchContext>(null as any);
