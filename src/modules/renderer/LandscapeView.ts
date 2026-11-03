import type { RenderWorld as World } from "./render-types.ts";
import type { Terrarium } from "./scene.ts";
import * as THREE from "three";
import { surfaceHeight, waterScale } from "../landscape/queries.ts";
import { seededRandom } from "../../libs/seeded-random.ts";
export class LandscapeView {
  host: Terrarium;
  water: {
    id: number;
    mesh: THREE.Mesh<THREE.CircleGeometry, THREE.MeshPhysicalMaterial>;
    base: ArrayLike<number>;
  }[];
  logs: { id: number; group: THREE.Group; bark: THREE.MeshStandardMaterial }[];
  rocks: {
    id: number;
    mesh: THREE.Mesh<THREE.DodecahedronGeometry, THREE.MeshStandardMaterial>;
  }[];
  grass: THREE.Group;
  grassMaterial: THREE.MeshStandardMaterial;
  constructor(host: Terrarium) {
    this.host = host;
    this.water = [];
    this.logs = [];
    this.rocks = [];
    const land = host.world.landscape;
    for (const p of land.ponds) {
      const geo = new THREE.CircleGeometry(1, 48);
      geo.rotateX(-Math.PI / 2);
      const m = host.mesh(
        geo,
        new THREE.MeshPhysicalMaterial({
          color: "#78a99a",
          roughness: 0.18,
          metalness: 0.1,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
        }),
        host.staticGroup,
      );
      m.castShadow = false;
      this.water.push({
        id: p.id,
        mesh: m,
        base: geo.attributes.position.array.slice(),
      });
      host.label("ÁGUA", p.x, 0.55, p.z);
    }
    for (const p of land.logs) {
      const group = new THREE.Group();
      group.position.set(
        p.x,
        surfaceHeight(land.relief, p.x, p.z) + p.radius * 0.8,
        p.z,
      );
      group.rotation.y = -p.angle;
      const bark = host.material("#76624b"),
        cut = host.material("#bea077");
      const cylinder = (
        length: number,
        radius: number,
        x = 0,
        z = 0,
        angle = 0,
      ) => {
        const m = host.mesh(
          new THREE.CylinderGeometry(radius * 0.88, radius, length, 14),
          [bark, cut, cut],
          group,
          x,
          0,
          z,
        );
        m.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(Math.cos(angle), 0, -Math.sin(angle)),
        );
      };
      if (p.kind === "stump") {
        const m = host.mesh(
          new THREE.CylinderGeometry(
            p.radius,
            p.radius * 1.15,
            p.radius * 2,
            14,
          ),
          [bark, cut, cut],
          group,
        );
      } else {
        cylinder(p.length, p.radius);
        if (p.kind === "forked")
          cylinder(
            p.length * 0.55,
            p.radius * 0.58,
            p.length * 0.12,
            -0.22,
            0.7,
          );
      }
      host.staticGroup.add(group);
      this.logs.push({ id: p.id, group, bark });
    }
    for (const p of land.rocks) {
      const m = host.mesh(
        new THREE.DodecahedronGeometry(p.radius, 1),
        host.material("#a6a18a"),
        host.staticGroup,
        p.x,
        surfaceHeight(land.relief, p.x, p.z) + p.radius * 0.3,
        p.z,
      );
      m.scale.set(1, 0.65, p.aspect);
      m.rotation.y = p.angle;
      this.rocks.push({ id: p.id, mesh: m });
    }
    this.grass = new THREE.Group();
    host.staticGroup.add(this.grass);
    const { range } = seededRandom(host.world.seed + ":understory");
    this.grassMaterial = host.material("#7a8d4f");
    for (let i = 0; i < 130; i++) {
      const x = range(-9, 9),
        z = range(-5.5, 5.5);
      if (
        host.world.inPond(x, z) ||
        host.world.nest.nodes.some(
          (n) => n.type === "entrance" && Math.hypot(n.x - x, n.z - z) < 0.9,
        )
      )
        continue;
      const m = host.mesh(
        new THREE.ConeGeometry(0.025, range(0.12, 0.28), 4),
        this.grassMaterial,
        this.grass,
        x,
        surfaceHeight(land.relief, x, z) + 0.09,
        z,
      );
      m.rotation.z = range(-0.2, 0.2);
    }
    this.update(host.world, 0);
  }
  update(world: World, time: number) {
    const land = world.landscape;
    for (const view of this.water) {
      const p = land.ponds.find((p) => p.id === view.id);
      if (!p) continue;
      const scale = waterScale(p),
        a = view.mesh.geometry.attributes.position,
        c = Math.cos(p.angle),
        s = Math.sin(p.angle);
      view.mesh.visible = scale > 0;
      for (let i = 0; i < a.count; i++) {
        const dx = view.base[i * 3] * p.rx * scale,
          dz = view.base[i * 3 + 2] * p.rz * scale;
        const x = p.x + dx * c - dz * s,
          z = p.z + dx * s + dz * c;
        a.setXYZ(
          i,
          x,
          surfaceHeight(land.relief, x, z) +
            0.02 +
            Math.sin(time * 1.4 + i * 0.3) * 0.0015,
          z,
        );
      }
      a.needsUpdate = true;
      view.mesh.geometry.computeBoundingSphere();
      view.mesh.material.opacity = 0.55 + p.volume * 0.3;
    }
    for (const view of this.logs) {
      const p = land.logs.find((p) => p.id === view.id);
      if (!p) continue;
      view.group.scale.setScalar(0.55 + p.integrity * 0.45);
      view.bark.color
        .set("#907452")
        .lerp(new THREE.Color("#4c5140"), p.moisture * 0.65 + p.decay * 0.25);
    }
    for (const view of this.rocks) {
      const p = land.rocks.find((p) => p.id === view.id);
      if (!p) continue;
      view.mesh.material.color
        .set("#b0a68b")
        .lerp(new THREE.Color("#62694b"), p.wetness * 0.45 + p.moss * 0.55);
      view.mesh.material.roughness = 1 - p.wetness * 0.3;
    }
    this.grassMaterial.color
      .set("#a19560")
      .lerp(new THREE.Color("#6d884b"), land.wetness);
    const mats = Array.isArray(this.host.soil.material)
      ? this.host.soil.material
      : [this.host.soil.material];
    for (const mat of mats)
      mat.color
        .set("#ffffff")
        .lerp(new THREE.Color("#a7ad94"), land.wetness * 0.38);
  }
}
