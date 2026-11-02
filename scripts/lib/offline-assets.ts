import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
type OutputBundle = Record<
  string,
  | { type: "chunk"; code: string }
  | { type: "asset"; source: string | Uint8Array }
>;
import { htmlMarker } from "../../src/modules/offline/policy.ts";
export function offlineAssets(
  root: string,
  bundle: OutputBundle,
  base: string,
  release: string,
) {
  const files = new Map<string, Buffer>();
  const scan = (dir: string, prefix = "") => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isSymbolicLink())
        throw Error("Link não permitido no pacote offline.");
      const path = prefix + entry.name;
      if (entry.isDirectory()) scan(join(dir, entry.name), path + "/");
      else if (entry.isFile())
        files.set(path, readFileSync(join(dir, entry.name)));
    }
  };
  scan(join(root, "public"));
  for (const [path, item] of Object.entries(bundle)) {
    if (path === "offline-worker.js") continue;
    const source = item.type === "chunk" ? item.code : item.source;
    files.set(
      path,
      typeof source === "string" ? Buffer.from(source) : Buffer.from(source),
    );
  }
  for (const [path, bytes] of files)
    if (path.endsWith(".html")) {
      const html = bytes
        .toString("utf8")
        .replace(
          "</head>",
          htmlMarker(release) +
            '\n<link rel="manifest" href="' +
            base +
            'app-manifest.json">\n</head>',
        );
      if (!html.includes(htmlMarker(release)))
        throw Error("Página sem head: " + path);
      files.set(path, Buffer.from(html));
    }
  return files;
}
