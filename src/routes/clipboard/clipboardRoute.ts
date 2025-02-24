import { createRoute } from "@tanstack/react-router";

import { mainRoute } from "../main";

import { ClipboardComponent } from "./ClipboardComponent";

export const clipboardRoute = createRoute({
  path: "/",
  getParentRoute: () => mainRoute,
  component: ClipboardComponent,
});
