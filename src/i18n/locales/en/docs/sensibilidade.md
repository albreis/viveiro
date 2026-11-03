# Model sensitivity: Morris

Version 0.42.0; 4 trajectories, 2 paired replicates, 10 days, 12 inputs and 104 runs.

Ranking by final adult population (µ*). Effects are per normalized range unit,
not per physical unit. Larger values depend on horizon, profile and selected
ranges. Ties do not establish a distinct causal ordering.

| Rank | Parameter             | µ*      | sigma   |
| ---- | --------------------- | ------- | ------- |
| 1    | temperatureC          | 29.0625 | 34.0645 |
| 2    | initialFood           | 9.1875  | 10.7711 |
| 3    | light                 | 2.0625  | 2.4780  |
| 4    | windZ                 | 0.7500  | 1.5000  |
| 5    | humidity              | 0.3750  | 0.7500  |
| 6    | initialRainPulse      | 0.0000  | 0.0000  |
| 7    | photoperiodHours      | 0.0000  | 0.0000  |
| 8    | randomness            | 0.0000  | 0.0000  |
| 9    | reposeAngle           | 0.0000  | 0.0000  |
| 10   | surfaceDiffusionScale | 0.0000  | 0.0000  |

Profile generic-demo@5, established nest. The screening window is an exploratory
choice within catalog bounds, not a biological confidence range. All inputs and
ranges are model hypotheses/approximations, not calibrated uncertainties. Sigma
combines nonlinearity/interactions and residual noise. Four trajectories do not
give calibration precision; zeros may indicate an inactive mechanism in this scenario.

We retain inputs, responses per replicate, CSVs/manifests per World and indices
for every parameter, including those outside the top ten. Replicates are averaged
per point before computing each elementary effect. Missing data remain missing.

## Interpreting the top ten

The top ten is a screening order of 12 inputs, not the discovery of ten nonzero
effects. In this run, only five inputs changed final population. Zero ties are
ordered by identifier, without scientific priority. P3.2 must also consider other
metrics, horizons and real data before choosing adjustments.

## Input provenance

- humidity: %; range [45, 85]; approximation; src/modules/simulation/environment-step.js; microclimate/boundaries.ts.
- light: %; range [35, 85]; approximation; src/modules/landscape/dynamics.ts.
- randomness: %; range [10, 60]; hypothesis; src/modules/simulation/worker-step.js.
- reposeAngle: degrees; range [20, 50]; approximation; src/modules/granular/update.ts.
- temperatureC: °C; range [18, 30]; approximation; src/modules/microclimate/boundaries.ts.
- windX: model units; range [-1.5, 1.5]; approximation; src/modules/simulation/environment-step.js.
- windZ: model units; range [-1.5, 1.5]; approximation; src/modules/simulation/environment-step.js.
- photoperiodHours: h/model day; range [8, 16]; hypothesis; src/modules/seasons/update.ts.
- initialFood: food units; range [10, 24]; hypothesis; src/modules/experiments/initial-inputs.ts.
- initialRainPulse: relative 0–1; range [0, 0.4]; hypothesis; src/modules/experiments/initial-inputs.ts; landscape/dynamics.ts.
- surfaceDiffusionScale: D multiplier; range [0.5, 1.5]; approximation; src/modules/simulation/environment-step.js; chemistry/reaction-diffusion.ts.
- surfaceEvaporationScale: lambda multiplier; range [0.5, 1.5]; approximation; src/modules/simulation/environment-step.js; chemistry/reaction-diffusion.ts.

## Method and reproduction

EE = (Y_after − Y_before)/(x_after − x_before), with x normalized to [0,1]. µ is
the mean effect, µ* the mean absolute effect and sigma the sample standard deviation
(n−1). Each input has four effects after averaging two paired replicates per point.

Vanilla Morris, even grid, step p/[2(p-1)], one input per step. Seeds are shared
between points of one trajectory/replicate; other trajectories/replicates receive
other seeds. This implementation has no Campolongo optimization or confidence bootstrap.

Primary references: [Morris 1991](https://doi.org/10.1080/00401706.1991.10484804),
[SALib sampling](https://salib.readthedocs.io/en/stable/_modules/SALib/sample/morris/morris.html)
and [SALib analysis](https://salib.readthedocs.io/en/stable/_modules/SALib/analyze/morris.html).
Viveiro uses its own design RNG; it does not promise NumPy-identical samples.

`npm run sensitivity -- --out nova-pasta --jobs 4` reproduces the default protocol.
`--resume` checks existing files and source identity before reuse. Identical model,
version, source, plan and seeds are required.

Design identity: 953d4559c329bf56385f9230dc69712560baf1035a187be368d6cde10de44d23.
Normalized source: 43ddce7466fe4b4bd4459795ec9b75f9ab23ba75f17310eb2a5912021a62c156.

## Raw data from this study

[Design and plans](../experimentos/morris-042/desenho.json),
[inputs](../experimentos/morris-042/entradas.csv),
[individual responses](../experimentos/morris-042/respostas.csv),
[complete indices](../experimentos/morris-042/indices.csv),
[elementary effects](../experimentos/morris-042/resultados.json) and
[individual files with hashes](../experimentos/morris-042/arquivos.json).
Each run has a CSV and manifest in the same directory under the index filenames.

Files were generated with the source identified above. Future source edits must
use a different directory and preserve this study. The first broad-range study
was retained locally; it showed only a thermal effect on this metric. The window
above was chosen to investigate that behavior, without selection using external
biological data.
