import { WORKER_CONTACT } from "../../navigation/body-contact.ts";
import type { BuhlWorkerBody } from "./worker-profile.ts";
import type { BuhlArena } from "./geometry.ts";

interface Body extends BuhlWorkerBody {
  cell: number;
}
/** Local planar projection of the terrarium contact ellipse, with overlap escape. */
export class BuhlBodyContacts {
  readonly #heads: Int16Array;
  readonly #next: Int16Array;
  readonly #previous: Int16Array;
  readonly #buckets: Int16Array;
  readonly #near: Uint16Array;
  readonly #side: number;
  readonly #span: number;
  readonly #length: number;
  readonly #width: number;
  readonly #escape: number;
  #blocked = 0;
  private readonly arena: BuhlArena;
  private readonly agents: Body[];
  constructor(arena: BuhlArena, agents: Body[], mmPerUnit: number) {
    this.arena = arena;
    this.agents = agents;
    this.#length = WORKER_CONTACT.length * mmPerUnit;
    this.#width = WORKER_CONTACT.width * mmPerUnit;
    this.#escape = 0.0001 * mmPerUnit * mmPerUnit;
    const maxScale = Math.max(...agents.map((a) => a.bodyScale));
    this.#span = Math.max(
      1,
      Math.ceil((this.#length * maxScale) / arena.pitchMm),
    );
    this.#side = Math.ceil(arena.cellsPerSide / this.#span);
    this.#heads = new Int16Array(this.#side * this.#side).fill(-1);
    this.#near = new Uint16Array(this.#heads.length);
    this.#next = new Int16Array(agents.length).fill(-1);
    this.#previous = new Int16Array(agents.length).fill(-1);
    this.#buckets = new Int16Array(agents.length).fill(-1);
    agents.forEach((_, i) => this.moved(i));
  }
  #bucket(cell: number) {
    const n = this.arena.cellsPerSide;
    return (
      Math.floor((cell % n) / this.#span) +
      Math.floor(Math.floor(cell / n) / this.#span) * this.#side
    );
  }
  #neighbors(bucket: number, visit: (index: number) => void) {
    const x = bucket % this.#side,
      z = Math.floor(bucket / this.#side);
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        if (
          x + dx < 0 ||
          x + dx >= this.#side ||
          z + dz < 0 ||
          z + dz >= this.#side
        )
          continue;
        visit((z + dz) * this.#side + x + dx);
      }
  }
  moved(id: number) {
    const bucket = this.#bucket(this.agents[id].cell),
      old = this.#buckets[id];
    if (old === bucket) return;
    if (old >= 0) {
      const previous = this.#previous[id],
        next = this.#next[id];
      if (previous < 0) this.#heads[old] = next;
      else this.#next[previous] = next;
      if (next >= 0) this.#previous[next] = previous;
      this.#neighbors(old, (index) => this.#near[index]--);
    }
    const head = this.#heads[bucket];
    this.#previous[id] = -1;
    this.#next[id] = head;
    if (head >= 0) this.#previous[head] = id;
    this.#heads[bucket] = id;
    this.#buckets[id] = bucket;
    this.#neighbors(bucket, (index) => this.#near[index]++);
  }
  clear(id: number, cell: number, heading: number) {
    const bucket = this.#bucket(cell);
    if (
      this.#near[bucket] === 0 ||
      (bucket === this.#buckets[id] && this.#near[bucket] === 1)
    )
      return true;
    const n = this.arena.cellsPerSide,
      pitch = this.arena.pitchMm;
    const x = cell % n,
      z = Math.floor(cell / n);
    const a = this.agents[id],
      oldX = a.cell % n,
      oldZ = Math.floor(a.cell / n);
    const bx = bucket % this.#side,
      bz = Math.floor(bucket / this.#side);
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        if (
          bx + dx < 0 ||
          bx + dx >= this.#side ||
          bz + dz < 0 ||
          bz + dz >= this.#side
        )
          continue;
        for (
          let other = this.#heads[(bz + dz) * this.#side + bx + dx];
          other >= 0;
          other = this.#next[other]
        ) {
          if (other === id) continue;
          const b = this.agents[other],
            ox = b.cell % n,
            oz = Math.floor(b.cell / n);
          const vx = (x - ox) * pitch,
            vz = (z - oz) * pitch;
          const px = (oldX - ox) * pitch,
            pz = (oldZ - oz) * pitch;
          if (vx * vx + vz * vz > px * px + pz * pz + this.#escape) continue;
          const scale = (a.bodyScale + b.bodyScale) / 2;
          const along = heading & 1 ? vz : vx,
            across = heading & 1 ? vx : vz;
          const u = along / (this.#length * scale),
            v = across / (this.#width * scale);
          if (u * u + v * v < 1) {
            this.#blocked++;
            return false;
          }
        }
      }
    return true;
  }
  sample() {
    return { bodyRejectedCandidates: this.#blocked };
  }
}
