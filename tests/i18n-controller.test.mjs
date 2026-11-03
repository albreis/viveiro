import { test } from "node:test";
import assert from "node:assert/strict";
import { LocaleController } from "../src/i18n/controller.ts";
import {
  browserLocaleController,
  localePreferenceKey,
} from "../src/i18n/browser.ts";
test("locale controller changes presentation without reloading; subscriptions can be released", () => {
  const written = [],
    events = [];
  const c = new LocaleController({
    read: () => null,
    write: (v) => written.push(v),
  });
  assert.equal(c.locale, "pt-BR");
  assert.equal(c.number(1.25), "1,25");
  const stop = c.subscribe((v) => events.push(v));
  assert.deepEqual(c.setLocale("en"), { changed: true, persisted: true });
  assert.equal(c.text("common.cancel"), "Cancel");
  assert.equal(c.number(1.25), "1.25");
  assert.equal(c.number(null), "No data");
  assert.equal(c.number(NaN), "No data");
  assert.deepEqual(c.setLocale("en"), { changed: false, persisted: true });
  assert.deepEqual(events, ["en"]);
  assert.deepEqual(written, ["en"]);
  stop();
  c.setLocale("pt-BR");
  assert.deepEqual(events, ["en"]);
});
test("unavailable storage does not prevent presentation; invalid locale never reaches the preference adapter", () => {
  const c = new LocaleController({
    read: () => {
      throw Error("blocked");
    },
    write: () => {
      throw Error("quota");
    },
  });
  assert.equal(c.locale, "pt-BR");
  assert.deepEqual(c.setLocale("en"), { changed: true, persisted: false });
  assert.throws(() => c.setLocale("invented"), /Unsupported/);
  assert.equal(c.locale, "en");
});
test("browser adapter uses an independent preference and preserves URLs and existing saved values", () => {
  const map = new Map([
    ["saved-terrarium", "preserve"],
    [localePreferenceKey, "pt-BR"],
  ]);
  const browser = {
    location: {
      href: "https://example.org/experimentos.html?seed=KEPT&lang=en#varredura",
    },
    localStorage: {
      getItem: (k) => map.get(k) ?? null,
      setItem: (k, v) => map.set(k, v),
    },
  };
  browser.history = {
    state: { kept: true },
    replaceState: (_state, _title, url) => {
      browser.location.href = url;
    },
  };
  const c = browserLocaleController(browser),
    before = browser.location.href;
  assert.equal(c.locale, "en");
  c.setLocale("pt-BR");
  const next = new URL(browser.location.href),
    prior = new URL(before);
  assert.equal(next.searchParams.get("lang"), "pt-BR");
  assert.equal(next.searchParams.get("seed"), prior.searchParams.get("seed"));
  assert.equal(next.hash, prior.hash);
  assert.equal(map.get("saved-terrarium"), "preserve");
  assert.equal(map.get(localePreferenceKey), "pt-BR");
});
