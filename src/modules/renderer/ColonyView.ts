import { FoodStoresView } from "./FoodStoresView.ts";
import * as THREE from "three";
import type { ColonyWorld, ColonyAgent } from "../colony/types.ts";
import { broodStage } from "../colony/brood.ts";

export class ColonyView {
  private stocks: FoodStoresView;
  private stages: THREE.InstancedMesh[];
  private waste: THREE.InstancedMesh;
  private loads: THREE.InstancedMesh;
  private dummy = new THREE.Object3D();
  constructor(scene: THREE.Scene, capacity: number) {
    this.stocks = new FoodStoresView(scene);
    this.stages = [0xeee4b9, 0xd3c39c, 0xc9b389, 0xb39a70].map((color) =>
      this.mesh(scene, new THREE.SphereGeometry(0.075, 8, 6), color, capacity),
    );
    this.waste = this.mesh(
      scene,
      new THREE.DodecahedronGeometry(1, 0),
      0xffffff,
      600,
    );
    this.loads = this.mesh(
      scene,
      new THREE.SphereGeometry(0.06, 7, 5),
      0xffffff,
      capacity,
    );
  }
  private mesh(
    scene: THREE.Scene,
    geometry: THREE.BufferGeometry,
    color: number,
    capacity: number,
  ) {
    const mesh = new THREE.InstancedMesh(
      geometry,
      new THREE.MeshStandardMaterial({ color, roughness: 1 }),
      capacity,
    );
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);
    return mesh;
  }
  private mouth(ant: ColonyAgent, pose: (a: ColonyAgent) => THREE.Vector3) {
    return pose(ant)
      .addScaledVector(
        new THREE.Vector3(
          ant.normal?.x || 0,
          ant.normal?.y ?? 1,
          ant.normal?.z || 0,
        ),
        0.14,
      )
      .add(
        new THREE.Vector3(
          Math.cos(ant.angle) * 0.23,
          Math.sin(ant.pitch || 0) * 0.23,
          Math.sin(ant.angle) * 0.23,
        ),
      );
  }
  update(
    world: ColonyWorld,
    pose: (a: ColonyAgent) => THREE.Vector3,
    followId: number | null,
    visibleIds?: ReadonlySet<number>,
  ) {
    this.stocks.update(world);
    const d = this.dummy,
      ants = new Map(world.ants.map((a) => [a.id, a])),
      counts = [0, 0, 0, 0];
    for (const b of world.brood) {
      let index =
        broodStage(b.age) === "egg" ? 0 : broodStage(b.age) === "larva" ? 1 : 2;
      if (index === 2 && b.cocoon?.built) index = 3;
      const mesh = this.stages[index],
        i = counts[index];
      if (i >= mesh.instanceMatrix.count) continue;
      const carrier = b.carrier === undefined ? null : ants.get(b.carrier);
      if (carrier && visibleIds && !visibleIds.has(carrier.id)) continue;
      if (carrier) d.position.copy(this.mouth(carrier, pose));
      else d.position.set(b.x, b.y, b.z);
      d.rotation.set(0, b.id * 2.4, 0);
      d.scale.set(
        index === 1 ? 0.75 : index === 3 ? 0.85 : 0.65,
        index === 3 ? 0.85 : 0.65,
        index === 1 ? 1.7 : index === 3 ? 1.7 : index === 2 ? 1.4 : 1.1,
      );
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
      const stress = b.development?.stress || 0;
      mesh.setColorAt(
        i,
        new THREE.Color(1, 1 - stress * 0.6, 1 - stress * 0.75),
      );
      counts[index]++;
    }
    this.stages.forEach((m, i) => {
      m.count = counts[i];
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    });
    const litter = (world.colony?.waste || [])
      .filter((w) => !w.carrier)
      .slice(0, this.waste.instanceMatrix.count);
    litter.forEach((w, i) => {
      d.position.set(w.x, w.y, w.z);
      d.rotation.set(0, w.id, 0);
      const size = Math.min(0.18, Math.cbrt(w.mass) * 0.25);
      d.scale.set(
        size,
        w.kind === "corpse" ? size * 0.35 : size * 0.6,
        size * 1.3,
      );
      d.updateMatrix();
      this.waste.setMatrixAt(i, d.matrix);
      this.waste.setColorAt(
        i,
        new THREE.Color(w.kind === "corpse" ? 0x543c2e : 0xb39a67),
      );
    });
    this.waste.count = litter.length;
    this.waste.instanceMatrix.needsUpdate = true;
    if (this.waste.instanceColor) this.waste.instanceColor.needsUpdate = true;
    let n = 0;
    for (const ant of world.ants) {
      if (visibleIds && !visibleIds.has(ant.id)) continue;
      if (
        (!ant.carrying && !ant.carryingWaste && !ant.seedRation) ||
        ant.id === followId
      )
        continue;
      d.position.copy(this.mouth(ant, pose));
      d.rotation.set(0, ant.id, 0);
      d.scale.setScalar(1);
      d.updateMatrix();
      this.loads.setMatrixAt(n, d.matrix);
      this.loads.setColorAt(
        n,
        new THREE.Color(ant.carryingWaste ? 0x543c2e : 0xc9a24f),
      );
      n++;
    }
    this.loads.count = n;
    this.loads.instanceMatrix.needsUpdate = true;
    if (this.loads.instanceColor) this.loads.instanceColor.needsUpdate = true;
  }
}
