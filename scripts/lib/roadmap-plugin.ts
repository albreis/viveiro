import type { Plugin } from "vite";
import { resolve } from "node:path";
import { readRoadmap, roadmapDocuments } from "./roadmap-data.ts";
const virtualId = "virtual:viveiro-roadmap";
export const privateRoadmapEnabled = (mode: string) => mode !== "public";
/** Only the owner-private build receives the page and its document payload. */
export function roadmapPlugin(): Plugin {
  let root = process.cwd();
  let enabled = false;
  return {
    name: "viveiro-private-roadmap",
    configResolved(config) {
      root = config.root;
      enabled = privateRoadmapEnabled(config.mode);
    },
    resolveId(id) {
      if (id === virtualId) return "\0" + virtualId;
    },
    load(id) {
      if (id !== "\0" + virtualId) return;
      if (!enabled)
        throw Error("Private roadmap is excluded from public builds");
      for (const file of roadmapDocuments)
        this.addWatchFile(resolve(root, file));
      return "export default " + JSON.stringify(readRoadmap(root));
    },
    transformIndexHtml: {
      order: "post",
      handler(html, context) {
        if (
          !enabled ||
          !context.filename.replaceAll("\\", "/").endsWith("/index.html")
        )
          return html;
        return html.replace(
          '<div class="top-actions">',
          '<div class="top-actions"><a class="text-button" href="./cronograma.html" data-i18n="roadmap.link">Cronograma</a>',
        );
      },
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!enabled && (req.url ?? "").split("?")[0] === "/cronograma.html") {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }
        next();
      });
    },
    handleHotUpdate(context) {
      if (
        enabled &&
        roadmapDocuments.some((file) => context.file === resolve(root, file))
      )
        context.server.ws.send({ type: "full-reload" });
    },
  };
}
