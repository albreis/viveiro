import type { Plugin } from "vite";
import { teachingPages } from "./teaching-pages.ts";
export function teachingPlugin(): Plugin {
  return {
    name: "viveiro-teaching",
    generateBundle() {
      for (const [fileName, source] of teachingPages(process.cwd()))
        this.emitFile({ type: "asset", fileName, source });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? "").split("?")[0].replace(/^\//, "");
        if (!path.startsWith("ensino/")) return next();
        const pages = teachingPages(process.cwd()),
          body = pages.get(path);
        if (body === undefined) return next();
        res.setHeader(
          "Content-Type",
          path.endsWith(".html")
            ? "text/html; charset=utf-8"
            : path.endsWith(".css")
              ? "text/css; charset=utf-8"
              : "text/plain; charset=utf-8",
        );
        res.end(body);
      });
    },
  };
}
