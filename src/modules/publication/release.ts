export interface ReleaseManifest {
  format: "viveiro-release";
  version: string;
  tag: string;
  sourceSha: string;
  files: Record<string, string>;
}
export function releaseTag(version: string) {
  if (!/^(0|[1-9]\d{0,8})\.(0|[1-9]\d{0,8})\.(0|[1-9]\d{0,8})$/.test(version))
    throw Error("Versão de release inválida.");
  return "v" + version;
}
export function releaseBase(version: string) {
  return "/releases/" + releaseTag(version) + "/";
}
export function validateSourceSha(sha: string) {
  if (!/^[0-9a-f]{40}$/.test(sha)) throw Error("SHA de origem inválido.");
}
export function validAssetPath(path: string) {
  return (
    /^[a-zA-Z0-9][a-zA-Z0-9_./-]*$/.test(path) &&
    !path
      .split("/")
      .some(
        (s) =>
          !s ||
          s === "." ||
          s === ".." ||
          s.startsWith(".") ||
          s.endsWith(".") ||
          /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(s),
      ) &&
    /\.(html|css|js|svg|txt|json|woff2?|ttf)$/.test(path)
  );
}
export function compareVersions(a: string, b: string) {
  releaseTag(a);
  releaseTag(b);
  const x = a.split(".").map(Number),
    y = b.split(".").map(Number);
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
}

export function validateReleaseManifest(value: unknown): ReleaseManifest {
  const m = value as ReleaseManifest | null;
  if (
    !m ||
    m.format !== "viveiro-release" ||
    typeof m.version !== "string" ||
    releaseTag(m.version) !== m.tag ||
    typeof m.sourceSha !== "string" ||
    !m.files ||
    typeof m.files !== "object" ||
    Array.isArray(m.files)
  )
    throw Error("Manifesto de release inválido.");
  validateSourceSha(m.sourceSha);
  const files = Object.entries(m.files);
  if (
    !files.length ||
    files.length > 1000 ||
    !Object.hasOwn(m.files, "index.html") ||
    files.some(
      ([p, h]) =>
        !validAssetPath(p) ||
        p === "release.json" ||
        typeof h !== "string" ||
        !/^[0-9a-f]{64}$/.test(h),
    )
  )
    throw Error("Inventário de release inválido.");
  return m;
}
