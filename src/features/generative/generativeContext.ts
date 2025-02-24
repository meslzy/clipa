import React from "react";

import { LLM } from "@langchain/core/language_models/llms";

import { GenerativeConfig, GenerativeSource } from "./generativeTypes";

export interface GenerativeContext {
  selected: GenerativeSource | null;
  setSelected: (selected: GenerativeSource | null) => void;
  config: GenerativeConfig;
  setConfig: (config: GenerativeConfig) => void;
  llm: LLM | null;
}

export const generativeContext = React.createContext<GenerativeContext>(null as any);
