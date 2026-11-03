# Reproducible sweeps and resuming

P2.3, introduced in version 0.41.0. Exploratory experiments, without species
calibration. Sweeps execute the same World and exporter as the individual CLI,
using stdlib-f64-v1; they do not access the saved terrarium or its clock.

## Example: five values and ten replicates

Using the source of this version, Node 24 and installed lockfile dependencies:

```text
npm run sweep -- --out resultado-novo --jobs 2
```

This runs 50 experiments: humidity [40,50,60,70,80], ten replicates, one model day,
an established nest and profile generic-demo@1. The full configuration, including
origin seed VARREDURA-41, is stored in varredura.json. --plan arquivo.json accepts
a custom viveiro-sweep-v1 plan with base, parameter, values and replicates.
The experimentos.html page edits that same plan.

One parameter varies per batch. Base parameters: humidity, light, randomness,
reposeAngle, temperatureC, windX and windZ. P2.4 added optional catalog inputs:
photoperiodHours, initialFood, initialRainPulse, surfaceDiffusionScale and
surfaceEvaporationScale. Ranges match the individual CLI. Limits: 50 distinct
values, 100 replicates and 1,000 runs.

## Paired seeds and ordering

Each replicate seed is SWEEP- followed by SHA-256 of JSON.stringify of
["sweep-replica-v1", original seed, replicate number starting at 1]. The same
replicate uses the same seed across values. This allows paired comparisons;
it does not imply statistical independence between treatments. Different replicates
receive different seed strings. World still uses its 32-bit RNG; SHA-256 seed
derivation does not eliminate the possibility of collisions in that RNG.

Identifiers v001-r001 etc. follow explicit value/replicate order. Outputs are
ordered this way even when Workers finish out of order. Changing --jobs from 1
to 8 changes scheduling, not seeds or ticks. The browser offers 1, 2 or 4 Workers.
There is no server-side computation.

## Files and resuming

Every vNNN-rNNN directory contains dados.csv and manifesto.json. Complete results
are published through directory renaming; incomplete .partial-* temporaries do
not count as results and are not deleted during resuming.

```text
npm run sweep -- --out resultado-novo --jobs 2 --limit 7
npm run sweep -- --out resultado-novo --jobs 4 --resume
```

The first call completes seven runs and writes retomada-7.json; the second verifies
and reuses them, calculating the remaining 43. For a custom plan, also repeat
--plan with identical configuration. Only --resume allows an existing directory.
Plan, version, policy, IDs, configuration per run, size and CSV SHA-256 are checked
before computation. Different files are not overwritten. Changing value order
changes the plan.

On completion, resumo.csv indexes value, replicate, seed and CSV hash;
concluido.json records hashes; retomada.json includes all CSVs/manifests for
transfer. Biological metrics remain in individual daily CSVs. Hashes detect
corruption; they are not signatures of scientific authenticity.

Ctrl+C stops Workers and preserves completed directories. .sweep.lock prevents
two commands from using one directory. After an abrupt process/OS termination,
the lock may remain: confirm no executor is active and remove only that file
before resuming. Uncertain locks are not removed automatically.

## Browser and transfer

The experiment page runs the same batch in independent Workers. You can stop,
resume and download checkpoint JSON whenever results have been validated. Download
before closing the page: sweeps are not automatically persisted in IndexedDB and
do not change terrarium saves.

Browser limits: 200 runs, 10,000 planned daily observations, and JSON imports up
to 20 MiB. The CLI accepts larger plans. JSON includes individual CSVs as text,
preserving BOM/CRLF; the CSV index does not replace those data.

```text
npm run sweep -- --checkpoint retomada.json --out resultado-importado --jobs 2
```

Imported results are checked before Workers start. Resuming requires the same
model version and policy. With locally modified source under an unchanged version,
that identifier does not prove code equality: do not mix different builds under
one published version. Native saves are not migrated to the portable policy,
and these batch outputs are not assigned biological calibration.
