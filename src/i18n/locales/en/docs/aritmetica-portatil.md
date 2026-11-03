# Portable experiment arithmetic

Numerical contract stdlib-f64-v1, introduced in 0.40.0 for P2.2B. The biological
model remains exploratory, without species calibration.

## Measured problem

In 0.39.0, identical engine/seed/parameters produced differences of a few bits
already in initial position and friction. Within ten days, populations also
diverged. Original raw data remain in tests/fixtures/cli-native-039; they were
not deleted or rounded to create an appearance of equality.

## Separate, explicit contracts

src/libs/model-math.ts starts with the environment’s native functions. The 3D
terrarium and legacy saves retain ecmascript-native-f64-v1. Routing operations
through the service preserved the native 1,000-tick CSV exactly, normalizing only
the software version to compare it with the earlier capture. There is no global
Math patch, or change to biological rules or the RNG.

The CLI and experiment page start their own Workers. Only in those contexts does
installPortableMath select stdlib JavaScript functions, with pinned direct versions
and transitive dependencies locked in package-lock.json. Node uses worker_threads;
the browser uses WebWorker. Backend and internal library buffers are isolated by
Worker. Do not switch the numerical policy of a living World.

The manifest records the policy. Reproduction requires identical code version,
lockfile, seed, versioned profile, parameters and policy. A portable experiment
CSV can follow a different trajectory from the same native terrarium. Do not
reinterpret a native save as if the portable backend generated it. Experiments
export observations, not complete portable saves.

## Operations and precision

exp/expm1, sin/cos/tan/tanh, atan/atan2, log/log1p, cbrt, hypot and exponentiation
are routed through the service. log is the natural logarithm, implemented through
stdlib ln. Core ** operators also use pow, including fractional exponents.
stdlib hypot accepts two arguments; the adapter reduces vectors in fixed order
starting from zero, respecting infinity’s precedence over NaN.

The stdlib JavaScript kernels retain explicit argument reductions and coefficients.
Primary references: [exp](https://github.com/stdlib-js/math-base-special-exp),
[sin](https://github.com/stdlib-js/math-base-special-sin),
[tan](https://github.com/stdlib-js/math-base-special-tan) and
[hypot](https://github.com/stdlib-js/math-base-special-hypot).
We use those implementations, not a new untested approximation.

Sums, products, divisions and sqrt remain environment Float64 operations.
Equality was measured in the runtimes actually tested; it does not prove universal
correct rounding of every function in every JavaScript engine. The surface ODD
reference remains independent and does not import this backend.

## Scheduling

Every tick executes the same World.step. Progress is emitted every 25 ticks.
The browser Worker inserts no timers between batches: the interface runs on
another thread and cancels through terminate. This avoids timer-throttling delays
in background tabs. Rendering does not decide how many ticks enter the output.

## Reproducible evidence

Four cases in tests/fixtures/cli-portable-040: regression for seed QA-CLI-039,
a nest with health/soil/gases, semiclaustral founding and another worker seed.
Each retains its plan, CSV and manifest produced independently in Node and a
real browser. Both files are byte-identical across environments. They total
4,400 ticks per environment. These are not measurements of natural ant colonies.

Regressions run the isolated CLI and compare files with actual browser captures.
Analytical tests check values, domains, NaN/infinity, signed zero and 3D norm;
a concurrent test checks Worker isolation. AST auditing prevents reintroducing
approximate native functions or ** into the routed core. Renderer, native service
and ODD reference have explicit contractual exclusions.

The complete model suite passed 396 tests before adding the four captured cases
as regressions. Subsequent targeted checks and bundle QA are recorded in
docs/validacoes/paridade-0.40.0.json. Do not present this internal verification as
external scientific replication or ecological calibration.

## Dependencies and distribution

Numerical functions and original authors’ notices retain applicable Apache 2.0,
MIT and BSD/Sun notices. scripts/generate-numeric-notices.ts generates an index
and small files in public/notices/ from the installed lockfile dependencies.
Each package notice has at most 109 lines in this revision; the full Apache license
is separate. Do not remove notices from distributed bundles.
