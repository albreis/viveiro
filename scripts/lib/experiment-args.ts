import { normalizeExperiment } from "../../src/modules/experiments/plan.ts";
const flags: Record<string, string> = {
  "--humidity": "humidity",
  "--light": "light",
  "--randomness": "randomness",
  "--repose-angle": "reposeAngle",
  "--temperature": "temperatureC",
  "--wind-x": "windX",
  "--wind-z": "windZ",
};
export function experimentArgs(args: string[]) {
  const values = new Map<string, string>();
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i],
      value = args[i + 1];
    if (
      ![
        "--seed",
        "--days",
        "--profile",
        "--start",
        "--out",
        "--plan",
        "--extension",
        ...Object.keys(flags),
      ].includes(key) ||
      value === undefined ||
      !value.trim().length ||
      values.has(key)
    )
      throw Error("Argumento desconhecido, sem valor ou repetido: " + key);
    values.set(key, value);
  }
  const out = values.get("--out");
  if (!out) throw Error("Informe --out com uma pasta nova.");
  if (values.has("--plan")) {
    if (values.size !== (values.has("--extension") ? 3 : 2))
      throw Error(
        "--plan combina somente com --out e --extension; não sobrescreve valores silenciosamente.",
      );
    return {
      out,
      planFile: values.get("--plan")!,
      plan: null,
      ...(values.has("--extension")
        ? { extensionFile: values.get("--extension") }
        : {}),
    };
  }
  const parameters: Record<string, number> = {};
  for (const [flag, key] of Object.entries(flags))
    if (values.has(flag)) parameters[key] = Number(values.get(flag));
  const profile = values.get("--profile") ?? "generic-demo@5";
  const match = /^([a-z0-9-]+)@([1-9][0-9]*)$/.exec(profile);
  if (!match)
    throw Error("Perfil: use id@versão (por exemplo generic-demo@5).");
  const plan = normalizeExperiment({
    schema: "viveiro-experiment-v1",
    seed: values.get("--seed") ?? "SEMENTE-42",
    days: values.has("--days") ? Number(values.get("--days")) : 1,
    startMode: values.get("--start") ?? "founding",
    biologicalProfile: { schema: 1, id: match[1], version: Number(match[2]) },
    parameters,
  });
  return {
    out,
    planFile: null,
    plan,
    ...(values.has("--extension")
      ? { extensionFile: values.get("--extension") }
      : {}),
  };
}
