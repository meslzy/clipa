import { LazyStore } from "@tauri-apps/plugin-store";

export const store = new LazyStore("store.json");

// store.clear();

export const key = {
  clipboard: {
    items: "clipboardItems",
  },
  tags: {
    items: "tagsItems",
    associations: "tagsAssociations",
  },
  generative: {
    selected: "generativeSelected",
    config: "generativeConfig",
  },
  vault: {
    items: "vaultItems",
  },
};
