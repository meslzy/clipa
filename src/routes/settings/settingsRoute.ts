import { createRoute } from "@tanstack/react-router";

import { appRoute } from "../app/appRoute";

import { SettingsComponent } from "./SettingsComponent";

export const settingsRoute = createRoute({
  path: "/settings",
  getParentRoute: () => appRoute,
  component: SettingsComponent,
});
