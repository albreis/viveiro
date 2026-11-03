# Initialization and input data

Parts 5 and 6 of the [ODD](../odd.md). Reconstructing an initial condition requires
model version, seed, parameters, profile and mode; the seed alone does not define
the experiment.

## New founding

The interface uses SEMENTE-42 and reference initial parameters: humidity 58%,
light 72%, randomness 28%, repose 36° and air 24 °C, before profile adjustments.
The interface’s current generic profile is explicitly versioned; a legacy World
without a profile does not automatically adopt the latest biological revision.

Initialization fixes seed/RNG, resolves the profile and prepares soil composition,
IDs, counters and collections. It generates landscape/terrain, base nest and fields;
creates two founders; and, in founding mode, converts the scene to intact soil and
flight/shelter states according to strategy. It then creates plants, 14 associated
outside food sources and attempts to place up to two predators outside obstacles.
Position rejection can change draw counts: do not assume a fixed number of RNG calls.

Reserves, fertility, seasonality and health are initialized by the profile. The
intermediate food value in the constructor must not be mistaken for a final free
reserve for a claustral queen. Founding can redefine the nest and budget before
initial-state recording.

Established mode retains the base nest and appropriate legacy biological path.
It does not invent a previous natural growth history.

## Teaching recipes and restoration

Versioned lessons prepare populations/environment and A/B treatments; version 2
also initializes water/heat and gases without executing ticks. A prepared population
is not free brood born through natural dynamics. The seed includes recipe version.
Initial condition, question and treatment are identified in the experiment.

Restoration starts from snapshot arrays, profiles and RNG, runs migrations/validation
and rebuilds sharing/caches. It does not regenerate the world by calling the
constructor with the seed. Missing old fields may initialize at the first allowed
update; their history is not reconstructed retrospectively.

## Inputs and interventions

- Text seed, numerical parameters, mode and biological schema/id/version reference.
- Interventions with tick, type, coordinates and value, in recorded order.
- Teaching recipe or full snapshot/checkpoint, when used.
- Training/forecast options and observed information, separate from the world being
  forecast. Changing graphical quality must not change the model.

Reference air profiles have catalog provenance, but initialize only the stated
conditions. No complete species has been calibrated. Soil texture/water, air
temperature, light intensity and photoperiod are distinct variables.

The current run does not query weather, geolocation or laboratory databases over
the network each tick. Real-location weather was removed from the active scope
by the user on 2 November 2026. Export/checkpoint date metadata are not noise
sources for agents.

## Reproducing a trajectory

Preserve code/rules version, profile, initial state or snapshot, RNG states, ticks
and action order. Use the same fixed-step contract and numerical domain. Do not
promise identity across arbitrary JavaScript engines/versions merely because they
use the same numerical seed.

Clock, pause and budget change when ticks execute; they do not authorize combining
time into a single larger physical step. Copying scenario A midway retains that
instant’s history/RNG, unlike a new terrarium.
