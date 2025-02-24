import React from "react";

import { generativeContext } from "./generativeContext";
import { GenerativeConfig, GenerativeSource } from "./generativeTypes";

export const useGenerative = () => {
  const generative = React.useContext(generativeContext);

  if (!generative) {
    throw new Error("useGenerative must be used within a GenerativeProvider");
  }

  return generative;
};

export interface GenerativeSourceUtils<Source extends GenerativeSource> {
  selected: boolean;
  setSelected: (selected: boolean) => void;
  config: GenerativeConfig[Source];
  setConfig: (config: GenerativeConfig[Source]) => void;
}

export const useGenerativeSource = <Source extends GenerativeSource>(source: Source): GenerativeSourceUtils<Source> => {
  const generative = useGenerative();

  const selected = React.useMemo(() => {
    return generative.selected === source;
  }, [generative.selected]);

  const setSelected = React.useCallback((selected: boolean) => {
    if (selected) {
      generative.setSelected(source);
    } else {
      generative.setSelected(null);
    }
  }, []);

  const config = React.useMemo(() => {
    return generative.config[source];
  }, [generative.config]);

  const setConfig = React.useCallback((config: GenerativeConfig[Source]) => {
    generative.setConfig({
      ...generative.config,
      [source]: config,
    });
  }, [generative.setConfig, source]);

  return {
    selected,
    setSelected,
    config,
    setConfig,
  };
};
