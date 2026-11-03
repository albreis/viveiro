# Design concepts

Part 4 of the [ODD](../odd.md). The concepts below describe concrete mechanisms,
without assigning human intent to agents or scientific validation to analogies.

## Principles, emergence and adaptation

Principles: decisions through limited sensing, probabilistic rules, finite
resources and explicit balances. Numerical conservation does not imply realistic
chemistry, geotechnics or physiology. The scenario combines demonstration traits.

Trails, congestion, task allocation, load traffic and population outcomes emerge.
Roles, castes, odor sources associated with chamber types, reward functions,
limits and physiological rules are imposed by the model; they do not all emerge
from nothing or derive from data.

Adaptation: task selection responds to local stimuli and individual thresholds;
exit choice weights signals, heuristics and exploration. Routes can be reconsidered,
and bottlenecks can stimulate widening/recovery. Site/chamber selection has costs
and memories when enabled by the profile.

## Objectives, learning and prediction

Implemented objectives include collecting/delivering, feeding/caring, maintaining
shelter, defending/fleeing and reproducing with costs. There is no global
maximization function consulted by every ant, or ant planning of future population.

Learning: ACO and local rules are the default. A small RL policy can be trained on
graphs and optionally applied, with individual traces/updates. Rewards and baselines
are experimental choices; training on synthetic geometries does not demonstrate
biological generalization to the terrarium.

Forecasting is an observer tool; agents cannot access its results. Full-state
replicas and count extrapolation are different methods. Exploratory intervals
and errors on synthetic continuations are not empirical coverage of a natural colony.

## Sensing and interaction

Adults have limited ranges for food, danger, chemistry and contacts. In surface
foraging, food is sought within 2.3 units and three pheromone directions are sampled
at 0.7. These are demonstration ranges, not real vision.

The engine maintains the full graph for physics and fields; junction policies use
adjacent exits, nearby odor and memory of up to 64 traversed edges. Knowing a
visited entrance is not knowing the entire map. nestPath exists for tools/tests,
not as the default worker’s oracle.

Contact, trophallaxis, carrying and chemical encounters require local conditions.
Recognition through signature distance can generate intimidation, flight or
conflict; camouflage and mimicry are demonstration hypotheses. Predators, plants
and symbionts also interact through their own rules, not through an LLM.

## Stochasticity and collectives

A seed initializes pseudorandom states. Each colony’s RNG call sequence is part
of the trajectory; landscape, traits and some fields use derived seeds. There is
no cryptographic randomness or external noise per frame.

Direction/task choices, reproduction and hazards use conditional draws. Genes and
differences in activity/boldness/exploration generate heterogeneity. Mutation and
selection in the model do not demonstrate calibrated evolution of a species.

The colony groups parentage, resources and odor. Daughters have their own states
in a common habitat. No central message tells every worker where to go; the
engine coordinates sharing, limits, physics and recording.

## Observation

Counts/journal/CSV are model outputs; field panels show defined samples or ranges,
not real sensor readings. A first-person camera changes presentation. The person
can intervene and compare A/B. The choice of information available for forecasting
belongs to the experiment and must be recorded along with version, seed, profile
and interventions.
