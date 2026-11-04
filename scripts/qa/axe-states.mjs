import assert from "node:assert/strict";
import { checkColonyFlow, checkDesktopWorkbench } from "./workbench-layout.mjs";

export async function auditStates(page, open, audit, layoutOnly = false) {
  await open("index.html");
  await page.locator("#tour-open").waitFor();
  await page.locator("#loading").waitFor({ state: "hidden" });
  const click = (selector) => page.locator(selector).click();
  const show = (selector) =>
    page.locator(selector).waitFor({ state: "visible" });
  const hide = (selector) =>
    page.locator(selector).waitFor({ state: "hidden" });
  if (await page.locator("#tour-panel").isVisible()) await click("#tour-close");
  await hide("#resume-overlay");
  await audit("terrario-em-execucao");
  await click("#play");
  await show("#resume-overlay");
  await audit("terrario-pausado");
  const colonyTab = page.locator("#tab-colony");
  if (await colonyTab.count()) {
    await colonyTab.focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(
      await page.locator("#tab-soil").getAttribute("aria-selected"),
      "true",
    );
    await show("#panel-soil");
    if (page.viewportSize().width >= 1181) await checkDesktopWorkbench(page);
    await audit("aba-solo");
    await click("#tab-lab");
    if (page.viewportSize().width >= 1181) await checkColonyFlow(page);
    await audit("aba-laboratorio");
    await click("#tab-colony");
  }
  if (layoutOnly) return;
  await click("#view-top");
  assert.equal(
    await page.locator("#view-top").getAttribute("aria-pressed"),
    "true",
  );
  await click("#follow-ant");
  await show("#exit-ant");
  await audit("primeira-pessoa");
  await click("#exit-ant");
  await click("#help");
  await show("#help-dialog");
  await audit("ajuda-modal");
  await page.keyboard.press("Escape");
  await hide("#help-dialog");
  assert.equal(
    await page
      .locator("#help")
      .evaluate((node) => node === document.activeElement),
    true,
  );
  await click("#tour-open");
  await show("#tour-panel");
  if (page.viewportSize().width >= 1181 && (await colonyTab.count())) {
    const guide = await page.locator("#tour-panel").boundingBox();
    const colony = await page.locator(".metrics-panel").boundingBox();
    assert.ok(guide.x + guide.width <= colony.x);
  }
  await audit("tour-inicio");
  await click("#tour-next");
  await audit("tour-selecao");
  await page.keyboard.press("Escape");
  await hide("#tour-panel");
  assert.equal(
    await page
      .locator("#tour-open")
      .evaluate((node) => node === document.activeElement),
    true,
  );
  await click("#biology-open");
  await show("#biology-catalog");
  await audit("catalogo-biologico");
  await page.keyboard.press("Escape");
  await hide("#biology-catalog");
  await click("#compare");
  await show("#comparison-panel");
  await click('[data-scenario="b"]');
  assert.equal(
    await page.locator('[data-scenario="b"]').getAttribute("aria-pressed"),
    "true",
  );
  await audit("comparacao-b");
  await click("#forecast-benchmark > summary");
  await page.locator("#forecast-benchmark-rows td").first().waitFor();
  await audit("benchmark-aberto");
  await click("#compare");
  await page.locator("#biology-profile").selectOption("generic-demo@5");
  await page.locator("#seed").fill("QA-ESTACOES");
  await click("#apply-seed");
  await show("#photoperiod");
  assert.equal(
    await page.locator("#biology-profile optgroup option").count(),
    17,
  );
  await audit("fotoperiodo");

  await open("experimentos.html");
  await audit("laboratorio");
  await click("#parameter-editor > summary");
  await show("#parameter-profile-form");
  await audit("editor-de-perfis");

  await open("galeria.html");
  await page.locator("#gallery-list > *").first().waitFor();
  await audit("galeria");
  await page.locator("#gallery-search").fill("zzz-viveiro-sem-resultados");
  await show("#gallery-empty");
  await audit("galeria-vazia");

  await open("cronograma.html");
  await click('[data-view="personal"]');
  await page.locator("#roadmap-status").selectOption("done");
  assert.equal(await page.locator(".roadmap-task").count(), 1);
  await audit("cronograma-concluidos");
}
