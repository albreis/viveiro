import type { NestState } from "../modules/navigation/types.ts";
import { soilMeshData } from "../modules/terrain/mesh-data.ts";

const scope = self as unknown as DedicatedWorkerGlobalScope;
scope.onmessage = ({ data }: { data: { nest: NestState } }) => {
  const mesh = soilMeshData(data.nest);
  scope.postMessage({ revision: data.nest.revision, mesh }, [
    mesh.positions.buffer,
    mesh.normals.buffer,
    mesh.uvs.buffer,
    mesh.colors.buffer,
  ]);
};
