import assert from "node:assert/strict";

export async function checkDesktopWorkbench(page) {
  const geometry = await page.evaluate(() => {
    const elements = (selector) => [...document.querySelectorAll(selector)];
    const box = (element) => element.getBoundingClientRect();
    const controls = elements(".secondary-controls > *");
    const analysis = document.querySelector(".analysis-band");
    const panels = elements(
      ".left-panel, .center-panel, .right-panel, #panel-soil",
    );
    return {
      onlyEnvironment:
        document.querySelector(".left-panel").children.length === 1 &&
        Boolean(document.querySelector(".left-panel > .environment")),
      sidebar: panels.map((panel) => ({
        position: getComputedStyle(panel).position,
        overflowY: getComputedStyle(panel).overflowY,
        hiddenHeight: panel.scrollHeight - panel.clientHeight,
      })),
      controls: controls.map((panel) => ({
        x: box(panel).x,
        top: box(panel).top,
        position: getComputedStyle(panel).position,
      })),
      analysisBottom: box(analysis).bottom,
    };
  });
  assert.equal(geometry.onlyEnvironment, true);
  assert.equal(geometry.controls.length, 3);
  assert.equal(new Set(geometry.controls.map((panel) => panel.x)).size, 3);
  assert.ok(
    geometry.controls.every(
      (panel) =>
        panel.top >= geometry.analysisBottom && panel.position === "sticky",
    ),
  );
  assert.ok(
    geometry.sidebar.every(
      (panel) => panel.overflowY === "visible" && panel.hiddenHeight <= 1,
    ),
  );
  assert.ok(
    geometry.sidebar.slice(0, 3).every((panel) => panel.position === "sticky"),
  );

  await checkColonyFlow(page);
  await page.locator("#panel-soil > :last-child").evaluate((card) => {
    card.scrollIntoView({ block: "end" });
  });
  const bottom = await page.locator("#panel-soil > :last-child").boundingBox();
  assert.ok(bottom.y + bottom.height <= page.viewportSize().height + 1);
  await checkStickyBoundaries(page);
}

export async function checkColonyFlow(page) {
  const overlap = await page.evaluate(async () => {
    const dock = document.querySelector(".colony-dock");
    const panel = document.querySelector(
      ".right-panel > [role=tabpanel]:not([hidden])",
    );
    const origin =
      scrollY +
      document.querySelector(".workspace-scene").getBoundingClientRect().top;

    for (const offset of [0, 80, 220, 400]) {
      scrollTo({ top: origin + offset, behavior: "instant" });
      await new Promise((done) => requestAnimationFrame(done));
      if (
        dock.getBoundingClientRect().bottom >
        panel.getBoundingClientRect().top + 1
      )
        return { tab: panel.id, scroll: scrollY };
    }
    return null;
  });
  assert.equal(
    overlap,
    null,
    "Resumo e abas devem rolar junto com o conteúdo da Colônia",
  );
}

async function checkStickyBoundaries(page) {
  const positions = await page.evaluate(async () => {
    const box = (selector) =>
      document.querySelector(selector).getBoundingClientRect();
    const pageTop = (selector) => scrollY + box(selector).top;
    const samples = [
      pageTop(".analysis-band") - 80,
      pageTop(".analysis-band") + 100,
      pageTop(".secondary-controls"),
      document.documentElement.scrollHeight,
    ];

    const positions = [];
    for (const top of samples) {
      scrollTo({ top, behavior: "instant" });
      await new Promise((done) => requestAnimationFrame(done));
      const controls = [
        ...document.querySelectorAll(".secondary-controls > *"),
      ].map((panel) => panel.getBoundingClientRect());
      positions.push({
        scroll: scrollY,
        sceneBottom: Math.max(
          ...[".left-panel", ".center-panel", ".right-panel"].map(
            (selector) => box(selector).bottom,
          ),
        ),
        analysisTop: box(".analysis-band").top,
        analysisBottom: box(".analysis-band").bottom,
        controlsTop: Math.min(...controls.map((panel) => panel.top)),
        controlsBottom: Math.max(...controls.map((panel) => panel.bottom)),
        footerTop: box("main > footer").top,
      });
    }
    return positions;
  });

  for (const position of positions) {
    assert.ok(
      position.sceneBottom <= position.analysisTop + 1,
      `O terrário sobrepôs a análise em scrollY=${position.scroll}`,
    );
    assert.ok(
      position.controlsTop >= position.analysisBottom - 1,
      `Os controles sobrepuseram a análise em scrollY=${position.scroll}`,
    );
    assert.ok(
      position.controlsBottom <= position.footerTop + 1,
      `Os controles sobrepuseram o rodapé em scrollY=${position.scroll}`,
    );
  }
}
