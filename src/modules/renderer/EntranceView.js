import * as THREE from "three";
export class EntranceView {
  constructor(host) {
    this.host = host;
    this.views = new Map();
    this.geometry = new THREE.TorusGeometry(1, 0.2, 8, 32);
    this.material = host.material("#a18b60");
  }
  update(world) {
    const entry = world.nest.nodes.find(
      (n) => n.type === "entrance" && n.r > 0.1,
    );
    this.host.nestLabel &&
      (this.host.nestLabel.visible =
        !!entry &&
        !this.host.followId &&
        !["sealing", "structure"].includes(this.host.currentView));
    if (entry && this.host.nestLabel)
      this.host.nestLabel.position.set(entry.x, entry.y + 0.6, entry.z);
    world.nest.nodes.forEach((node, id) => {
      if (node.type !== "entrance") return;
      let rim = this.views.get(id);
      if (!rim) {
        rim = this.host.mesh(
          this.geometry,
          this.material,
          this.host.staticGroup,
        );
        rim.rotation.x = -Math.PI / 2;
        this.views.set(id, rim);
      }
      rim.position.set(node.x, node.y - 0.01, node.z);
      rim.scale.setScalar(node.r + 0.035);
    });
  }
}
