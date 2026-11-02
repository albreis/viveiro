import type { Plugin } from "vite";
import { modelDocPages } from "./model-doc-pages.ts";
export function modelDocPlugin(): Plugin {
  let root = process.cwd();
  return {
    name: "viveiro-model-docs",
    configResolved(config) {
      root = config.root;
    },
    generateBundle() {
      for (const [fileName, source] of modelDocPages(root))
        this.emitFile({ type: "asset", fileName, source });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? "").split("?")[0].replace(/^\//, "");
        if (!path.startsWith("modelo/")) return next();
        const body = modelDocPages(root).get(path);
        if (body === undefined) return next();
        res.setHeader(
          "Content-Type",
          path.endsWith(".html")
            ? "text/html; charset=utf-8"
            : path.endsWith(".css")
              ? "text/css; charset=utf-8"
              : path.endsWith(".json")
                ? "application/json; charset=utf-8"
                : "text/plain; charset=utf-8",
        );
        res.end(body);
      });
    },
  };
}
