import * as THREE from "three";
import type { ColonyAgent } from "../colony/types.ts";
import type { FoundingState } from "../founding/types.ts";
import { queenWings, poseFounder } from "./founder-pose.ts";
import { DiscardedWingsView } from "./discarded-wings.ts";
interface FounderView {
  body: THREE.Group;
  wings?: THREE.Group;
  legs: { mesh: THREE.Object3D; x: number; z: number }[];
}
export class FoundersView {
  private views = new Map<number, FounderView>();
  private discarded: DiscardedWingsView;
  private queenUsed = false;
  private maleUsed = false;
  constructor(
    private scene: THREE.Scene,
    private queen: THREE.Group,
    private male: THREE.Group,
    private buildQueen: () => THREE.Group,
    private buildMale: () => THREE.Group,
    private supports: () => THREE.Mesh[],
  ) {
    this.discarded = new DiscardedWingsView(scene);
  }
  private view(a: ColonyAgent) {
    let v = this.views.get(a.id);
    if (v) return v;
    const female = a.kind !== "male",
      body = female
        ? this.queenUsed
          ? this.buildQueen()
          : this.queen
        : this.maleUsed
          ? this.buildMale()
          : this.male;
    if (female) this.queenUsed = true;
    else this.maleUsed = true;
    const wings = female ? queenWings() : undefined;
    const legs = body.children
      .filter(
        (m) =>
          m instanceof THREE.Mesh && m.geometry.type === "CylinderGeometry",
      )
      .map((mesh) => ({ mesh, x: mesh.rotation.x, z: mesh.rotation.z }));
    if (wings) body.add(wings);
    body.userData.antId = a.id;
    this.scene.add(body);
    v = { body, wings, legs };
    this.views.set(a.id, v);
    return v;
  }
  objects(includeHidden = false) {
    return [...this.views.values()]
      .filter((v) => includeHidden || v.body.visible)
      .map((v) => v.body);
  }
  pickId(object: THREE.Object3D): number | undefined {
    for (let p: THREE.Object3D | null = object; p; p = p.parent)
      if (p.userData.antId) return p.userData.antId;
    return undefined;
  }
  update(
    ants: ColonyAgent[],
    founding: FoundingState | undefined,
    pose: (a: ColonyAgent) => THREE.Vector3,
    follow: number | null,
    time: number,
    foundings?: { state: FoundingState }[],
  ) {
    for (const v of this.views.values()) v.body.visible = false;
    this.queen.visible = false;
    this.male.visible = false;
    for (const a of ants.filter(
      (a) => a.kind === "queen" || a.kind === "male" || a.kind === "gyne",
    )) {
      const v = this.view(a);
      v.body.visible = a.id !== follow;
      poseFounder(v.body, a, pose(a));
      if (v.wings) {
        v.wings.visible = !!a.winged;
        v.wings.children.forEach(
          (w, i) =>
            (w.rotation.x = a.airborne
              ? Math.sin(time * 42 + (i % 2) * Math.PI) * 0.35
              : 0),
        );
      }
      v.legs.forEach((l, i) => {
        const swing = a.airborne
          ? 0
          : Math.sin((a.distanceWalked || 0) * 22 + (i * Math.PI) / 2) * 0.22;
        l.mesh.rotation.x = l.x + swing;
        l.mesh.rotation.z = l.z + swing * 0.4;
      });
    }
    const wings = foundings
      ? foundings.flatMap((f) => f.state.discardedWings)
      : founding?.discardedWings || [];
    this.discarded.update(wings, this.supports());
  }
}
