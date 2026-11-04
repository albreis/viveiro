import assert from "node:assert/strict";

export async function checkMetricCards(page, groups, audit, state) {
  const summaries = [];
  for (const group of groups) {
    const metrics = page.locator("#" + group + "-metrics");
    const count = await metrics.locator("dd").count();
    assert.ok(count >= 2 && count <= 4);
    assert.ok(await metrics.isVisible());
    assert.equal(
      await metrics.evaluate((node) =>
        Boolean(
          node.closest('[aria-live]:not([aria-live="off"]), [role=status]'),
        ),
      ),
      false,
    );
    const details = page.locator("#" + group + "-metrics + .metric-details");
    const summary = details.locator("summary");
    assert.equal(await details.getAttribute("open"), null);
    await summary.press("Enter");
    assert.ok(await page.locator("#" + group + "-status").isVisible());
    summaries.push(summary);
  }
  await audit(state);
  for (const summary of summaries) await summary.press("Enter");
}
