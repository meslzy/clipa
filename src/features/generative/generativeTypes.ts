export enum GenerativeSource {
  Ollama = "ollama",
  OpenAI = "openai",
  Gemini = "gemini",
}

export interface OllamaConfig {
  model: string | null;
}

export interface OpenAIConfig {
  apiKey: string | null;
  model: string | null;
}

export interface GeminiConfig {
}

export type GenerativeConfig = {
  [GenerativeSource.Ollama]: OllamaConfig;
  [GenerativeSource.OpenAI]: OpenAIConfig;
  [GenerativeSource.Gemini]: GeminiConfig;
};
