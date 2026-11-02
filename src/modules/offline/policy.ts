import type { OfflineManifest } from "./types.ts";
export function cachePrefix(scope: string) {
  return (
    "viveiro-offline:v1:" + encodeURIComponent(new URL(scope).pathname) + ":"
  );
}
export function cacheName(scope: string, manifest: OfflineManifest) {
  return cachePrefix(scope) + manifest.build;
}
export function assetPath(
  value: string,
  scope: string,
  manifest: OfflineManifest,
): string | undefined {
  const url = new URL(value),
    base = new URL(scope);
  if (
    url.origin !== base.origin ||
    url.search ||
    !url.pathname.startsWith(base.pathname)
  )
    return;
  const path = url.pathname.slice(base.pathname.length);
  const candidates = [
    path || "index.html",
    path + "index.html",
    path + ".html",
  ];
  return candidates.find((p) => manifest.assets.some((a) => a.path === p));
}
export function assetUrl(path: string, scope: string) {
  return new URL(path, scope).href;
}
export function htmlMarker(release: string) {
  return '<meta name="viveiro-offline" content="' + release + '">';
}
export async function checkedResponse(
  response: Response,
  expected: string,
  scope: string,
  manifest: OfflineManifest,
) {
  if (
    response.status !== 200 ||
    !["basic", "default"].includes(response.type) ||
    assetPath(response.url, scope, manifest) !== expected ||
    /(?:private|no-store)/i.test(response.headers.get("cache-control") ?? "")
  )
    throw Error("Resposta não pública ou fora da versão: " + expected);
  const bytes = await response.clone().arrayBuffer();
  if (expected.endsWith(".html")) {
    if (
      !(response.headers.get("content-type") ?? "").includes("text/html") ||
      !new TextDecoder().decode(bytes).includes(htmlMarker(manifest.release))
    )
      throw Error("Página inesperada: " + expected);
  } else {
    const hash = Array.from(
      new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
      (v) => v.toString(16).padStart(2, "0"),
    ).join("");
    if (hash !== manifest.assets.find((a) => a.path === expected)?.sha256)
      throw Error("Arquivo incompleto ou alterado: " + expected);
  }
  // Navigation requests can reject redirected cached responses. Preserve bytes and headers.
  return response.redirected
    ? new Response(bytes, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      })
    : response;
}
