import { createRoute } from "@tanstack/react-router";

import { appRoute } from "../app/appRoute";

import { MainComponent } from "./MainComponent";

export const mainRoute = createRoute({
  id: "main",
  getParentRoute: () => appRoute,
  component: MainComponent,
});
