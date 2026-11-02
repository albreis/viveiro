import type { NestState } from "../modules/navigation/types.ts";
import { soilMeshData } from "../modules/terrain/mesh-data.ts";

const scope = self as unknown as DedicatedWorkerGlobalScope;
scope.onmessage = ({
  data,
}: {
  data: { nest: NestState; detail: "full" | "light"; generation: number };
}) => {
  const mesh = soilMeshData(data.nest, data.detail);
  scope.postMessage(
    { revision: data.nest.revision, mesh, generation: data.generation },
    [
      mesh.positions.buffer,
      mesh.normals.buffer,
      mesh.uvs.buffer,
      mesh.colors.buffer,
    ],
  );
};
