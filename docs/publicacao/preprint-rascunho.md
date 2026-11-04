# Viveiro: repeatable experiments in an interactive ant colony model

Working text for author review. It has not been submitted, posted as a
preprint, or accepted by a journal. Author names and affiliations are to be
confirmed by the people who contributed.

## Summary

Viveiro is an open source agent-based model and a browser environment for
exploring ant colony dynamics. A simulation combines local agent decisions,
pheromone fields, excavation, habitat conditions, resources and colony life
cycles. The graphical view lets users follow a worker, inspect tunnels and
change experimental conditions. The same model can run without graphics
through a command line interface. Configurations, observed endpoints and
checksums can be exported so that a run can be repeated and checked.

## Statement of need

In a stochastic simulation, changing a parameter and starting a new world
can mix the effect of the intervention with a change in initial conditions.
Viveiro supports seeded comparisons in which two worlds start from a
documented setup and their outcomes are examined at equal model times.
It provides an ant-specific working model with integrated 3D inspection,
side-by-side experiments and scripts for repeated runs and sensitivity
analysis. This makes it useful for generating questions about mechanisms,
such as whether a recruitment rule is enough to concentrate excavation.

General agent-based environments also support reproducible experiment
design; [NetLogo BehaviorSpace](https://ccl.northwestern.edu/netlogo/docs/behaviorspace.html)
is one example. Viveiro supplies an ant colony model with a browser interface
and a headless runner rather than a general model authoring language. This
is a difference in purpose, without a performance or accuracy comparison.

## Implementation and verification

The [model specification](../../src/i18n/locales/en/docs/odd.md) follows the
[ODD protocol](https://doi.org/10.18564/jasss.4259) and identifies the simulation
schedule, state and submodels. The 3D view uses Three.js; render timing is
independent of model time. Isolated runs use the versioned portable arithmetic
policy and emit a manifest with their plan, clock, file hash and final root
random state. Existing interactive saves use a separate arithmetic policy.

A [worked example](preparacao.md#reprodução-com-a-release-0460) repeats a public
300-tick observation with version 0.46.0 and verifies the CSV and manifest hashes.
The [versioned archive](https://doi.org/10.5281/zenodo.23932885) identifies the
software. This check verifies reproduction of a specified computation.

## Scope and limitations

The model uses simplified units and accelerated dynamics; no species is
claimed as calibrated. The exploratory benchmark using
[Buhl et al.](https://doi.org/10.1007/s00265-004-0906-2) investigates whether
patterns of excavation can be reproduced. The prepared terrarium and
laboratory arena differ, and matching an isolated summary does not validate
either excavation dynamics or colony outcomes. Classroom pilots, reserved
empirical tests and independent evaluations are not presented as completed.

## Before submission

The authors will decide the final venue and version, confirm contributions
and affiliations, and update all statements with actual supporting evidence.
This working text was drafted with Codex assistance; a complete AI-use
disclosure and confirmation of human review must be prepared by the authors
from the actual record of tool use and decisions. Funding and conflicts
should likewise be stated by the authors based on their own circumstances.
