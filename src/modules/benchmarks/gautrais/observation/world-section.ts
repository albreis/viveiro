import { validateLaboratoryGeometry } from "../../../terrain/laboratory.ts";
import { sampleSoil } from "../../../terrain/field.ts";
import type { NestState } from "../../../navigation/types.ts";
import { observePhysicalNetwork } from "./measure.ts";
import type { PlanarMask } from "./mask.ts";
export interface WorldSection {
  y: number;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  pitch: number;
}
export function sampleWorldSection(
  nest: NestState,
  section: WorldSection,
): PlanarMask {
  const { y, minX, maxX, minZ, maxZ, pitch } = section;
  const lab = nest.laboratory;
  if (lab) validateLaboratoryGeometry(lab);
  const boundX = lab?.sandRadius ?? 10,
    boundZ = lab?.sandRadius ?? 6.5,
    minimumY = lab ? -lab.sandDepth : -4.2;
  if (
    ![y, minX, maxX, minZ, maxZ, pitch].every(Number.isFinite) ||
    pitch <= 0 ||
    minX >= maxX ||
    minZ >= maxZ ||
    minX < -boundX ||
    maxX > boundX ||
    minZ < -boundZ ||
    maxZ > boundZ ||
    y <= minimumY ||
    y >= 0
  )
    throw Error("Section must be inside the actual World soil bounds");
  const width = Math.round((maxX - minX) / pitch),
    height = Math.round((maxZ - minZ) / pitch);
  if (
    width < 1 ||
    height < 1 ||
    width > 256 ||
    height > 256 ||
    Math.abs(minX + width * pitch - maxX) > 1e-8 ||
    Math.abs(minZ + height * pitch - maxZ) > 1e-8
  )
    throw Error("Section pitch must divide the bounded grid");
  const cells = new Uint8Array(width * height);
  for (let z = 0; z < height; z++)
    for (let x = 0; x < width; x++) {
      const point = {
        x: minX + (x + 0.5) * pitch,
        y,
        z: minZ + (z + 0.5) * pitch,
      };
      // Exterior air is not an excavated peripheral ring of the disk.
      const inSubstrate =
        !lab ||
        point.x * point.x + point.z * point.z <=
          lab.sandRadius * lab.sandRadius;
      cells[z * width + x] = Number(
        inSubstrate && sampleSoil(nest, point).distance > 0,
      );
    }
  return { width, height, cells, pitch, originX: minX, originY: minZ };
}
export function observeWorldSection(nest: NestState, section: WorldSection) {
  return {
    ...observePhysicalNetwork(sampleWorldSection(nest, section)),
    engine: "World physical soil field" as const,
    section: { ...section },
    lengthUnit: "model-unit" as const,
    buhlComparable: false as const,
    comparisonLimits: [
      "A planar section of a 3D terrarium is not the experimental sand disk.",
      "Model space/time have not been mapped to physical experimental units.",
    ],
  };
}
