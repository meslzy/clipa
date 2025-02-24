import React from "react";

import { VaultItem } from "./vaultTypes";

export interface VaultContext {
  items: VaultItem[];
  setItems: (vaults: VaultItem[] | ((prev: VaultItem[]) => VaultItem[])) => void;
}

export const vaultContext = React.createContext<VaultContext>(null as any);
