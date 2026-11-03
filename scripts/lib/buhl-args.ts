export interface BuhlOptions {
  out: string;
  days: number;
  seeds: number;
  groups: number[];
  sampleEvery: number;
  mode: "projetos" | "estigmergia";
  protocol: "terrario" | "grupo-fixo";
  idle: "original" | "cedem";
  /** Real-time reading: hours of experiment and seconds per tick. */
  realTime?: { hours: number; secondsPerTick: number; ticks: number };
  parallel: boolean;
}

const integer = (name: string, raw: string, min: number, max: number) => {
  if (!/^\d+$/.test(raw)) throw Error(`--${name} deve ser inteiro.`);
  const value = Number(raw);
  if (value < min || value > max)
    throw Error(`--${name} deve estar entre ${min} e ${max}.`);
  return value;
};

/** Strict parser: unknown, repeated or valueless flags fail before running. */
export function buhlArgs(argv: string[]): BuhlOptions {
  const seen = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 2) {
    const flag = argv[i],
      value = argv[i + 1];
    if (!flag.startsWith("--")) throw Error("Argumento inesperado: " + flag);
    const name = flag.slice(2);
    if (
      ![
        "out",
        "days",
        "seeds",
        "groups",
        "sample-every",
        "mode",
        "protocol",
        "ociosas",
        "horas",
        "segundos-por-tick",
        "paralelo",
      ].includes(name)
    )
      throw Error("Opção desconhecida: " + flag);
    if (seen.has(name)) throw Error("Opção repetida: " + flag);
    if (value === undefined || value.startsWith("--"))
      throw Error("Opção sem valor: " + flag);
    seen.set(name, value);
  }
  const out = seen.get("out");
  if (!out) throw Error("Informe --out com uma pasta nova.");
  const groups = (seen.get("groups") ?? "50,100,200")
    .split(",")
    .map((g) => integer("groups", g.trim(), 1, 400));
  if (new Set(groups).size !== groups.length || groups.length < 2)
    throw Error("--groups precisa de ao menos dois tamanhos diferentes.");
  const choice = <T extends string>(name: string, fallback: T, ok: T[]) => {
    const value = (seen.get(name) ?? fallback) as T;
    if (!ok.includes(value))
      throw Error(`--${name} deve ser ${ok.join(" ou ")}.`);
    return value;
  };
  let realTime: BuhlOptions["realTime"];
  if (seen.has("horas") || seen.has("segundos-por-tick")) {
    if (seen.has("days")) throw Error("Use --days ou --horas, não os dois.");
    const hours = integer("horas", seen.get("horas") ?? "72", 1, 200);
    const raw = seen.get("segundos-por-tick") ?? "1";
    if (!/^\d+(\.\d+)?$/.test(raw))
      throw Error("--segundos-por-tick deve ser um número positivo.");
    const secondsPerTick = Number(raw);
    if (secondsPerTick < 0.05 || secondsPerTick > 60)
      throw Error("--segundos-por-tick deve estar entre 0,05 e 60.");
    const ticks = (hours * 3600) / secondsPerTick;
    if (!Number.isInteger(ticks) || ticks > 3_000_000)
      throw Error(
        "--horas × 3600 / --segundos-por-tick deve dar um número inteiro de até 3 milhões de ticks.",
      );
    realTime = { hours, secondsPerTick, ticks };
  }
  return {
    out,
    days: integer("days", seen.get("days") ?? "3", 1, 365),
    seeds: integer("seeds", seen.get("seeds") ?? "1", 1, 50),
    groups: groups.sort((a, b) => a - b),
    sampleEvery: integer(
      "sample-every",
      seen.get("sample-every") ??
        (seen.has("horas") || seen.has("segundos-por-tick") ? "600" : "5"),
      1,
      100_000,
    ),
    mode: choice("mode", "projetos", ["projetos", "estigmergia"]),
    protocol: choice("protocol", "terrario", ["terrario", "grupo-fixo"]),
    idle: choice("ociosas", "original", ["original", "cedem"]),
    realTime,
    parallel: choice("paralelo", "nao", ["nao", "sim"]) === "sim",
  };
}
