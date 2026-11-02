import { modelMath } from "../../libs/model-math.ts";
import { registerMating } from "../fertility/model.ts";
import { beginSiteSurvey } from "../chambers/survey.ts";
import { outsideSite } from "./site.ts";
import type { FoundingState, FoundingWorld } from "./types.ts";
import { changePhase, founder } from "./types.ts";
import type { ColonyAgent } from "../colony/types.ts";
import type { Vec3 } from "../navigation/types.ts";
import { surfaceHeight } from "../landscape/queries.ts";
function fly(ant: ColonyAgent, target: Vec3, speed: number) {
  const dx = target.x - ant.x,
    dy = target.y - (ant.y || 0),
    dz = target.z - ant.z,
    d = modelMath.hypot(dx, dy, dz);
  const t = Math.min(1, speed / (d || 1));
  ant.x += dx * t;
  ant.y = (ant.y || 0) + dy * t;
  ant.z += dz * t;
  ant.angle = modelMath.atan2(dz, dx);
  ant.pitch = modelMath.atan2(dy, modelMath.hypot(dx, dz));
  ant.normal = { x: 0, y: 1, z: 0 };
  return d <= speed;
}
/** Probabilistic window with an explicit recent-rain memory; coefficients are exploratory. */
export function flightReadiness(
  world: FoundingWorld,
  memory: Pick<FoundingState, "lastRain"> | undefined = world.founding,
) {
  const f = memory;
  if (!f) return 0;
  if (world.landscape.rainPulse > 0.15) f.lastRain = world.tick;
  if (
    world.tick - f.lastRain > 300 ||
    world.params.humidity < 45 ||
    world.params.humidity > 88 ||
    world.params.light < 45
  )
    return 0;
  return (
    0.04 + 0.12 * Math.max(0, 1 - Math.abs(world.params.humidity - 65) / 25)
  );
}
export function landMale(world: FoundingWorld) {
  const f = world.founding!,
    male = world.ants.find((a) => a.kind === "male");
  if (!male || f.matedTick === undefined) return;
  const x = f.site.x - 0.65,
    z = f.site.z;
  male.airborne = !fly(
    male,
    { x, y: surfaceHeight(world.nest.relief, x, z) + 0.008, z },
    0.075,
  );
  male.state = male.airborne
    ? "Pousando após o acasalamento"
    : "Fim do ciclo reprodutivo";
}
export function updateFlight(world: FoundingWorld) {
  const f = world.founding!,
    queen = founder(world),
    male = world.ants.find((a) => a.kind === "male");
  if (!queen) return;
  if (f.phase === "weather") {
    const ready = flightReadiness(world);
    if (male && world.tick - f.since >= 10 && world.random() < ready)
      changePhase(
        world,
        "flight",
        "O tempo favoreceu o voo nupcial. Os alados decolaram.",
      );
    return;
  }
  if (f.phase === "flight") {
    if (!male) {
      changePhase(
        world,
        "failed",
        "O voo terminou sem parceiro. Esta fundação não produziu operárias.",
      );
      return;
    }
    const t = world.tick - f.since,
      orbit = Math.max(0, 1 - t / 55),
      angle = t * 0.08;
    const target = {
      x: f.site.x + modelMath.cos(angle) * orbit * 0.7,
      y: f.site.y + 1.35,
      z: f.site.z + modelMath.sin(angle) * orbit * 0.7,
    };
    fly(queen, target, 0.075);
    fly(male, { x: queen.x + 0.16, y: (queen.y || 0) + 0.04, z: queen.z }, 0.1);
    queen.airborne = male.airborne = true;
    queen.state = male.state = "Voo nupcial";
    if (
      t >= 60 &&
      modelMath.hypot(
        queen.x - male.x,
        (queen.y || 0) - (male.y || 0),
        queen.z - male.z,
      ) < 0.3
    ) {
      for (const partner of world.ants)
        if (partner.kind === "male") registerMating(world, queen, partner);
      f.matedTick = world.tick;
      changePhase(
        world,
        "landing",
        "O acasalamento ocorreu no ar. A rainha procura um ponto de fundação.",
      );
    }
  } else if (f.phase === "landing") {
    const { x, z } = outsideSite(f, 0.65);
    queen.state = "Pousando para fundar";
    if (
      fly(
        queen,
        { x, y: surfaceHeight(world.nest.relief, x, z) + 0.008, z },
        0.07,
      )
    ) {
      queen.airborne = false;
      queen.pitch = 0;
      changePhase(
        world,
        "dealate",
        "A rainha pousou e começou a soltar as asas.",
      );
    }
  } else if (f.phase === "dealate" && world.tick - f.since >= 12) {
    queen.winged = false;
    for (let i = 0; i < 4; i++)
      f.discardedWings.push({
        x: queen.x + (i % 2 ? 1 : -1) * 0.16,
        y: (queen.y || 0) + 0.012,
        z: queen.z + (i < 2 ? 0.13 : -0.13),
      });
    if (beginSiteSurvey(world)) return;
    changePhase(
      world,
      "digging",
      "Sem asas, a rainha começa a escavar o primeiro abrigo.",
    );
  }
}
