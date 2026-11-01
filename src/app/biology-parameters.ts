import { biologicalParameters } from "../modules/biology/catalog.ts";
import { biologicalSources } from "../modules/biology/sources.ts";
import type { EvidenceKind, ParameterTopic } from "../modules/biology/types.ts";
const labels: Record<EvidenceKind, string> = {
  approximation: "Aproximação do modelo",
  hypothesis: "Hipótese não verificada",
  protocol: "Condição experimental",
  measurement: "Medido no estudo",
};
const number = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
export function renderBiologicalParameters(
  topic: ParameterTopic,
  revision = 1,
): void {
  const list = document.getElementById("biology-records")!;
  list.replaceChildren();
  for (const record of biologicalParameters.filter(
    (p) => p.topic === topic && (p.minModelRevision ?? 1) <= revision,
  )) {
    const item = document.createElement("li"),
      name = document.createElement("strong"),
      value = document.createElement("span"),
      kind = document.createElement("em"),
      context = document.createElement("p"),
      origin = document.createElement("p");
    name.textContent = record.label;
    value.textContent =
      (record.range
        ? record.range.map(number).join("–")
        : record.value !== null
          ? number(record.value)
          : "Não informado") +
      " " +
      record.unit;
    kind.textContent = labels[record.evidence] + " · v" + record.version;
    kind.dataset.evidence = record.evidence;
    context.textContent =
      record.context +
      " " +
      (record.application === "simulation"
        ? "Usado no modelo."
        : record.application === "preset"
          ? "Só clima inicial do perfil de referência."
          : "Não altera a simulação.");
    const source = biologicalSources.find((s) => s.id === record.source)!,
      link = source.url
        ? document.createElement("a")
        : document.createElement("span");
    link.textContent = source.title;
    if (link instanceof HTMLAnchorElement) {
      link.href = source.url!;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    origin.append(
      link,
      document.createTextNode(
        " · " +
          (record.sample !== null
            ? "n=" + record.sample
            : record.evidence === "approximation"
              ? "sem aferição"
              : "n não informado") +
          ". " +
          record.uncertainty +
          ".",
      ),
    );
    item.append(name, value, kind, context, origin);
    list.append(item);
  }
}
