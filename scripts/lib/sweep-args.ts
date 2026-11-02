export interface SweepArgs {
  out: string;
  plan?: string;
  checkpoint?: string;
  resume: boolean;
  jobs: number;
  help: boolean;
  limit?: number;
}
export function sweepArgs(args: string[]): SweepArgs {
  const v: Record<string, string> = {},
    flags = new Set<string>();
  for (let i = 0; i < args.length; i++) {
    const k = args[i];
    if (flags.has(k) || Object.hasOwn(v, k))
      throw Error("Argumento repetido: " + k);
    if (["--resume", "--help"].includes(k)) {
      flags.add(k);
      continue;
    }
    if (
      !["--out", "--plan", "--checkpoint", "--jobs", "--limit"].includes(k) ||
      !args[i + 1] ||
      args[i + 1].startsWith("--")
    )
      throw Error("Argumento inválido: " + k);
    v[k] = args[++i];
  }
  const jobs = Number(v["--jobs"] ?? 2);
  if (!/^[1-8]$/.test(String(v["--jobs"] ?? 2)) || !Number.isInteger(jobs))
    throw Error("Use --jobs de 1 a 8.");
  if (!v["--out"] && !flags.has("--help")) throw Error("Informe --out pasta.");
  if (flags.has("--resume") && v["--checkpoint"])
    throw Error("Não combine --resume e --checkpoint.");
  const limit = v["--limit"] === undefined ? undefined : Number(v["--limit"]);
  if (
    limit !== undefined &&
    (!/^[0-9]+$/.test(v["--limit"]) ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 1000)
  )
    throw Error("Use --limit de 1 a 1000.");
  return {
    limit,
    out: v["--out"] ?? "",
    plan: v["--plan"],
    checkpoint: v["--checkpoint"],
    resume: flags.has("--resume"),
    jobs,
    help: flags.has("--help"),
  };
}
