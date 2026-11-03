import { test } from "node:test";
import assert from "node:assert/strict";
import { localizedLink } from "../src/i18n/links.ts";
import { createDomTranslations } from "../src/i18n/dom.ts";
import { LocaleController } from "../src/i18n/controller.ts";

const rejected = [
  "javascript:alert(1)",
  "JaVaScRiPt:alert(1)",
  "java\nscript:alert(1)",
  "data:text/html,<script>alert(1)</script>",
  "vbscript:msgbox(1)",
  "https://example.org/modelo/index.html",
  "//example.org/index.html",
  "\\\\example.org\\index.html",
  "./../index.html",
  "./modelo/../index.html",
  "./modelo/%2e%2e/index.html",
  "./modelo/index.html/../../other.html",
  './modelo/index.html"><img src=x onerror=alert(1)>',
  "./licencas.htmljavascript:alert(1)",
  "./modelo/unregistered.html",
  "./index.html#%broken",
  "./experimentos/raw.csv",
  "./index.html\0",
];

test("localized hrefs reject executable schemes, external destinations and unregistered paths", () => {
  for (const locale of ["pt-BR", "en"])
    for (const value of rejected)
      assert.equal(localizedLink(value, locale), null, value);
  assert.equal(localizedLink("./index.html", "invalid"), null);
});

test("query and fragment payloads stay encoded data within the versioned release", () => {
  for (const locale of ["pt-BR", "en"])
    for (const payload of [
      "javascript:alert(1)",
      '\"><img src=x onerror=alert(1)>',
      "'>&\n\\",
      "Água + %",
    ]) {
      const href = localizedLink(
        "./experimentos.html?value=" +
          encodeURIComponent(payload) +
          "#" +
          encodeURIComponent(payload),
        locale,
      );
      assert.ok(href);
      assert.ok(!/[<>"'\n\r\\]/.test(href));
      const resolved = new URL(href, "https://example.org/releases/v0.45.0/");
      assert.equal(resolved.origin, "https://example.org");
      assert.equal(resolved.pathname, "/releases/v0.45.0/experimentos.html");
      assert.equal(resolved.searchParams.get("value"), payload);
      assert.equal(resolved.searchParams.get("lang"), locale);
      assert.equal(decodeURIComponent(resolved.hash.slice(1)), payload);
    }
});

// Minimal attribute adapter observes writes at the production binding boundary.
class Anchor {
  tagName = "A";
  textContent = "";
  attributes = new Map();
  writes = [];
  constructor(value) {
    this.attributes.set("href", "./modelo/index.html");
    this.attributes.set("data-i18n-href", value);
  }
  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }
  setAttribute(name, value) {
    this.attributes.set(name, value);
    this.writes.push([name, value]);
  }
  removeAttribute(name) {
    this.attributes.delete(name);
  }
  set innerHTML(_) {
    throw Error("Translation must never parse HTML");
  }
}

test("DOM translation leaves rejected hrefs intact and keeps untrusted text literal", () => {
  const controller = new LocaleController();
  controller.setLocale("en");
  const binding = createDomTranslations(controller);
  for (const value of rejected) {
    const anchor = new Anchor(value);
    binding.source(anchor, '<img src=x onerror="alert(1)">');
    assert.equal(anchor.getAttribute("href"), "./modelo/index.html");
    assert.ok(!anchor.writes.some(([name]) => name === "href"));
    assert.equal(anchor.textContent, '<img src=x onerror="alert(1)">');
  }
  const valid = new Anchor("./modelo/index.html");
  binding.set(valid, "terrarium.odd");
  assert.equal(valid.getAttribute("href"), "./en/modelo/index.html");
  controller.setLocale("pt-BR");
  binding.set(valid, "terrarium.odd");
  assert.equal(valid.getAttribute("href"), "./modelo/index.html");
  const other = new Anchor("./modelo/index.html");
  other.tagName = "DIV";
  binding.set(other, "terrarium.odd");
  assert.ok(!other.writes.some(([name]) => name === "href"));
});
