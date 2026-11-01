import type { NestState } from "../modules/navigation/types.ts";
import {
  soilMeshData,
  type SoilMeshData,
} from "../modules/terrain/mesh-data.ts";

export class SoilMesher {
  private worker: Worker | null = null;
  private callback: ((data: SoilMeshData, revision: number) => void) | null =
    null;
  busy = false;
  constructor() {
    try {
      this.worker = new Worker(
        new URL("../workers/soil.worker.ts", import.meta.url),
        { type: "module" },
      );
      this.worker.onmessage = ({
        data,
      }: {
        data: { mesh: SoilMeshData; revision: number };
      }) => {
        this.busy = false;
        const done = this.callback;
        this.callback = null;
        done?.(data.mesh, data.revision);
      };
      this.worker.onerror = () => {
        this.worker?.terminate();
        this.worker = null;
        this.busy = false;
        this.callback = null;
      };
    } catch {
      this.worker = null;
    }
  }
  request(
    nest: NestState,
    callback: (data: SoilMeshData, revision: number) => void,
  ) {
    if (this.busy) return;
    if (!this.worker) {
      callback(soilMeshData(nest), nest.revision);
      return;
    }
    this.busy = true;
    this.callback = callback;
    this.worker.postMessage({ nest });
  }
  dispose() {
    this.worker?.terminate();
    this.worker = null;
    this.callback = null;
    this.busy = false;
  }
}
