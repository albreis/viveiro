import { t as text } from "../../i18n/runtime.ts";
import type { FamilyWorld } from "../colonies/types.ts";
import type { PerspectiveCamera } from "three";
import type { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { surfaceHeight } from "../landscape/queries.ts";
interface FocusHost {
  world: FamilyWorld;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  ecologyFocus?: number;
  currentView: unknown;
  stopFollowing(): void;
  setInterior(visible: boolean): void;
}
export function focusEcology(host: FocusHost) {
  const w = host.world,
    e = w.ecology;
  const targets = [
    ...(e?.aphids || []).flatMap((a) => {
      const p = w.plants.find((p) => p.id === a.plant);
      return p && a.count >= 1
        ? [
            {
              x: p.x,
              y: surfaceHeight(w.nest.relief, p.x, p.z),
              z: p.z,
              inside: false,
              label: text("scene.ecology.aphids", { id: p.id }),
            },
          ]
        : [];
    }),
    ...(e?.mimics || [])
      .filter((m) => m.status !== "dead")
      .map((m) => ({
        x: m.x,
        y: m.y,
        z: m.z,
        inside: m.status === "adopted" || m.y < -0.1,
        label:
          m.status === "adopted"
            ? text("scene.ecology.adopted")
            : text("scene.ecology.mimic"),
      })),
  ];
  if (!targets.length) return text("scene.ecology.empty");
  const t = targets[(host.ecologyFocus || 0) % targets.length];
  host.ecologyFocus = (host.ecologyFocus || 0) + 1;
  host.stopFollowing();
  host.currentView = "ecology";
  host.controls.minDistance = 1.6;
  host.camera.position.set(t.x + 1.3, t.y + 1.25, t.z + 1.7);
  host.controls.target.set(t.x, t.y + 0.05, t.z);
  host.controls.update();
  if (t.inside) host.setInterior(true);
  return t.label;
}
