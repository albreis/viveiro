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
  private generation = 0;
  private detail: "full" | "light";
  constructor(detail: "full" | "light" = "full") {
    this.detail = detail;
    try {
      this.worker = new Worker(
        new URL("../workers/soil.worker.ts", import.meta.url),
        { type: "module" },
      );
      this.worker.onmessage = ({
        data,
      }: {
        data: { mesh: SoilMeshData; revision: number; generation: number };
      }) => {
        this.busy = false;
        const done = this.callback;
        this.callback = null;
        if (data.generation === this.generation)
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
  setDetail(detail: "full" | "light") {
    if (this.detail !== detail) {
      this.detail = detail;
      this.generation++;
    }
  }
  request(
    nest: NestState,
    callback: (data: SoilMeshData, revision: number) => void,
  ) {
    if (this.busy) return;
    if (!this.worker) {
      callback(soilMeshData(nest, this.detail), nest.revision);
      return;
    }
    this.busy = true;
    this.callback = callback;
    this.worker.postMessage({
      nest,
      detail: this.detail,
      generation: this.generation,
    });
  }
  dispose() {
    this.worker?.terminate();
    this.worker = null;
    this.callback = null;
    this.busy = false;
  }
}
