import { recoverStall } from "../navigation/stall-recovery.ts";
import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import { roomNode } from "../colony/rooms.ts";
import { requestRoute } from "../navigation/local-routing.ts";
export function updateSexualAgent(
  w: ColonyWorld,
  a: ColonyAgent,
  dead: Set<number>,
) {
  if (!a.sexual) return false;
  a.energy -= 0.012;
  if (a.energy <= 0 || a.age > 25) {
    dead.add(a.id);
    a.deathCause = "starvation";
    w.log("Um alado não sobreviveu até a próxima janela de voo.", "danger");
    return true;
  }
  if (!a.departure) {
    a.state =
      a.age < 1 ? "Alado em maturação" : "Alado aguardando chuva e calor";
    return true;
  }
  if (recoverStall(w, a)) return true;
  if (a.node !== null) {
    if (!a.route.length)
      requestRoute(
        w,
        a,
        roomNode(w.nest, "entrance", a.id % 2, a.colonyId || 1),
      );
    w.moveInNest(a);
  }
  a.state =
    a.node === null ? "Alado pronto para decolar" : "Alado saindo para o voo";
  return true;
}
