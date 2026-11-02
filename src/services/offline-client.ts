import { cachePrefix } from "../modules/offline/policy.ts";
import type { OfflineStatus } from "../modules/offline/types.ts";
export function ownRegistration(
  base: string,
  registration?: ServiceWorkerRegistration,
) {
  return (
    registration?.scope === new URL(base, location.origin).href &&
    [registration.active, registration.installing, registration.waiting].some(
      (w) =>
        w?.scriptURL ===
        new URL(base + "offline-worker.js", location.origin).href,
    )
  );
}
export function workerStatus(worker: ServiceWorker): Promise<OfflineStatus> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => {
      channel.port1.close();
      reject(Error("O navegador não respondeu sobre a cópia offline."));
    }, 5000);
    channel.port1.onmessage = (event: MessageEvent<OfflineStatus>) => {
      clearTimeout(timer);
      channel.port1.close();
      resolve(event.data);
    };
    worker.postMessage({ type: "VIVEIRO_OFFLINE_STATUS" }, [channel.port2]);
  });
}
export async function activeRegistration(base: string) {
  const registration = await navigator.serviceWorker.getRegistration(base);
  return ownRegistration(base, registration) ? registration : undefined;
}
export async function prepareRegistration(base: string) {
  const registration = await navigator.serviceWorker.register(
    base + "offline-worker.js",
    { scope: base, type: "module", updateViaCache: "none" },
  );
  if (registration.waiting) return registration;
  const worker = registration.installing;
  if (worker)
    await new Promise<void>((resolve, reject) => {
      const changed = () => {
        if (
          worker.state === "activated" ||
          (worker.state === "installed" && !!registration.active)
        ) {
          worker.removeEventListener("statechange", changed);
          resolve();
        }
        if (worker.state === "redundant") {
          worker.removeEventListener("statechange", changed);
          reject(
            Error(
              "A cópia offline não ficou completa. Tente novamente conectado.",
            ),
          );
        }
      };
      worker.addEventListener("statechange", changed);
      changed();
    });
  return registration;
}
export async function removeOffline(base: string) {
  const registration = await activeRegistration(base);
  if (registration) await registration.unregister();
  const prefix = cachePrefix(new URL(base, location.origin).href);
  for (const name of await caches.keys())
    if (name.startsWith(prefix)) await caches.delete(name);
}
