import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
const out = resolve("docs/divulgacao/saga-escavacao");
const files = readdirSync(resolve(out, "imagens"))
  .filter((f) => f.endsWith(".png"))
  .sort();
assert.equal(files.length, 12);
const cards = files.map((file) => {
  const b = readFileSync(resolve(out, "imagens", file));
  assert.equal(b.subarray(1, 4).toString(), "PNG");
  const width = b.readUInt32BE(16),
    height = b.readUInt32BE(20);
  assert.equal(width, 1080);
  assert.equal(height, 1350);
  return {
    file,
    width,
    height,
    bytes: b.length,
    sha256: createHash("sha256").update(b).digest("hex"),
  };
});
const markup = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Prévia do carrossel Viveiro</title><style>*{box-sizing:border-box}html,body{margin:0;background:#dfe6da}body{padding:16px;width:1148px;display:grid;grid-template-columns:repeat(4,270px);gap:12px}img{width:270px;height:337.5px;display:block}</style><body>${files.map((file) => `<img src="imagens/${file}" alt="${file}"/>`).join("")}</body></html>`;
writeFileSync(resolve(out, "previa.html"), markup);
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage({
    viewport: { width: 1148, height: 1070 },
    deviceScaleFactor: 1,
  });
  await page.goto(
    "file:///" + resolve(out, "previa.html").replaceAll("\\", "/"),
  );
  await page
    .locator("img")
    .evaluateAll((imgs) =>
      Promise.all(imgs.map((i) => (i as HTMLImageElement).decode())),
    );
  await page.screenshot({ path: resolve(out, "previa.png"), fullPage: true });
  writeFileSync(
    resolve(out, "manifesto.json"),
    JSON.stringify(
      {
        format: "viveiro-instagram-carousel-v1",
        cards: cards.length,
        aspectRatio: "4:5",
        orderedImages: cards,
        captionCharacters: readFileSync(resolve(out, "legenda.txt"), "utf8")
          .length,
        browser: browser.version(),
        factsSha256Lf: createHash("sha256")
          .update(
            readFileSync(resolve(out, "dados.json"), "utf8").replaceAll(
              "\r\n",
              "\n",
            ),
          )
          .digest("hex"),
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    JSON.stringify({
      images: cards.length,
      dimensions: "1080x1350",
      bytes: cards.reduce((n, c) => n + c.bytes, 0),
    }),
  );
} finally {
  await browser.close();
}
