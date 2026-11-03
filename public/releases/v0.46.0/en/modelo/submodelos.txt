# Submodel map

Part 7 of the [ODD](../odd.md). This page organizes coupling and core equations;
the complete numerical specification in this delivery covers the surface field.
Other components retain details in the code and technical source notes.

## Chemistry, decisions and memory

[Surface reaction–diffusion](reacao-difusao.md): conservative diffusion, upwind
advection and exponential decay on an X/Z grid. Air humidity modulates D/lambda;
wind transports the field. Deposits are capped; transport has no artificial
saturation. The underground graph uses another solver and reference channels.

Graph odor: quantities per node; fluxes proportional to quantity/volume differences.
Chamber-type sources are replenished to their reference; evaporation and emission
have counters. These marks are imposed environmental features.

ACO: weight proportional to tau^alpha × eta^beta, a 1e-6 signal floor, logarithmic
normalization and uniform epsilon mixing. Function defaults: alpha 1.4/beta 2/
epsilon 0.05; callers can modulate values. The function samples rather than always
choosing the maximum. Stimulus/threshold uses S²/(S²+theta²), with numerical limits
and age, caste and activity factors; tasks are reconsidered at intervals. Routing
uses adjacent sensing and bounded visit memory.

## Body, terrain and excavation

Movement combines desire, social repulsion, antennal contact, load priority,
reversal and recovery. Support is queried from the implicit field and obstacles;
a route does not authorize teleportation. The camera presents that body.

Excavation removes local material, carries and deposits it; widening/branching
and repair depend on tasks. Aggregates represent soil parcels. Repose, moisture,
composition, compaction, span and damage modulate sliding/support through heuristics.
This is neither DEM of all grains nor calibrated geotechnical analysis.

## Water, heat and gases

Surrounding porous water exchanges conservatively between cells through saturation
gradients and a reduced gravitational term. Flow is bounded by donor/capacity;
rain/pond/evaporation/plants enter the balances. Heat diffuses and exchanges at
boundaries; this is not a full Richards, vapor, ice or thermodynamics solver.

Gases use a volume network and flow Q_ab=G_ab×(p_a−p_b+H_ab). Conductance scales
with radius^4/length and opening; entrance pressure depends on wind. Diffusion/
advection and boundaries transport quantities; respiration consumes O2 and produces
CO2 at an illustrative ratio of 0.8. New cells record geometric exchange without
counting it as ventilation. A bottleneck affects the next solver update.

## Collective life and reproduction

Nutrition transfers food from finite sources, reserves and crops; contacts share
rather than clone resources. Brood/waste have a carrier and destination.
Chamber stocks, spoilage and transport depend on profile.

Founding: flight, encounter, wing shedding, shelter selection/excavation, plug and
nanitics. Claustral and semiclaustral budgets differ. Maternal reserves, thermal
development, diapause/cocoon memory, spermatheca and mortality risk are optional/
versioned; do not indiscriminately add rules from old profiles. Genes/parentage
and mutations affect phenotypes with demonstration limits and costs.

## Ecology, learning and observer

Plants respond to water/temperature/light; materials have moisture/decomposition.
Predators use bounded movement and pursuit. Aphids/honeydew, protection, mimetic
caterpillars and odor/territory relationships use local exploratory rules. A complete
food web or realistic taxonomic diversity is not guaranteed.

Optional RL has project-defined rewards and comparisons with baselines. Forecasts
copy the world or extrapolate counts; they never change the observed past. CSVs
store actual tick readings, not values from simulated futures.

## Provenance and limits

Demonstration parameters, reference experimental conditions and unimplemented
proposals are distinct catalog categories. Using a known equation does not
automatically transfer its parameters or empirical validation. Documentation must
change when formulas, boundaries, ordering or profiles change.
