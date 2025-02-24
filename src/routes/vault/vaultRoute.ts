import { createRoute } from "@tanstack/react-router";

import { mainRoute } from "../main";

import { VaultComponent } from "./VaultComponent";

export const vaultRoute = createRoute({
  path: "/vault",
  getParentRoute: () => mainRoute,
  component: VaultComponent,
});
