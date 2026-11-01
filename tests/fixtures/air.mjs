import { airNetwork } from "../../src/modules/ventilation/network.ts";
import { syncGases } from "../../src/modules/ventilation/state.ts";
export function airFixture(vents = 2) {
  const w = {
    tick: 0,
    params: { humidity: 68, light: 72, temperatureC: 24, windX: 0, windZ: 0 },
    nest: {
      nodes: [
        { x: -1, y: 0, z: 0, r: 0.4, type: vents ? "entrance" : "chamber" },
        { x: 0, y: -1, z: 0, r: 0.6, type: "chamber" },
        {
          x: 1,
          y: 0,
          z: 0,
          r: 0.4,
          type: vents === 2 ? "entrance" : "chamber",
        },
      ],
      links: [
        [0, 1],
        [1, 2],
      ],
      linkWidths: [0.38, 0.38],
      rubble: [],
      revision: 0,
    },
    ants: [],
    brood: [],
  };
  const net = airNetwork(w),
    s = syncGases(w, net);
  return { w, net, s };
}
