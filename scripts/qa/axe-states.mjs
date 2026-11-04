import assert from "node:assert/strict";

export async function auditStates(page, open, audit) {
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
