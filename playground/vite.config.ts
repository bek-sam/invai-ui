import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/** Dev-only Vite app to visually check every `@invai/ui` component in a browser. */
export default defineConfig({
  root: "playground",
  plugins: [react(), tailwindcss()],
  server: { port: 5175 },
});
