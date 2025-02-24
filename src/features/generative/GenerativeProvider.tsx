import React from "react";

import { LLM } from "@langchain/core/language_models/llms";
import { Ollama } from "@langchain/ollama";

import { key, store } from "~/backend/store";

import { generativeContext, GenerativeContext } from "./generativeContext";
import { GenerativeConfig, GenerativeSource } from "./generativeTypes";
import { defaultGenerativeConfig } from "./generativeUtils";

export const GenerativeProvider = (props: React.PropsWithChildren) => {
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<GenerativeSource | null>(null);
  const [config, setConfig] = React.useState<GenerativeConfig>(defaultGenerativeConfig);
  const [llm, setLLM] = React.useState<LLM | null>(null);

  //

  React.useEffect(() => {
    if (loading || !selected) return;

    if (selected === GenerativeSource.Ollama) {
      const ollamaConfig = config[GenerativeSource.Ollama];

      if (!ollamaConfig.model) return;

      const ollama = new Ollama({
        model: ollamaConfig.model,
      });

      setLLM(ollama);
    }
  }, [selected, config]);

  React.useEffect(() => {
    if (loading) return;
    store.set(key.generative.selected, selected);
  }, [loading, selected, loading]);

  React.useEffect(() => {
    if (loading) return;
    store.set(key.generative.config, config);
  }, [config, loading]);

  React.useEffect(() => {
    Promise.all([
      store.get<GenerativeSource | null>(key.generative.selected),
      store.get<GenerativeConfig>(key.generative.config),
    ]).then(([selected, config]) => {
      if (selected) {
        setSelected(selected);
      }
      if (config) {
        setConfig(config);
      }

      setLoading(false);
    });
  }, []);

  //

  const context: GenerativeContext = {
    selected,
    setSelected,
    config,
    setConfig,
    llm,
  };

  return (
    <generativeContext.Provider value={context}>
      { props.children }
    </generativeContext.Provider>
  );
};
