import { createRoute } from "@tanstack/react-router";

import { mainRoute } from "../main";

import { NoteComponent } from "./NoteComponent";

export const noteRoute = createRoute({
  path: "/note",
  getParentRoute: () => mainRoute,
  component: NoteComponent,
});
