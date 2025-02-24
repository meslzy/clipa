import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import "@mantine/code-highlight/styles.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { App } from "./App";
import { ClipboardProvider } from "./features/clipboard";
import { GenerativeProvider } from "./features/generative";
import { SearchProvider } from "./features/search";
import { TagsProvider } from "./features/tags";
import { VaultProvider } from "./features/vault";
import { mantineTheme } from "./styles/mantine";

const root = document.getElementById("root") as HTMLElement;

const queryClient = new QueryClient();

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme={"auto"} theme={mantineTheme}>
      <Notifications/>
      <ModalsProvider>
        <QueryClientProvider client={queryClient}>
          <TagsProvider>
            <SearchProvider>
              <ClipboardProvider>
                <GenerativeProvider>
                  <VaultProvider>
                    <App/>
                  </VaultProvider>
                </GenerativeProvider>
              </ClipboardProvider>
            </SearchProvider>
          </TagsProvider>
        </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>,
);
