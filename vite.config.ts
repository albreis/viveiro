import { modelDocPlugin } from "./scripts/lib/model-doc-plugin.ts";
import { offlinePlugin } from "./scripts/lib/offline-plugin.ts";
import { teachingPlugin } from "./scripts/lib/teaching-plugin.ts";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    teachingPlugin(),
    modelDocPlugin(),
    offlinePlugin(mode === "public"),
  ],
  server: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
    watch: { ignored: ["**/.runtime/**", "**/.sites-runtime/**"] },
  },
  build: {
    target: "es2022",
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/three/")) return "three";
        },
      },
    },
  },
}));
