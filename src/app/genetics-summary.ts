import type { Genome } from "../modules/genetics/genome.ts";
import { t } from "../i18n/runtime.ts";
export function describeGenome(genome: Genome | undefined) {
  if (!genome) return t("terrarium.ant.noGenome");
  if (genome.origin === "legacy-inferred") return t("status.genome.legacy");
  const ploidy = t(
    genome.ploidy === 1 ? "status.genome.haploid" : "status.genome.diploid",
  );
  if (genome.origin === "founder")
    return t("status.genome.founder", { ploidy });
  return t("status.genome.summary", {
    ploidy,
    generation: genome.generation,
    mother: genome.motherId ? "#" + genome.motherId : t("status.genome.mother"),
    father: genome.fatherId ? "#" + genome.fatherId : t("status.genome.father"),
    mutations: genome.mutations.length,
  });
}
