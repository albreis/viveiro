import {
  normalizeParameterProfile,
  parameterProfileKey,
  type ParameterProfile,
} from "../modules/parameter-profiles/profile.ts";
export const parameterProfilesKey = "viveiro.parameter-profiles.v1";
type Store = Pick<Storage, "getItem" | "setItem">;
export function readParameterProfiles(
  store: Store = localStorage,
): ParameterProfile[] {
  const raw = store.getItem(parameterProfilesKey);
  if (raw === null) return [];
  if (new TextEncoder().encode(raw).length > 262144)
    throw Error("Biblioteca de perfis excede 256KiB.");
  const values: unknown = JSON.parse(raw);
  if (!Array.isArray(values) || values.length > 100)
    throw Error("Biblioteca de perfis inválida ou acima de 100 versões.");
  const profiles = values.map(normalizeParameterProfile),
    seen = new Set<string>();
  for (const p of profiles) {
    const key = parameterProfileKey(p);
    if (seen.has(key)) throw Error("Versão duplicada na biblioteca: " + key);
    seen.add(key);
  }
  return profiles;
}
export function checkParameterProfileVersion(
  value: unknown,
  store: Store = localStorage,
): ParameterProfile {
  const p = normalizeParameterProfile(value),
    prior = readParameterProfiles(store).find(
      (item) => parameterProfileKey(item) === parameterProfileKey(p),
    );
  if (prior && JSON.stringify(prior) !== JSON.stringify(p))
    throw Error(
      "Essa versão já existe com outros valores. Aumente a versão para preservar o original.",
    );
  return p;
}
export function saveParameterProfile(
  value: unknown,
  store: Store = localStorage,
): ParameterProfile {
  const p = checkParameterProfileVersion(value, store),
    profiles = readParameterProfiles(store),
    prior = profiles.find(
      (item) => parameterProfileKey(item) === parameterProfileKey(p),
    );
  if (prior) {
    if (JSON.stringify(prior) !== JSON.stringify(p))
      throw Error(
        "Essa versão já existe com outros valores. Aumente a versão para preservar o original.",
      );
    return prior;
  }
  if (profiles.length >= 100)
    throw Error(
      "Limite de 100 versões locais; exporte os perfis antes de continuar.",
    );
  const encoded = JSON.stringify([...profiles, p]);
  if (new TextEncoder().encode(encoded).length > 262144)
    throw Error("Biblioteca de perfis excede 256KiB.");
  store.setItem(parameterProfilesKey, encoded);
  return p;
}
