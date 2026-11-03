# Process order

Part 3 of the [ODD](../odd.md), checked against colonies/update.ts and
simulation/environment-step.js. Updates are sequential; changing their order
changes the model even with the same seed. Local operations may use simultaneous
buffers without making the entire tick simultaneous.

## Before the tick

stepSession reapplies all interventions whose tick is less than or equal to A’s
current tick, in recorded order. It applies the same intervention to B when B
exists. It then executes exactly one A step and one B step. An intervention at
tick t occurs after the closing observation already recorded at t and before
advancing to t+1. A separate current reading can therefore differ from the
closing observation of that same tick.

## One family advance

1. updateEnvironment increments the tick. It updates soil water/heat when due,
   calculates humidity suitability, updates the landscape, and transports/evaporates
   surface pheromone. Worker deposits occur later in the tick.
2. Capture the current colony list; rebuild habitat/neighborhood references.
3. Prepare social chemistry; update ecology, territory and chemical encounters.
4. Update reference odors on the graph; then erosion, granular aggregates and
   ventilation. Gases are shared; calculate disease exposure.
5. For each colony, root followed by daughters: synchronize IDs/limits, update
   fertility and seasonality, then brood and adult life cycles.
6. Predators act on the combined list. Predation and other deaths are recorded;
   loads are dropped, waste is generated and dead agents are removed.
7. Rebuild the neighborhood. For each colony, update nutrition/trophallaxis,
   stock spoilage and notices, without free redistribution of reserves.
8. Coordinate reproductive encounters and allocation of new colonies. A daughter
   created here did not receive the per-colony block already finished this tick.
9. Record daily closing observations when tick is a multiple of 100. If 25 ticks
   have elapsed since the previous census, record the chart point. This reading
   is observational.

## Adult order inside a colony

First retain previous poses for interpolation, then update founding. Adults are
visited in array order without global shuffling. Age, health/mortality and the
sexual branch precede worker tasks.

For living workers: learning/energy cost; encounters, infiltration, seasonal
shelter, plug work, stuck recovery, mimicry/aphids, an existing soil task, colony
organization and a new soil task. A branch consuming the action ends that
individual’s processing for the tick.

Without a priority task, the worker considers an internal route and then surface
movement. Danger sensing, returning/collection and ACO precede displacement.
While moving on the surface with food, it deposits 0.25 chemical unit in the
final cell, limited by deposit capacity. This deposit is transported in the next
updateEnvironment. There is no anticipatory feedback.

## Frequencies and clock

The environment/main decisions advance each tick. Water/heat and gases integrate
in 10-tick windows with their own substeps; granular/excavation and profile effects
have specific routines. Surface reaction–diffusion uses dt=1 per tick. The chart
samples every 25 ticks; the daily CSV uses 100.

The visible clock accumulates real-time credit and drains whole ticks. A hidden
page pauses normal advance; the advance Worker uses stepSession until the budget
or target is reached, without skipping ticks. Canceling does not apply an
incomplete partial world. Simulation while the page is closed is not implemented.

Forecasts execute copies with their own replicate seeds. Rendering, camera,
exporting and reading the ODD must not consume the observed run’s RNG.
