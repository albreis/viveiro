import type { FoundingState } from "../modules/founding/types.ts";
const number = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
const labels: Record<FoundingState["phase"], string> = {
  weather: "Aguardando janela de voo",
  flight: "Voo nupcial",
  landing: "Acasalamento concluído · pouso",
  dealate: "Perda das asas",
  digging: "Escavação do primeiro abrigo",
  sealing: "Fechamento da entrada",
  claustral: "Fundação claustral",
  semiclaustral: "Fundação semiclaustral",
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
    " viagens de terra." +
    (f.foraging
      ? " Coleta da rainha: " +
        f.foraging.trips +
        " viagem(ns) · alimento na câmara " +
        number(f.foraging.pantry) +
        " u. · carga " +
        number(f.foraging.load) +
        " u. · consumido " +
        number(f.foraging.consumed) +
        " u."
      : "") +
    (f.seal
      ? " Tampão: " +
        {
          collect: "recolhendo material",
          return: "transportando",
          build: "construindo",
          closed: "fechado",
          remove: "nanítica escavando",
          haul: "retirando terra",
          opened: "reaberto",
        }[f.seal.phase] +
        " · " +
        f.seal.trips +
        " viagens de reabertura."
      : "")
  );
}
export function renderFoundingStatus(f?: FoundingState) {
  const target = document.getElementById("founding-status");
  if (!target) return;
  target.textContent =
    foundingDescription(f) || "Ninho de versão anterior preservado.";
}
