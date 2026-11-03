import { validateCatalogs } from "../src/i18n/validation.ts";
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  catalogs,
  defaultLocale,
  supportedLocales,
  isLocale,
} from "../src/i18n/catalogs.ts";
import { translate, messageArguments } from "../src/i18n/core.ts";
test("i18n: locales preserve reference keys and interpolation variables", () => {
  const reference = catalogs[defaultLocale];
  for (const locale of supportedLocales) {
    assert.deepEqual(
      Object.keys(catalogs[locale]).sort(),
      Object.keys(reference).sort(),
    );
    for (const key of Object.keys(reference)) {
      assert.equal(typeof catalogs[locale][key], "string");
      assert.ok(catalogs[locale][key].trim());
      assert.deepEqual(
        messageArguments(catalogs[locale][key]),
        messageArguments(reference[key]),
        locale + ": " + key,
      );
    }
  }
});
test("i18n: Portuguese is default; interpolation preserves authored values and requires its arguments", () => {
  assert.equal(translate("common.cancel"), "Cancelar");
  assert.equal(translate("common.cancel", {}, "en"), "Cancel");
  assert.equal(
    translate("common.version", { version: "qa-Árvore" }, "en"),
    "Version qa-Árvore",
  );
  assert.throws(
    () => translate("common.version"),
    /Missing translation argument/,
  );
  assert.ok(isLocale("pt-BR"));
  assert.ok(isLocale("en"));
  assert.ok(!isLocale("invented"));
});

test("i18n: build validation rejects missing keys, extra keys and lost variables", () => {
  assert.deepEqual(validateCatalogs(catalogs, defaultLocale), []);
  const reference = { greeting: "Olá {name}" };
  const invalid = {
    "pt-BR": reference,
    en: { greeting: "Hello", extra: "Unexpected" },
  };
  const issues = validateCatalogs(invalid, "pt-BR");
  assert.ok(issues.some((i) => i.reason === "interpolation variables differ"));
  assert.ok(issues.some((i) => i.reason === "unknown reference key"));
  assert.ok(
    validateCatalogs({ "pt-BR": reference, en: {} }, "pt-BR").some(
      (i) => i.reason === "missing or empty message",
    ),
  );
});
