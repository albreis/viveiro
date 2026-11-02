import type { Object3D } from "three";
import type { NestState } from "../navigation/types.ts";
interface Host {
  nestLabel?: Object3D;
  followId?: number | null;
  currentView?: string;
}
/** The rounded lip belongs to the soil mesh; a separate ring cannot track its opening. */
export class EntranceView {
  private host: Host;
  constructor(host: Host) {
    this.host = host;
  }
  update(world: { nest: NestState }): void {
    const entry = world.nest.nodes.find(
        (n) => n.type === "entrance" && n.r > 0.1,
      ),
      label = this.host.nestLabel;
    if (!label) return;
    label.visible =
      !!entry &&
      !this.host.followId &&
      !["sealing", "structure", "brood"].includes(this.host.currentView ?? "");
    if (entry) label.position.set(entry.x, entry.y + 0.6, entry.z);
  }
}
