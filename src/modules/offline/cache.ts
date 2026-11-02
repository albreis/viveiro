import type { OfflineManifest, OfflineStatus } from "./types.ts";
import {
  cacheName,
  cachePrefix,
  assetPath,
  assetUrl,
  checkedResponse,
} from "./policy.ts";
export type OfflineStorage = Pick<
  CacheStorage,
  "open" | "keys" | "delete" | "has"
>;
const readyUrl = (scope: string) => assetUrl("__offline_complete__", scope);
/** The completion marker is written last; a failed install never replaces a usable build. */
export async function prepareOffline(
  storage: OfflineStorage,
  fetcher: typeof fetch,
  scope: string,
  manifest: OfflineManifest,
) {
  const name = cacheName(scope, manifest),
    cache = await storage.open(name);
  try {
    for (const asset of manifest.assets) {
      const url = assetUrl(asset.path, scope);
      const response = await fetcher(url, {
        credentials: "omit",
        cache: "reload",
        redirect: "follow",
      });
      await checkedResponse(response, asset.path, scope, manifest);
      await cache.put(url, response);
    }
    await cache.put(readyUrl(scope), new Response(manifest.build));
  } catch (error) {
    await storage.delete(name);
    throw error;
  }
}
export async function offlineStatus(
  storage: OfflineStorage,
  scope: string,
  manifest: OfflineManifest,
): Promise<OfflineStatus> {
  const name = cacheName(scope, manifest);
  if (!(await storage.has(name)))
    return { ready: false, files: 0, release: manifest.release };
  const cache = await storage.open(name);
  const found = await Promise.all(
    manifest.assets.map((a) => cache.match(assetUrl(a.path, scope))),
  );
  const files = found.filter(Boolean).length;
  const marker = await cache.match(readyUrl(scope));
  const complete = marker && (await marker.text()) === manifest.build;
  return {
    ready: !!complete && files === manifest.assets.length,
    files,
    release: manifest.release,
  };
}
export async function cleanOldBuilds(
  storage: OfflineStorage,
  scope: string,
  manifest: OfflineManifest,
) {
  for (const name of await storage.keys())
    if (
      name.startsWith(cachePrefix(scope)) &&
      name !== cacheName(scope, manifest)
    )
      await storage.delete(name);
}
export async function cachedAsset(
  storage: OfflineStorage,
  fetcher: typeof fetch,
  request: Request,
  scope: string,
  manifest: OfflineManifest,
) {
  const path = assetPath(request.url, scope, manifest);
  if (!path || request.method !== "GET") return fetcher(request);
  const cache = await storage.open(cacheName(scope, manifest));
  const hit = await cache.match(assetUrl(path, scope));
  return hit ?? fetcher(request);
}
