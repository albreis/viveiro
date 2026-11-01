import * as THREE from "three";
import type { NestState } from "../navigation/types.ts";
import type { SocialChemistry } from "../social-chemistry/types.ts";
import { surfaceHeight } from "../landscape/queries.ts";
import { colonyColor } from "../../libs/colony-colors.ts";
export class TrailView {
  readonly points: THREE.Points;
  private anchors: Float32Array;
  constructor(scene: THREE.Scene, nest: NestState) {
    const positions = new Float32Array(1040 * 3),
      colors = new Float32Array(1040 * 3);
    for (let z = 0; z < 26; z++)
      for (let x = 0; x < 40; x++) {
        const i = z * 40 + x,
          px = ((x + 0.5) / 40) * 20 - 10,
          pz = ((z + 0.5) / 26) * 13 - 6.5;
        positions.set(
          [px, surfaceHeight(nest.relief, px, pz) + 0.045, pz],
          i * 3,
        );
      }
    this.anchors = positions.slice();
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.16,
        vertexColors: true,
        transparent: true,
        opacity: 0.58,
        depthWrite: false,
      }),
    );
    this.points.visible = false;
    scene.add(this.points);
  }
  update(
    w: { pheromones: number[]; socialChemistry?: SocialChemistry },
    visible: boolean,
  ) {
    this.points.visible = visible;
    if (!visible) return;
    const positions = this.points.geometry.attributes.position,
      colors = this.points.geometry.attributes.color,
      fields = Object.entries(w.socialChemistry?.territory || {}),
      c = new THREE.Color();
    let count = 0;
    for (let i = 0; i < 1040; i++) {
      let mass = 0,
        owner = 1;
      for (const [id, f] of fields)
        if ((f[i] || 0) > mass) {
          mass = f[i];
          owner = Number(id);
        }
      c.set(mass > 0.02 ? colonyColor(owner) : "#9ac650");
      const strength = Math.min(1, (w.pheromones[i] || 0) * 0.5 + mass * 2);
      if (strength < 0.018) continue;
      const intensity = 0.35 + strength * 0.65;
      positions.setXYZ(
        count,
        this.anchors[i * 3],
        this.anchors[i * 3 + 1],
        this.anchors[i * 3 + 2],
      );
      colors.setXYZ(count++, c.r * intensity, c.g * intensity, c.b * intensity);
    }
    this.points.geometry.setDrawRange(0, count);
    positions.needsUpdate = true;
    colors.needsUpdate = true;
  }
}
