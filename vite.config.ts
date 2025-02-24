import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ?
      {
        protocol: "ws",
        host,
        port: 1421,
      } :
      undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
