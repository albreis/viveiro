import { auditGautraisDataset } from "./lib/gautrais-dataset.ts";
try {
  const [root, ...extra] = process.argv.slice(2);
  if (!root || extra.length)
    throw Error("Uso: node scripts/audit-gautrais.ts PASTA-S12");
  process.stdout.write(
    JSON.stringify(auditGautraisDataset(root), null, 2) + "\n",
  );
} catch (error) {
  process.stderr.write(
    (error instanceof Error ? error.message : String(error)) + "\n",
  );
  process.exitCode = 1;
}
