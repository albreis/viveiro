# Viveiro ODD

Specification of the contract observed in version 0.38.0. The terrarium is an
exploratory model in its own units, without species-specific biological calibration.
This documentation follows the seven elements of the
[ODD protocol, 2020 update](https://www.jasss.org/23/2/7.html).
The short pages below describe implemented mechanisms; future proposals are not
presented as mechanisms that already exist.

## 1. Purpose and patterns

Explore how local decisions, finite resources and environmental changes produce
collective trajectories, and how observed information affects forecasts. Teaching
experiments can use the same seed and interventions at known ticks.
The model does not estimate a real colony’s future, demonstrate mathematical
chaos merely through divergence, or combine several species as if they were one.

Internal verification patterns include conservation with explicit sources/sinks,
body support on terrain, tunnel connectivity, persistence/replay, probabilistic
responses and the difference between forecasting and observation. These are not
empirical patterns used for calibration. POM, held-out data and external validation
remain dependencies of the research phase in the roadmap.

## 2. Entities, state variables and scales

[States and units](odd/estados.md) distinguishes agents, brood, colonies, shared
habitat, fields and session. The current limit is 450 adults/brood across colonies;
this is not intended to represent an unlimited population. One model day contains
100 ticks. It is not equivalent to a calibrated biological day.

## 3. Process overview and scheduling

[Scheduling](odd/agendamento.md) records the exact system order and what is updated
sequentially. Recorded interventions precede the next step. Rendering and interface
speed do not change the biological step.

## 4. Design concepts

[Concepts](odd/conceitos.md) describes emergence, adaptation, objectives, learning,
prediction, sensing, interaction, stochasticity, collectives, observation and the
adopted principles. The engine knows the habitat to calculate physics; agents are
not granted that global knowledge.

## 5. Initialization

[Initialization](odd/inicializacao.md) separates founding, established nest,
teaching experiment and restoration. Missing profiles in legacy saves/usage retain
the old contract; the current interface default is explicitly chosen.

## 6. Input data

The same [input page](odd/inicializacao.md) records seed, parameters, versioned
profile, recipe and interventions. There are no real-weather queries each tick.
Laboratory air references do not calibrate physiology or soil.

## 7. Submodels

The [submodel map](odd/submodelos.md) brings together core equations, coupling and
limits. [Reaction–diffusion](odd/reacao-difusao.md) specifies the domain,
discretization, boundaries, sources, order, precision and vectors needed for
reimplementation without consulting the main solver.

[Replication and vectors](odd/replicacao.md) provides an independent reference
based on cell input/output balances. It does not import production chemistry.
Comparing two implementations written by the same project is internal verification,
not external replication or scientific validation.

## Delivery scope

The map describes all main components; the complete numerical specification in
this delivery covers the surface field. Notes on the other submodels are not
sufficient to reconstruct all of Viveiro without its code. Order, profiles and
constants belong to the version: future changes must revise this ODD.

Editable Portuguese sources are docs/odd.md and docs/odd/. English translations
are in src/i18n/locales/en/docs. Vite generates pages and downloads from these
files; do not edit dist.

In 0.40.0, isolated experiments adopted a [portable arithmetic policy](aritmetica-portatil.md).
The native contract described above remains in use for the terrarium and existing saves.
