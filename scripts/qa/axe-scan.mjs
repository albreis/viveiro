import axe from "axe-core";

const tags = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

export async function scan(page, state) {
  if (!(await page.evaluate(() => Boolean(globalThis.axe))))
    await page.addScriptTag({ content: axe.source });
  const result = await page.evaluate(
    (values) =>
      globalThis.axe.run(document, {
        runOnly: { type: "tag", values },
        resultTypes: ["violations", "incomplete"],
      }),
    tags,
  );
  const findings = (rules) =>
    rules.map(({ id, impact, help, helpUrl, nodes }) => ({
      id,
      impact,
      help,
      helpUrl,
      nodes: nodes.map(({ target, failureSummary, any, all, none }) => ({
        target,
        failureSummary,
        checks: [...any, ...all, ...none].map(({ id, message, data }) => ({
          id,
          message,
          data,
        })),
      })),
    }));
  return {
    state,
    route: new URL(page.url()).pathname,
    rulesPassed: result.passes.length,
    violations: findings(result.violations),
    incomplete: findings(result.incomplete),
  };
}
