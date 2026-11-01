import { World as BaseWorld } from "../../src/modules/simulation/world.js";
/** Mature-nest fixtures isolate pre-existing navigation and colony invariants. */
export class World extends BaseWorld {
  constructor(seed, params = {}) {
    super(seed, params, { founding: false });
  }
}
export {
  forecast,
  LIMIT,
  nestPath,
} from "../../src/modules/simulation/world.js";
