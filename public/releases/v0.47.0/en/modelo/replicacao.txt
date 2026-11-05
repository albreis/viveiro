# Vectors and replication

The [field specification](reacao-difusao.md) is sufficient to write another solver.
These cases verify boundaries, indices, wind direction, substeps and evaporation.
They are not laboratory observations.

## Downloads and execution

- [Independent TypeScript reference](referencia.txt): save as reference-field.ts.
- [Input/output vectors](vetores.json): JSON with schema and tolerance.
- [Reference checker](verificador.txt): source of the repository’s small runner.

In the full source, using Node 24 and no additional dependencies:

```text
node scripts/check-odd-reference.ts
node --test tests/odd.test.mjs tests/odd-pages.test.mjs
```

The first command imports only the reference and vectors, not the production
chemical solver. The second compares both through distinct calculation paths,
and checks analytical examples and pages. The runner reports actual error per
case. No results from a fictitious external reimplementer have been created.

## Hand-calculable cases

Common parameters below are h=1, T=1, lambda=0 and zero wind unless stated otherwise.

1. Grid 3×1, C=[0,1,0], D=0.1: N=1; output [0.1,0.8,0.1]. JSON uses decimal points.
2. Grid 2×1, C=[1,0], D=0, vx=0.25: output [0.75,0.25]. With C=[0,1] and vx=−0.25,
   output is [0.25,0.75]. The closed boundary loses no mass through advection.
3. Grid 1×1, C=[2], D=0, lambda=ln(2): output [1]. There are no internal faces.
4. Grid 2×2, C=[1,0,0,0] by rows, D=0.1: output [0.8,0.1,0.1,0]. The diagonal cell
   receives no direct flux in that substep.
5. Grid 2×1, C=[1,0], D=0.5, vx=1: R=3, N=4, delta=0.25. The per-substep matrix is:

```text
[ 0.625  0.125 ]
[ 0.375  0.875 ]
```

Applied four times, it produces [0.296875,0.703125]. With lambda=ln(2), the final
output is half: [0.1484375,0.3515625], because each substep applies the same
exponential factor. These seven cases, counting directions and evaporation
separately, are fixed in the JSON without generating expectations through the
production solver.

## Tolerance and evidence limits

Use absolute component error ≤1e-12 for these small vectors. Do not require identical
bytes from two differently ordered floating-point sums. CSV/replay identity of the
same implementation is a separate CLI criterion.

Additional tests vary rectangular dimensions, wind signs, spacing, diffusion and
duration; they check input preservation, conservation and nonnegativity. Reference
and comparison were written by the same project: they are internal consistency
checks against the ODD. Scientific audit/external replication, physical scale and
calibration with measurements remain open.

Pages/documents use the same Markdown source. Equations/code are escaped text,
not executed content. The source package explicitly includes these public
documents; generators do not expose checkpoints or operational documents.
