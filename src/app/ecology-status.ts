import type { EcologyState } from "../modules/ecology/types.ts";
export function renderEcologyStatus(e?: EcologyState) {
  const target = document.getElementById("ecology-status");
  if (!target) return;
  const f = (n: number) =>
    n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
  target.textContent = e
    ? Math.floor(e.aphids.reduce((n, a) => n + a.count, 0)) +
      " pulgões em " +
      e.aphids.filter((a) => a.count >= 1).length +
      " plantas · " +
      f(e.aphids.reduce((n, a) => n + a.honey, 0)) +
      " u. de melaço. Coletado: " +
      f(e.honeyCollected) +
      " u. · " +
      e.adoptions +
      " lagarta(s) adotada(s), " +
      e.rejections +
      " recusa(s). Alimento cedido às lagartas: " +
      f(e.parasiteFed) +
      " u."
    : "As relações ecológicas aparecem conforme o tempo avança.";
  const button = document.getElementById(
    "focus-ecology",
  ) as HTMLButtonElement | null;
  if (button)
    button.disabled =
      !e ||
      !(
        e.aphids.some((a) => a.count >= 1) ||
        e.mimics.some((m) => m.status !== "dead")
      );
}
