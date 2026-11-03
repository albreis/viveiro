# Typed local extensions

The research API separates observations, sensors, signal submodels and decision
weights. ACO remains the default; adding a file does not change old experiments
or the saved terrarium.

## Create in one file

Copy `src/extensions/balanced.ts`, change `id`, `version` and the functions.
The default export uses `satisfies DecisionExtension`. Contracts are defined in
`src/modules/extensions/types.ts`.

- `SensorSystem.sample(LocalInput)` derives finite signals from energy, load and adjacent exits.
- `DecisionSubmodel.compute(DecisionFrame)` transforms signals; it receives only observations and earlier results from the same decision.
- `DecisionPolicy.weights(DecisionFrame)` returns one nonnegative weight per exit. The sum must be positive; the simulator samples through its seeded RNG.

Observations are frozen copies; they include no World, global positions, stocks,
full map or mutable agent references. Exits have already passed physical
passability checks. The policy does not return a position, dig, move food or
change the clock. Submodels in this API are local signal transformations, not
arbitrary replacements for gas/soil solvers.

Weights must be between 0 and 1,000,000. Sensors/submodels are limited to 16 instances
per stage, 32 signals per instance, and finite signals with absolute value at most
1,000,000. Invalid output stops the experiment with an explicit error, without
silent fallback.

## Run and compare

```sh
npm run experiment -- --extension src/extensions/balanced.ts --seed MINHA-SEED --start established --profile generic-demo@1 --days 5 --out ensaio-novo
npm run compare:policy -- --extension src/extensions/balanced.ts --days 5 --replicates 4 --seed POLICY-43 --out comparacao-nova
```

The second CLI runs ACO and the extension with the same seed per replicate,
retains individual CSVs/manifests and produces `comparacao.csv`. Different
replicates receive different seeds. The protocol records profile, horizon,
identity and extension hash. Decision counts distinguish an actually invoked
policy from a short experiment with no workers.

The example favors comfort and avoids repeated visits. It is a programming
hypothesis, not a species-validated behavior. Improving an internal result does
not demonstrate greater biological realism. Comparisons do not replace P3.

## Reproduce and restore

The plan/manifest stores `{schema, id, version, sourceSha256}`. SHA-256 identifies
source with LF-normalized line endings. An installed version cannot be replaced
by different source. Records with another version/hash are not reused. The local
file path is not part of the manifest.

In the browser, only extensions included in the bundle are available. The example
is included; select its reference in the isolated laboratory’s JSON plan. JSON
never authorizes importing a file or URL. New extensions require rebuilding the
bundle or explicitly passing `--extension` to the CLI.

When restoring an extension-using snapshot, the same identity must be registered
before `World.restore`; missing or changed identity raises an error before
continuation. Developer modules can call `loadTrustedExtension` before restoration.
The rest of the save and collisions retain the same validators.

## Trust boundary

`--extension` executes local developer code with the Node process’s permissions.
Types, frozen observations and weight validation are a model contract, **not a
security sandbox**. Use only reviewed, trusted files. Transitive imports are the
author’s responsibility; the manifest hash identifies only the specified file.
For a package with external dependencies, also pin versions/sources in your protocol.

For scientific reproduction, functions must be pure and deterministic: do not use
`Math.random`, real-time clocks, network access, mutable files or global state.
Sampling is performed by the simulator’s RNG, not the extension. Example tests
verify repeatability and local limits; they do not certify third-party extensions.

## Recorded study

Four paired replicates, five days, established generic-demo@1. The choice was
actually invoked in all four custom runs; results are internal to the model and
do not demonstrate biological superiority.

| Replicate | ACO population | Extension population | Extension decisions |
| --------- | -------------- | -------------------- | ------------------- |
| 1         | 25             | 23                   | 71                  |
| 2         | 23             | 25                   | 89                  |
| 3         | 29             | 21                   | 88                  |
| 4         | 28             | 23                   | 88                  |

[Comparison data](../experimentos/policies-043/comparacao.csv),
[full protocol](../experimentos/policies-043/protocolo.json) and
[individual files with hashes](../experimentos/policies-043/arquivos.json).
