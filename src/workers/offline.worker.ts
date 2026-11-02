import type { OfflineManifest } from "../modules/offline/types.ts";
import { assetPath } from "../modules/offline/policy.ts";
import {
  prepareOffline,
  cleanOldBuilds,
  cachedAsset,
  offlineStatus,
} from "../modules/offline/cache.ts";
const sw = self as unknown as ServiceWorkerGlobalScope;
declare const __VIVEIRO_OFFLINE_MANIFEST__: OfflineManifest;
const manifest = __VIVEIRO_OFFLINE_MANIFEST__;
const scope = sw.registration.scope;
sw.addEventListener("install", (event) => {
  event.waitUntil(
    prepareOffline(sw.caches, sw.fetch.bind(sw), scope, manifest),
  );
});
sw.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await cleanOldBuilds(sw.caches, scope, manifest);
      await sw.clients.claim();
    })(),
  );
});
sw.addEventListener("fetch", (event) => {
  if (
    event.request.method === "GET" &&
    assetPath(event.request.url, scope, manifest)
  )
    event.respondWith(
      cachedAsset(sw.caches, sw.fetch.bind(sw), event.request, scope, manifest),
    );
});
sw.addEventListener("message", (event) => {
  if (event.data?.type === "VIVEIRO_OFFLINE_STATUS" && event.ports[0])
    event.waitUntil(
      offlineStatus(sw.caches, scope, manifest).then((status) =>
        event.ports[0].postMessage(status),
      ),
    );
});
