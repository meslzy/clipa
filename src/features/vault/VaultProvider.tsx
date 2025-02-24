import React from "react";

import { key, store } from "~/backend/store";

import { vaultContext, VaultContext } from "./vaultContext";
import { VaultItem } from "./vaultTypes";

export const VaultProvider = (props: React.PropsWithChildren) => {
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<VaultItem[]>([]);

  React.useEffect(() => {
    if (loading) return;
    store.set(key.vault.items, items);
  }, [items, loading]);

  React.useEffect(() => {
    store.get<VaultItem[]>(key.vault.items).then((savedItems) => {
      if (savedItems) {
        setItems(savedItems);
      }

      setLoading(false);
    });
  }, []);

  const context: VaultContext = {
    items,
    setItems,
  };

  return (
    <vaultContext.Provider value={context}>
      { props.children }
    </vaultContext.Provider>
  );
};
