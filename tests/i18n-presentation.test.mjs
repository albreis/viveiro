import { test } from "node:test";
import assert from "node:assert/strict";
import { translateSource } from "../src/i18n/source.ts";
import { staticTranslations } from "../src/i18n/static-html.ts";
import { normalizeExperiment } from "../src/modules/experiments/plan.ts";
import { normalizeParameterProfile } from "../src/modules/parameter-profiles/profile.ts";
import { LocaleController } from "../src/i18n/controller.ts";

test("canonical validation translates only at presentation, with identifiers and bounds intact", () => {
  const raw = "temperatureC: use um número entre 5 e 45.";
  assert.equal(
    translateSource(raw, "en"),
    "temperatureC: use a number between 5 and 45.",
  );
  assert.equal(translateSource(raw, "pt-BR"), raw);
  const en = translateSource(
    "Perfil qa-Árvore@2 aplicado. A seed e a duração do experimento foram preservadas.",
    "en",
  );
  assert.equal(
    en,
    "Profile qa-Árvore@2 applied. The experiment seed and duration were preserved.",
  );
  assert.equal(
    translateSource(en, "pt-BR"),
    "Perfil qa-Árvore@2 aplicado. A seed e a duração do experimento foram preservadas.",
  );
  const unknown = "<script>authored</script> · seed-Árvore";
  assert.equal(translateSource(unknown, "en"), unknown);
});

test("translated HTML slots have a Portuguese fallback and reject unknown or incomplete catalog keys", () => {
  const html =
    '<title data-i18n="experiments.pageTitle"></title><button data-i18n-aria-label="common.cancel"><span data-i18n="common.cancel"></span></button>';
  assert.match(staticTranslations(html), />Cancelar<\/span>/);
  assert.match(staticTranslations(html), /aria-label="Cancelar"/);
  assert.match(staticTranslations(html, "en"), />Cancel<\/span>/);
  assert.throws(
    () => staticTranslations('<span data-i18n="unknown"></span>'),
    /Unknown translation/,
  );
  assert.throws(
    () => staticTranslations('<span data-i18n="common.version"></span>'),
    /Missing translation argument/,
  );
});

test("language changes leave canonical experiment/profile bytes and validation errors independent of UI preference", () => {
  const profile = normalizeParameterProfile({
    schema: "viveiro-parameter-profile-v1",
    catalogVersion: 1,
    id: "qa-i18n",
    version: 1,
    label: "Nome escrito: Árvore",
    biologicalProfile: { schema: 1, id: "generic-demo", version: 5 },
    parameters: { initialFood: 12 },
  });
  const plan = normalizeExperiment({
    schema: "viveiro-experiment-v1",
    seed: "SEMENTE-Árvore",
    parameterProfile: profile,
    parameters: profile.parameters,
  });
  const before = JSON.stringify(plan);
  const ui = new LocaleController();
  for (const lang of ["en", "pt-BR", "en"]) {
    ui.setLocale(lang);
    assert.equal(JSON.stringify(normalizeExperiment(plan)), before);
    assert.equal(plan.parameterProfile.label, "Nome escrito: Árvore");
    assert.throws(
      () => normalizeExperiment({ ...plan, days: -1 }),
      /Escolha de 0 a 365 dias inteiros/,
    );
  }
});
