import { licensePages } from "./license-pages.ts";
import { supportedLocales, defaultLocale } from "../../src/i18n/catalogs.ts";
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
      for (const [fileName, source] of [
        ...modelDocPages(root),
        ...licensePages(root),
      ])
        this.emitFile({ type: "asset", fileName, source });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? "").split("?")[0].replace(/^\//, "");
        if (
          !supportedLocales.some((locale) =>
            path.startsWith(
              (locale === defaultLocale ? "" : locale + "/") + "modelo/",
            ),
          ) &&
          !supportedLocales.some(
            (locale) =>
              locale !== defaultLocale && path === locale + "/licencas.html",
          )
        )
          return next();
        const body =
          modelDocPages(root).get(path) ?? licensePages(root).get(path);
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
