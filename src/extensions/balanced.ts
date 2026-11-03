import type { DecisionExtension } from "../modules/extensions/types.ts";
/** One-file example. Pure local signals, no access to the map, clock or resource writes. */
export default {
  id: "balanced-local",
  version: 1,
  sensors: [
    {
      id: "cargo",
      sample: ({ agent }) => ({
        loaded: agent.hasLoad ? 1 : 0,
        hunger: Math.max(0, 1 - agent.energy / 100),
      }),
    },
  ],
  submodels: [
    {
      id: "urgency",
      compute: ({ signals }) => ({
        value:
          1 + signals["sensor.cargo.loaded"] + signals["sensor.cargo.hunger"],
      }),
    },
  ],
  policy: {
    id: "comfort-first",
    weights: ({ input, signals }) =>
      input.exits.map(
        (e) =>
          ((e.goalVisible ? 40 * signals["model.urgency.value"] : 1) *
            Math.max(0.02, e.comfort) *
            Math.max(0.1, 1 + e.signal * 4)) /
          (1 + e.visits * 3 + (e.backtrack ? 2 : 0)),
      ),
  },
} satisfies DecisionExtension;
