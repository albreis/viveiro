import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import axe from "axe-core";
import { preview } from "vite";
import metadata from "../../package.json" with { type: "json" };
import { auditStates } from "./axe-states.mjs";
import { scan } from "./axe-scan.mjs";

const out = resolve(process.env.VIVEIRO_QA_OUTPUT ?? ".runtime/axe");
const quick = process.argv.includes("--desktop");
const viewports = [
  { width: 1440, height: 900 },
  { width: 820, height: 1180 },
  { width: 390, height: 844 },
];
await mkdir(out, { recursive: true });
const server = await preview({
  logLevel: "error",
  preview: { host: "127.0.0.1", port: 0 },
});
let browser;
try {
  browser = await chromium.launch({
    ...(process.env.VIVEIRO_QA_CHROME
      ? { executablePath: process.env.VIVEIRO_QA_CHROME }
      : { channel: "chrome" }),
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const address = server.httpServer.address();
  if (!address || typeof address === "string")
    throw Error("Preview sem endereço TCP");
  const base = "http://127.0.0.1:" + address.port + "/";
  const report = {
    version: metadata.version,
    browser: browser.version(),
    axe: axe.version,
    createdAt: new Date().toISOString(),
    cases: [],
  };
  for (const viewport of quick ? viewports.slice(0, 1) : viewports) {
    for (const locale of quick ? ["pt-BR"] : ["pt-BR", "en"]) {
      const context = await browser.newContext({ viewport, locale });
      try {
        const page = await context.newPage();
        page.setDefaultTimeout(12000);
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        const open = async (path) => {
          const response = await page.goto(base + path + "?lang=" + locale);
          if (!response?.ok()) throw Error("Falha ao abrir " + path);
          await page.locator("#language-picker").waitFor();
        };
        await auditStates(page, open, async (state) => {
          const result = await scan(page, state);
          report.cases.push({ locale, viewport, ...result });
          console.log(
            locale,
            viewport.width,
            state,
            result.violations.length,
            result.incomplete.length,
          );
          await writeFile(
            resolve(out, "report.json"),
            JSON.stringify(report, null, 2) + "\n",
          );
        });
        if (errors.length) throw Error(errors.join("\n"));
      } finally {
        await context.close();
      }
    }
  }
  const violations = report.cases.reduce(
    (n, entry) => n + entry.violations.length,
    0,
  );
  console.log(
    JSON.stringify({
      cases: report.cases.length,
      violations,
      report: resolve(out, "report.json"),
    }),
  );
  if (violations) process.exitCode = 1;
} finally {
  await browser?.close();
  await server.close();
}
