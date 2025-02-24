import { GenerativeConfig, GenerativeSource } from "./generativeTypes";

export const defaultGenerativeConfig: GenerativeConfig = {
  [GenerativeSource.Ollama]: {
    model: null,
  },
  [GenerativeSource.OpenAI]: {
    apiKey: null,
    model: null,
  },
  [GenerativeSource.Gemini]: {
  },
};
