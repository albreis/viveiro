import { updatePlant } from "./plants.js";
import { surfaceHeight } from "../landscape/queries.ts";
import * as THREE from "three";
import { NEST, LIMIT, hashSeed } from "../simulation/world.js";
import { geometryFromSoilData } from "../terrain/soil.js";
import { tunnelEnvelope } from "../terrain/terrain.js";
const UP = new THREE.Vector3(0, 1, 0);

export function update(host, world, time, alpha = 1) {
  host.alpha = alpha;
  document.getElementById("biome-label").textContent = {
    woodland: "Bosque",
    scrub: "Vegetação árida",
    meadow: "Pradaria",
  }[world.landscape.biome];
  if (
    (host.soilNest !== world.nest ||
      host.soilRevision !== world.nest.revision) &&
    time - host.lastSoilBuild > 1.5
  ) {
    host.lastSoilBuild = time;
    host.soilMesher.request(world.nest, (data, revision) => {
      if (host.world.nest !== world.nest) return;
      host.soil.geometry.dispose();
      host.soil.geometry = geometryFromSoilData(data);
      host.soilRevision = revision;
      host.soilNest = world.nest;
    });
  }
  host.world = world;
  host.lastTick = world.tick;
  host.sun.intensity = 2.2 + world.params.light / 30;
  host.landscapeView.update(world, time);
  host.entranceView.update(world);
  for (const p of world.plants) {
    let g = host.plantViews.get(p.id);
    if (!g) {
      g = host.buildPlant(p);
      host.plantViews.set(p.id, g);
    }
    updatePlant(g, p, time);
  }
  const patchIds = new Set(world.patches.map((p) => p.id));
  for (const [id, view] of host.foodViews)
    if (!patchIds.has(id)) {
      host.foodGroup.remove(view);
      view.geometry.dispose();
      view.material.dispose();
      host.foodViews.delete(id);
    }
  for (const p of world.patches) {
    let m = host.foodViews.get(p.id);
    if (!m) {
      m = host.mesh(
        new THREE.DodecahedronGeometry(0.16, 0),
        host.material("#c9a24f"),
        host.foodGroup,
        p.x,
        surfaceHeight(world.nest.relief, p.x, p.z) + 0.12,
        p.z,
      );
      host.foodViews.set(p.id, m);
    }
    m.visible = p.amount > 0.06;
    m.scale.setScalar(0.5 + Math.sqrt(p.amount) * 0.32);
  }
  host.soilView.update(world, (a) => host.pose(a), host.followId);
  host.visibleWorkers = world.workers.filter((a) => a.id !== host.followId);
  host.updateAnts(host.visibleWorkers, host.antParts, false, time);
  host.updateAnts(world.predators, host.predatorParts, true, time);
  const queen = world.ants.find((a) => a.kind === "queen");
  host.queen.visible = !!queen && queen.id !== host.followId;
  if (queen) {
    host.queen.position.set(queen.x, (queen.y || 0) + 0.07, queen.z);
    host.queen.rotation.y = 0.6;
  }
  const male = world.ants.find((a) => a.kind === "male");
  host.male.visible = !!male && male.id !== host.followId;
  if (male) {
    host.male.position.set(male.x, (male.y || 0) + 0.12, male.z);
    host.male.rotation.y = Math.sin(time) * 0.3;
  }
  host.colonyView.update(world, (a) => host.pose(a), host.followId);
  host.trails.visible = host.showTrails;
  if (host.showTrails) {
    const colors = host.trails.geometry.attributes.color;
    for (let i = 0; i < 1040; i++) {
      const v = Math.min(1, world.pheromones[i] / 2);
      colors.setXYZ(i, v * 0.7, v, v * 0.2);
    }
    colors.needsUpdate = true;
  }
  if (host.followId) {
    const ant = world.ants.find((a) => a.id === host.followId);
    if (!ant) {
      host.stopFollowing();
      host.onFollowEnded?.();
    } else {
      const heading = ant.kind === "queen" ? -0.6 : ant.angle,
        pitch = ant.pitch || 0;
      const normal = new THREE.Vector3(
        ant.normal?.x || 0,
        ant.normal?.y ?? 1,
        ant.normal?.z || 0,
      ).normalize();
      const forward = new THREE.Vector3(
        Math.cos(heading) * Math.cos(pitch),
        Math.sin(pitch),
        Math.sin(heading) * Math.cos(pitch),
      ).normalize();
      const side = forward.clone().cross(normal).normalize();
      const eye = host
        .pose(ant)
        .addScaledVector(normal, 0.16)
        .addScaledVector(forward, 0.06);
      if (ant.y < -0.1 && normal.y > 0.5) {
        const envelope = tunnelEnvelope(
          world.nest,
          eye.x,
          eye.z,
          ant.tunnelY ?? ant.y,
        );
        if (envelope.inside)
          eye.y = Math.max(
            envelope.floor + 0.08,
            Math.min(envelope.ceiling - 0.05, eye.y),
          );
      }
      host.camera.position.copy(eye);
      const direction = forward
        .applyAxisAngle(normal, -host.lookYaw)
        .applyAxisAngle(side, host.lookPitch);
      const rotation = new THREE.Matrix4().lookAt(
        eye,
        eye.clone().add(direction),
        normal,
      );
      host.camera.quaternion.slerp(
        new THREE.Quaternion().setFromRotationMatrix(rotation),
        0.24,
      );
      host.followLight.position.copy(eye);
      host.followLight.intensity = ant.y < -0.1 ? 1.8 : 0;
    }
  }
}
