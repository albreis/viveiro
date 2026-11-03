# Viveiro

[Português](README.md) · [English](README.en.md)

A browser-based 3D ant terrarium with local-sensing agents, procedural landscapes,
excavation, brood, finite resources and colony founding. Runs are repeatable from
seeds within their recorded numerical contract.

**[Open the public laboratory](https://viveiro.ersolucoesweb.com.br/?lang=en)** ·
[Changelog](CHANGELOG.md) · [Citation metadata](CITATION.cff)

Viveiro is an **exploratory model**, with accelerated and simplified cycles.
It is not calibrated for a species and does not predict real colony outcomes.
Internal verification is not biological, geotechnical or engineering validation.
Read the [English ODD specification](src/i18n/locales/en/docs/odd.md) for scope.

## Start

Requires Node.js 24.

```sh
git clone https://github.com/albreis/viveiro.git
cd viveiro
npm ci
npm run dev
```

Open http://127.0.0.1:4173/?lang=en. Vite reloads edited source automatically.

| Command                                          | Purpose                                                           |
| ------------------------------------------------ | ----------------------------------------------------------------- |
| `npm run dev`                                    | Development server on port 4173.                                  |
| `npm test`                                       | Model and application verification tests.                         |
| `npm run build`                                  | Validate translations, check strict TypeScript and build `dist/`. |
| `npm run preview`                                | Serve the build on port 4173; stop dev before using this command. |
| `npm run experiment -- --help`                   | Isolated headless experiments.                                    |
| `npm run sweep -- --out resultado-novo --jobs 2` | Default paired 50-run parameter sweep.                            |
| `npm run i18n:check`                             | Check locale keys and interpolation variables.                    |

Do not edit generated `dist/` files. Export important experiments as JSON;
IndexedDB checkpoints stay in the browser and are not a remote backup.

## Use

Drag to orbit and scroll to zoom. Side view cycles through the four terrarium
faces. Double-click an ant or select it and choose **First person**; Escape
returns to the overview. The guided tour can be skipped or reopened.

One-click lessons open paused A/B comparisons and first preserve the previous
world in a named checkpoint. Compare the same model day. One day is 100 ticks,
not a calibrated biological duration. Time and rendering quality are independent.

The language picker changes presentation without recreating the world. Seeds,
user names, scientific values and exported data remain canonical. Portuguese
filenames and identifiers in examples are intentional, even in English UI.

Isolated browser and CLI experiments use `stdlib-f64-v1` portable arithmetic.
The 3D terrarium and existing saves retain the native policy, which may produce
different trajectories. Compare matching versions, configurations and policies.

## English documentation

The application serves English model pages at `en/modelo/` and guides at
`en/ensino/`, with same-page language links and editable text downloads.

- [ODD and submodel map](src/i18n/locales/en/docs/odd.md)
- [Portable arithmetic](src/i18n/locales/en/docs/aritmetica-portatil.md)
- [Sweeps and resume](src/i18n/locales/en/docs/varreduras.md)
- [Morris sensitivity](src/i18n/locales/en/docs/sensibilidade.md)
- [Typed extension API](src/i18n/locales/en/docs/extensoes.md)
- [Parameter profile editor](src/i18n/locales/en/docs/perfis-parametros.md)
- [Teacher’s guide and six lessons](src/i18n/locales/en/docs/ensino/README.md)

Teacher review, classroom pilots, empirical calibration and independent
replication remain external work. Historical implementation and project
operations documents in this repository are in Portuguese.

## Source and contributions

Small modules live in `src/app`, `src/modules`, `src/services`, `src/workers`,
`src/styles` and [src/i18n](src/i18n/README.md). New modules use TypeScript;
legacy JavaScript is migrated gradually. CLI tools are in `scripts/`.

Develop each delivery on its own `codex/` branch, test the model and inspect the
browser before a pull request. Read [AGENTS.md](AGENTS.md). Never commit secrets.

Code is [MIT](LICENSE). Original documentation and images are
[CC BY 4.0](LICENSE-DOCS.md). Third-party notices retain their original licenses.
Cite the released version/commit in [CITATION.cff](CITATION.cff); unreleased
branches do not inherit another release’s DOI.
