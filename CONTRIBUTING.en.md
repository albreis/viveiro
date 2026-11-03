# Contributing to Viveiro

[Português](CONTRIBUTING.md) · [English](CONTRIBUTING.en.md)

Code, translations, documentation, lesson review and reproducible experiments
are welcome. Start with [good first issues](https://github.com/albreis/viveiro/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

## Choose a channel

Use [Issues](https://github.com/albreis/viveiro/issues/new/choose) for a defect,
concrete proposal or experiment contribution, and
[Discussions](https://github.com/albreis/viveiro/discussions) for questions and
hypotheses that are not yet implementation tasks. Check existing work first.

## Local development

Requires Node.js 24 and Git. From the cloned repository root:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4173/?lang=en. Edit source in `src/`, never generated `dist/`.
New modules use strict TypeScript and focused files of roughly 150–250 lines.
Read [AGENTS.md](AGENTS.md). Use a `codex/description` branch and one PR per
functional delivery. Preserve published branches/tags. Describe the problem,
resulting behavior and actual validation. Maintainers consolidate releases;
do not bump the version or publish a tag for each contribution.

## Validation

```sh
node --test tests/relevant-file.test.mjs
npm run i18n:check
npm run build
```

Run relevant tests. Model-rule changes require seed, conservation and persistence
regressions. `npm test` runs the full suite and may take several minutes. Inspect
visual changes with keyboard navigation, a narrow viewport and both languages.
Translations live in [src/i18n](src/i18n/README.md); preserve keys/placeholders,
scientific CSV/JSON, identifiers, seeds and user-authored names.

## Experiment contributions

Use the experiment issue form. Include the JSON plan, Viveiro version, question,
seed, parameters, biological profile and observations. It must run in the isolated
laboratory and reproduce files in the CLI with the same version/numerical policy.
Distinguish observation from forecast, explain limits and omit personal saves.
Cite sources/licenses for adaptations. Maintainers verify provenance before
adding gallery entries. An external contribution only counts after a real PR
from an external contributor is merged; team examples do not replace it.

## Scientific review and participation

Viveiro is exploratory. Air references do not calibrate soil or physiology.
Biological claims need primary sources, methods, samples and uncertainty; real
data need a usable license. Keep discussions respectful and focused on observable
behavior; avoid personal attacks and consider different experience levels.

Original code is [MIT](LICENSE); original documentation/images are
[CC BY 4.0](LICENSE-DOCS.md). Preserve third-party notices. Do not submit credentials.
Contributions follow the licenses of the affected material.
