import vectors from "../src/modules/model-documentation/vectors.json" with { type: "json" };
import { referenceField } from "../src/modules/model-documentation/reference-field.ts";
// Runs the documented reference alone, without the production chemistry solver.
const results = vectors.cases.map((test) => {
  const values = referenceField(test.input, test.parameters);
  const error = Math.max(
    ...values.map((v, i) => Math.abs(v - test.expected[i])),
  );
  if (error > vectors.absoluteTolerance)
    throw Error("Vetor ODD divergiu: " + test.id);
  return { id: test.id, maxAbsoluteError: error, values };
});
console.log(
  JSON.stringify(
    {
      schema: vectors.schema,
      tolerance: vectors.absoluteTolerance,
      referenceOnly: true,
      results,
    },
    null,
    2,
  ),
);
