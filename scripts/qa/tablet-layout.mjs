import assert from "node:assert/strict";

export async function checkTabletLayout(page) {
  const layout = await page.evaluate(async () => {
    const box = (selector) =>
      document.querySelector(selector).getBoundingClientRect();
    scrollTo({ top: 0, behavior: "instant" });
    await new Promise((done) => requestAnimationFrame(done));

    const center = box(".center-panel");
    const scene = box(".scene-card");
    const workspace = box(".workspace");
    const left = box(".left-panel");
    const right = box(".right-panel");
    const environment = box(".environment");
    const analysis = box(".analysis-band");
    const secondary = box(".secondary-controls");
    const transport = box(".scene-controls");

    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    });
    await new Promise((done) => requestAnimationFrame(done));
    return {
      sceneFillsWidth: Math.abs(scene.width - workspace.width) <= 1,
      cardsBelowScene: Math.min(left.top, right.top) >= center.bottom,
      naturalHeights: Math.abs(left.height - environment.height) <= 1,
      secondaryAfterAnalysis: secondary.top >= analysis.bottom,
      transportStaysVisible:
        Math.abs(transport.top - box(".scene-controls").top) <= 1 &&
        Math.abs(transport.bottom - innerHeight) <= 1,
      footerClear: box("main > footer").bottom <= transport.top + 1,
    };
  });
  for (const [requirement, passed] of Object.entries(layout)) {
    assert.ok(passed, "Layout tablet: " + requirement);
  }

  await page.locator("#play").focus();
  for (const speed of [1, 3, 10]) {
    await page.keyboard.press("Tab");
    const speedButton = page.locator('[data-speed="' + speed + '"]');
    assert.ok(
      await speedButton.evaluate((node) => node === document.activeElement),
    );
    const box = await speedButton.boundingBox();
    assert.ok(box.width >= 44 && box.height >= 44);
  }
  await page.keyboard.press("Tab");
  assert.ok(
    await page
      .locator("#lesson-panel > summary")
      .evaluate(
        (node) =>
          node === document.activeElement &&
          node.getBoundingClientRect().bottom <=
            document.querySelector(".scene-controls").getBoundingClientRect()
              .top,
      ),
  );
  await page.evaluate(() => {
    document.activeElement?.blur();
    scrollTo({ top: 0, behavior: "instant" });
  });
}
