import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { cards } from "./slides.ts";
import type { Facts } from "./types.ts";
const root = resolve("docs/divulgacao/saga-escavacao");
const facts = JSON.parse(
  readFileSync(resolve(root, "dados.json"), "utf8"),
) as Facts;
const list = cards(facts);
assert.equal(list.length, 12);
const esc = (s: string) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const css = ["styles.css", "card-styles.css"]
  .map((f) => readFileSync("scripts/divulgacao/saga/" + f, "utf8"))
  .join("\n");
const markup = list
  .map(
    (c, i) =>
      `<article id="${c.slug}" class="${c.theme ?? "light"} ${c.kind ?? ""}"><div class="brand"><strong>viveiro.</strong><span class="count">${String(i + 1).padStart(2, "0")} / 12</span></div><div class="section">${esc(c.section.replace(/^\d{2} \/ /, ""))}</div><h1>${esc(c.title)}</h1>${c.lead ? `<p class="lead">${esc(c.lead)}</p>` : ""}<div class="body">${c.body}</div><p class="note">${esc(c.note)}</p></article>`,
  )
  .join('<div class="slide-separator"></div>');
writeFileSync(
  resolve(root, "carrossel.html"),
  `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Viveiro · a saga da escavação</title><style>${css}</style><body>${markup}</body></html>`,
);
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 1,
  });
  await page.goto(
    "file:///" + resolve(root, "carrossel.html").replaceAll("\\", "/"),
  );
  await page.evaluate(() => document.fonts.ready);
  const broken = await page
    .locator("img")
    .evaluateAll((imgs) =>
      imgs
        .filter(
          (i) =>
            !(i instanceof HTMLImageElement) || !i.complete || !i.naturalWidth,
        )
        .map((i) => i.getAttribute("src")),
    );
  assert.deepEqual(broken, [], "All renderer screenshots must load");
  const metrics = [];
  for (const c of list) {
    const card = page.locator(`[id="${c.slug}"]`);
    const check = await card.evaluate((el) => {
      const box = el.getBoundingClientRect();
      const note = el.querySelector(".note")!.getBoundingClientRect();
      const body = el.querySelector(".body")!.getBoundingClientRect();
      const overflow = Array.from(el.querySelectorAll("h1,.lead,.body>*,.note"))
        .filter((x) => {
          const b = x.getBoundingClientRect();
          return (
            b.right > box.right + 1 ||
            b.bottom > box.bottom + 1 ||
            b.left < box.left - 1
          );
        })
        .map((x) => x.className || x.tagName);
      return {
        height: box.height,
        noteTop: note.top - box.top,
        bodyBottom: body.bottom - box.top,
        overlap:
          Math.max(
            ...Array.from(el.querySelector(".body")!.children).map(
              (x) => x.getBoundingClientRect().bottom,
            ),
          ) >
          note.top - 10,
        overflow,
      };
    });
    assert.equal(check.height, 1350);

    await card.screenshot({ path: resolve(root, "imagens", c.slug + ".png") });
    metrics.push({ slug: c.slug, ...check });
  }
  writeFileSync(
    resolve(root, "qa-layout.json"),
    JSON.stringify(
      { browser: browser.version(), width: 1080, height: 1350, cards: metrics },
      null,
      2,
    ) + "\n",
  );
  assert.deepEqual(
    metrics.filter((m) => m.overlap || m.overflow.length),
    [],
    "Layout overflows",
  );
  console.log(
    JSON.stringify({ cards: list.length, size: "1080x1350", output: root }),
  );
} finally {
  await browser.close();
}
