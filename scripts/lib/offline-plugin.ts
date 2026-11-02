import { createHash } from "node:crypto";
import { resolve } from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { offlineAssets } from "./offline-assets.ts";
import { offlineIcon } from "./offline-icons.ts";
import { releaseBase } from "../../src/modules/publication/release.ts";
import type { OfflineManifest } from "../../src/modules/offline/types.ts";
import packageInfo from "../../package.json" with { type: "json" };
const { version } = packageInfo;
const hash = (bytes: string | Uint8Array) =>
  createHash("sha256").update(bytes).digest("hex");
export function offlinePlugin(enabled: boolean): Plugin {
  let config: ResolvedConfig;
  return {
    name: "viveiro-offline",
    apply: "build",
    enforce: "post",
    configResolved(value) {
      config = value;
    },
    buildStart() {
      if (!enabled) return;
      if (config.base !== releaseBase(version))
        throw Error("Offline exige escopo da release pública.");
      this.emitFile({
        type: "chunk",
        id: resolve(config.root, "src/workers/offline.worker.ts"),
        fileName: "offline-worker.js",
      });
      for (const size of [192, 512])
        this.emitFile({
          type: "asset",
          fileName: "offline-icon-" + size + ".png",
          source: offlineIcon(size),
        });
      this.emitFile({
        type: "asset",
        fileName: "app-manifest.json",
        source: JSON.stringify(
          {
            id: config.base,
            name: "Viveiro · laboratório de formigas",
            short_name: "Viveiro",
            lang: "pt-BR",
            start_url: config.base,
            scope: config.base,
            display: "standalone",
            background_color: "#eff0e9",
            theme_color: "#344e36",
            description:
              "Terrário 3D e experimentos reproduzíveis. Modelo exploratório.",
            icons: [192, 512].map((size) => ({
              src: "offline-icon-" + size + ".png",
              sizes: size + "x" + size,
              type: "image/png",
              purpose: "any maskable",
            })),
          },
          null,
          2,
        ),
      });
    },
    generateBundle: {
      order: "post",
      handler(_options, bundle) {
        if (!enabled) return;
        const worker = bundle["offline-worker.js"];
        if (!worker || worker.type !== "chunk")
          throw Error("Service worker ausente.");
        const files = offlineAssets(config.root, bundle, config.base, version);
        for (const [path, bytes] of files)
          if (path.endsWith(".html")) {
            const item = bundle[path];
            if (item?.type === "asset") item.source = bytes;
            else
              this.emitFile({ type: "asset", fileName: path, source: bytes });
          }
        const assets = [...files]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([path, bytes]) => ({ path, sha256: hash(bytes) }));
        const manifest: OfflineManifest = {
          version: 1,
          release: version,
          base: config.base,
          build: hash(worker.code + JSON.stringify(assets)),
          assets,
        };
        const marker = "__VIVEIRO_OFFLINE_MANIFEST__";
        if (worker.code.split(marker).length !== 2)
          throw Error("Marcador do worker divergente.");
        worker.code = worker.code.replace(marker, JSON.stringify(manifest));
        this.emitFile({
          type: "asset",
          fileName: "offline-assets.json",
          source: JSON.stringify(manifest, null, 2),
        });
      },
    },
  };
}
