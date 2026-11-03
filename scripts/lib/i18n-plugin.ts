import type { Plugin } from "vite";
import { staticTranslations } from "../../src/i18n/static-html.ts";
import { htmlIncludes } from "./html-includes.ts";
export function i18nPlugin(): Plugin {
  let root = process.cwd();
  return {
    name: "viveiro-i18n",
    configResolved(config) {
      root = config.root;
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        return staticTranslations(htmlIncludes(root, html));
      },
    },
    handleHotUpdate(context) {
      if (context.file.replaceAll("\\", "/").includes("/src/templates/"))
        context.server.ws.send({ type: "full-reload" });
    },
  };
}
