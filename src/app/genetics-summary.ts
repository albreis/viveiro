import type { Genome } from "../modules/genetics/genome.ts";
export function describeGenome(genome: Genome | undefined) {
  if (!genome) return "Herança não registrada";
  if (genome.origin === "legacy-inferred")
    return "Save anterior · ascendência não registrada";
  const ploidy = genome.ploidy === 1 ? "Haploide" : "Diploide";
  if (genome.origin === "founder") return ploidy + " · geração 0 · fundador(a)";
  const family =
    "mãe " +
    (genome.motherId ? "#" + genome.motherId : "desconhecida") +
    " · pai " +
    (genome.fatherId ? "#" + genome.fatherId : "não registrado");
  return (
    ploidy +
    " · geração " +
    genome.generation +
    " · " +
    family +
    " · " +
    genome.mutations.length +
    " mutação(ões)"
  );
}
