import { teachingPlugin } from "./scripts/lib/teaching-plugin.ts";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [teachingPlugin()],
  server: { host: "127.0.0.1", port: 4173, strictPort: true },
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
});
