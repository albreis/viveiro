import type { FoundingState } from "../modules/founding/types.ts";
const labels: Record<FoundingState["phase"], string> = {
  weather: "Aguardando janela de voo",
  flight: "Voo nupcial",
  landing: "Acasalamento concluído · pouso",
  dealate: "Perda das asas",
  digging: "Escavação do primeiro abrigo",
  claustral: "Fundação claustral",
  established: "Colônia fundada",
  failed: "Fundação interrompida",
};
export function foundingDescription(f?: FoundingState) {
  if (!f) return undefined;
  const reserve = f.reserves.toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  });
  return (
    labels[f.phase] +
    " · reserva materna " +
    reserve +
    "/" +
    f.initialReserves +
    " u. · " +
    f.nanitics +
    " naníticas · " +
    f.trips +
    " viagens de terra."
  );
}
export function renderFoundingStatus(f?: FoundingState) {
  const target = document.getElementById("founding-status");
  if (!target) return;
  target.textContent =
    foundingDescription(f) || "Ninho de versão anterior preservado.";
}
