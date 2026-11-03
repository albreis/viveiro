import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, mkdtempSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";
import { offlineIcon } from "../scripts/lib/offline-icons.ts";
import packageInfo from "../package.json" with { type: "json" };
const { version } = packageInfo;
import {
  releaseBase,
  validAssetPath,
} from "../src/modules/publication/release.ts";
const hash = (value) => createHash("sha256").update(value).digest("hex");
test("ícones de instalação têm dimensões PNG reais", () => {
  for (const size of [192, 512]) {
    const bytes = offlineIcon(size);
    assert.deepEqual(
      [...bytes.subarray(0, 8)],
      [137, 80, 78, 71, 13, 10, 26, 10],
    );
    assert.equal(bytes.readUInt32BE(16), size);
    assert.equal(bytes.readUInt32BE(20), size);
    assert.ok(validAssetPath("offline-icon-" + size + ".png"));
  }
});
test("build público cacheia chunks, quatro Workers, guias e manifesto com hashes finais", async () => {
  mkdirSync(resolve(".runtime"), { recursive: true });
  const folder = mkdtempSync(resolve(".runtime/offline-build-test-")),
    root = join(folder, "public"),
    privateRoot = join(folder, "private");
  const { build } = await import("vite");
  await build({
    mode: "public",
    base: releaseBase(version),
    logLevel: "silent",
    build: { outDir: root, emptyOutDir: false },
  });
  await build({
    mode: "production",
    logLevel: "silent",
    build: { outDir: privateRoot, emptyOutDir: false },
  });
  const m = JSON.parse(readFileSync(root + "/offline-assets.json", "utf8"));
  assert.equal(m.base, releaseBase(version));
  assert.equal(new Set(m.assets.map((a) => a.path)).size, m.assets.length);
  for (const a of m.assets) {
    assert.ok(validAssetPath(a.path), a.path);
    assert.equal(hash(readFileSync(root + "/" + a.path)), a.sha256, a.path);
  }
  for (const prefix of [
    "assets/three-",
    "assets/forecast.worker-",
    "assets/advance.worker-",
    "assets/experiment.worker-",
    "experimentos.html",
    "notices/stdlib-index.txt",
    "notices/apache-2.0.txt",
    "assets/learning.worker-",
    "assets/soil.worker-",
    "ensino/index.html",
    "modelo/index.html",
    "modelo/reacao-difusao.html",
    "modelo/referencia.txt",
    "modelo/vetores.json",
    "en/modelo/index.html",
    "en/modelo/reacao-difusao.html",
    "en/modelo/vetores.json",
    "en/ensino/index.html",
    "en/ensino/seed-e-heranca.txt",
    "en/licencas.html",
    "app-manifest.json",
  ])
    assert.ok(
      m.assets.some((a) => a.path.startsWith(prefix)),
      prefix,
    );
  const worker = readFileSync(root + "/offline-worker.js", "utf8");
  assert.equal(worker.includes("__VIVEIRO_OFFLINE_MANIFEST__"), false);
  assert.equal(worker.includes("skipWaiting"), false);
  const app = JSON.parse(readFileSync(root + "/app-manifest.json", "utf8"));
  assert.equal(app.scope, m.base);
  assert.equal(app.start_url, m.base);
  assert.equal(app.display, "standalone");
  assert.equal(app.icons.length, 2);
  assert.equal(existsSync(join(privateRoot, "offline-worker.js")), false);
  assert.equal(
    readFileSync(join(privateRoot, "index.html"), "utf8").includes(
      'rel="manifest"',
    ),
    false,
  );
});
