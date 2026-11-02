import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  prepareOffline,
  offlineStatus,
  cleanOldBuilds,
  cachedAsset,
} from "../src/modules/offline/cache.ts";
import {
  cacheName,
  cachePrefix,
  assetPath,
  htmlMarker,
  checkedResponse,
} from "../src/modules/offline/policy.ts";
import { MemoryCaches, publicResponse } from "./fixtures/offline-cache.mjs";
const scope = "https://example.org/releases/v0.35.0/";
const bodies = {
  "index.html": "<!doctype html><head>" + htmlMarker("0.35.0") + "</head>",
  "assets/model.js": "export const value=42;",
};
const manifest = {
  version: 1,
  release: "0.35.0",
  base: "/releases/v0.35.0/",
  build: "one",
  assets: Object.entries(bodies).map(([path, body]) => ({
    path,
    sha256: createHash("sha256").update(body).digest("hex"),
  })),
};
const publicFetch = async (value, options) => {
  assert.equal(options.credentials, "omit");
  const path = assetPath(String(value), scope, manifest);
  return publicResponse(bodies[path], String(value), {
    "content-type": path.endsWith(".html") ? "text/html" : "text/javascript",
  });
};
test("cópia completa abre offline sem buscar a rede ou tocar nos saves", async () => {
  const caches = new MemoryCaches();
  await prepareOffline(caches, publicFetch, scope, manifest);
  assert.deepEqual(await offlineStatus(caches, scope, manifest), {
    ready: true,
    files: 2,
    release: "0.35.0",
  });
  for (const path of ["", "index.html", "assets/model.js"]) {
    const response = await cachedAsset(
      caches,
      () => {
        throw Error("Rede indisponível");
      },
      new Request(new URL(path, scope)),
      scope,
      manifest,
    );
    assert.equal(await response.text(), bodies[path || "index.html"]);
  }
});
test("falha parcial preserva outra versão e o build ativo anterior", async () => {
  const caches = new MemoryCaches();
  await prepareOffline(caches, publicFetch, scope, manifest);
  const other = cacheName(scope.replace("0.35.0", "0.34.0"), manifest);
  await caches.open(other);
  const candidate = { ...manifest, build: "two" };
  let count = 0;
  await assert.rejects(
    prepareOffline(
      caches,
      async (...args) => {
        if (++count === 2) throw Error("cortou");
        return publicFetch(...args);
      },
      scope,
      candidate,
    ),
    /cortou/,
  );
  assert.equal(await caches.has(cacheName(scope, candidate)), false);
  assert.equal((await offlineStatus(caches, scope, manifest)).ready, true);
  assert.equal(await caches.has(other), true);
  await caches.open(cachePrefix(scope) + "old");
  await cleanOldBuilds(caches, scope, manifest);
  assert.deepEqual(
    new Set(await caches.keys()),
    new Set([cacheName(scope, manifest), other]),
  );
});
test("login, resposta privada, mudança de bytes e página de outra origem são rejeitados", async () => {
  for (const response of [
    publicResponse("login", scope, { "content-type": "text/html" }),
    publicResponse(bodies["index.html"], scope, {
      "cache-control": "private",
      "content-type": "text/html",
    }),
    publicResponse(bodies["index.html"], "https://login.example.org/", {
      "content-type": "text/html",
    }),
  ])
    await assert.rejects(
      prepareOffline(new MemoryCaches(), async () => response, scope, manifest),
    );
  await assert.rejects(
    prepareOffline(
      new MemoryCaches(),
      async (url) =>
        String(url).endsWith(".js")
          ? publicResponse("changed", String(url))
          : publicFetch(url, { credentials: "omit" }),
      scope,
      manifest,
    ),
    /alterado/,
  );
});
test("evicção invalida pronto; rotas fora da lista, queries e métodos de escrita seguem para rede", async () => {
  const caches = new MemoryCaches();
  await prepareOffline(caches, publicFetch, scope, manifest);
  const cache = await caches.open(cacheName(scope, manifest));
  cache.entries.delete(new URL("assets/model.js", scope).href);
  assert.equal((await offlineStatus(caches, scope, manifest)).ready, false);
  for (const request of [
    new Request(scope + "?token=anything"),
    new Request("https://example.org/api/save"),
    new Request(scope, { method: "POST", body: "save" }),
  ]) {
    let network = false;
    await cachedAsset(
      caches,
      async () => {
        network = true;
        return new Response("network");
      },
      request,
      scope,
      manifest,
    );
    assert.equal(network, true);
  }
});

test("redirecionamento canônico é copiado sem perder corpo ou cabeçalhos", async () => {
  const body = bodies["index.html"] + "<script>/* infrastructure */</script>";
  const response = publicResponse(body, scope, {
    "content-type": "text/html",
    "x-test": "preserved",
  });
  Object.defineProperty(response, "redirected", { value: true });
  const checked = await checkedResponse(
    response,
    "index.html",
    scope,
    manifest,
  );
  assert.equal(checked.redirected, false);
  assert.equal(checked.headers.get("x-test"), "preserved");
  assert.equal(await checked.text(), body);
  const caches = new MemoryCaches(),
    cache = await caches.open(cacheName(scope, manifest));
  const put = cache.put.bind(cache);
  cache.put = async (url, value) => {
    if (String(url).endsWith("index.html"))
      assert.equal(value.redirected, false);
    await put(url, value);
  };
  await prepareOffline(
    caches,
    async (url, opts) => {
      const r = await publicFetch(url, opts);
      Object.defineProperty(r, "redirected", { value: true });
      return r;
    },
    scope,
    manifest,
  );
});
