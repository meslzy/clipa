import React from "react";

import { vaultContext } from "./vaultContext";

export const useVault = () => {
  const vault = React.useContext(vaultContext);

  if (!vault) {
    throw new Error("useVault must be used within a VaultProvider");
  }

  return {
    ...vault,
  };
};
