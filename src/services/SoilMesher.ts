import type { NestState } from "../modules/navigation/types.ts";
import {
  soilMeshData,
  type SoilMeshData,
} from "../modules/terrain/mesh-data.ts";

export class SoilMesher {
  private worker: Worker | null = null;
  private callback: ((data: SoilMeshData, revision: number) => void) | null =
    null;
  private failed: (() => void) | null = null;
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
        const failed = this.failed;
        this.callback = this.failed = null;
        if (data.generation === this.generation)
          done?.(data.mesh, data.revision);
        else failed?.();
      };
      this.worker.onerror = () => this.fallback();
      this.worker.onmessageerror = () => this.fallback();
    } catch {
      this.worker = null;
    }
  }
  private fallback() {
    const failed = this.failed;
    this.dispose();
    failed?.();
  }
  setDetail(detail: "full" | "light") {
    if (this.detail !== detail) {
      this.detail = detail;
      this.generation++;
    }
  }
  prepare(nest: NestState): Promise<SoilMeshData> {
    if (this.busy) return Promise.reject(new Error("Soil mesh is busy"));
    return new Promise((resolve, reject) => {
      this.request(nest, resolve, () => {
        try {
          resolve(soilMeshData(nest, this.detail));
        } catch (error) {
          reject(error);
        }
      });
    });
  }
  request(
    nest: NestState,
    callback: (data: SoilMeshData, revision: number) => void,
    failed?: () => void,
  ) {
    if (this.busy) return;
    if (!this.worker) {
      callback(soilMeshData(nest, this.detail), nest.revision);
      return;
    }
    this.busy = true;
    this.callback = callback;
    this.failed = failed ?? null;
    try {
      this.worker.postMessage({
        nest,
        detail: this.detail,
        generation: this.generation,
      });
    } catch {
      this.fallback();
    }
  }
  dispose() {
    this.worker?.terminate();
    this.worker = null;
    this.callback = this.failed = null;
    this.busy = false;
  }
}
