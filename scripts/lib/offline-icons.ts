import { deflateSync, crc32 } from "node:zlib";
function chunk(name: string, bytes: Buffer) {
  const type = Buffer.from(name),
    size = Buffer.alloc(4),
    check = Buffer.alloc(4);
  size.writeUInt32BE(bytes.length);
  check.writeUInt32BE(crc32(Buffer.concat([type, bytes])));
  return Buffer.concat([size, type, bytes, check]);
}
function distance(
  x: number,
  y: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  const t = Math.max(
    0,
    Math.min(
      1,
      ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) /
        ((bx - ax) ** 2 + (by - ay) ** 2),
    ),
  );
  return Math.hypot(x - ax - t * (bx - ax), y - ay - t * (by - ay));
}
/** Raster export of the code-drawn Viveiro mark, without fonts or external tooling. */
export function offlineIcon(size: number) {
  const raw = Buffer.alloc(size * (size * 3 + 1)),
    header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 2;
  for (let py = 0; py < size; py++)
    for (let px = 0; px < size; px++) {
      const x = ((px + 0.5) * 64) / size,
        y = ((py + 0.5) * 64) / size;
      const leaf =
        ((x - 22 + y - 21) / Math.SQRT2 / 13) ** 2 +
          ((x - 22 - y + 21) / Math.SQRT2 / 6) ** 2 <
        1;
      const ink =
        leaf ||
        Math.min(
          distance(x, y, 17, 20, 31, 47),
          distance(x, y, 31, 47, 47, 16),
          distance(x, y, 31, 47, 31, 20),
        ) < 2.5;
      const offset = py * (size * 3 + 1) + 1 + px * 3;
      raw.set(ink ? [217, 226, 174] : [52, 78, 54], offset);
    }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
