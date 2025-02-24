import React from "react";

import { createRouter, RouterProvider } from "@tanstack/react-router";

import { appRoute } from "./routes/app";
import { clipboardRoute } from "./routes/clipboard";
import { mainRoute } from "./routes/main";
import { noteRoute } from "./routes/note";
import { settingsRoute } from "./routes/settings";
import { vaultRoute } from "./routes/vault";

const routeTree = appRoute.addChildren([
  mainRoute.addChildren([
    clipboardRoute,
    vaultRoute,
    noteRoute,
  ]),
  settingsRoute,
]);

const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  const contextMenuHandler = React.useCallback((event: MouseEvent) => {
    event.preventDefault();
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();

    document.addEventListener("contextmenu", contextMenuHandler, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <RouterProvider router={router}/>
  );
};
