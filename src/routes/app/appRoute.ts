import { createRootRoute } from "@tanstack/react-router";

import { AppComponent } from "./AppComponent";

export const appRoute = createRootRoute({
  component: AppComponent,
});
