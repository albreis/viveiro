import assert from "node:assert/strict";
import { test } from "node:test";
import { spreadsheetCsv } from "../src/app/spreadsheet-csv.ts";
import { csvCell } from "../src/modules/observations/csv.ts";

test("CSV de planilha usa convenções do idioma e preserva precisão, texto e vazios", () => {
  const headers = ["solo", "oxigênio", "CO₂", "semente", "aula", "valor"];
  const row = [
    23.18202761773769,
    null,
    0.23175515264929222,
    "123.45",
    'Aula; A, B. "ensaio"\r\nlinha 2',
    -1.25e-8,
  ];
  const source =
    "\ufeff" +
    [headers, row].map((r) => r.map(csvCell).join(",")).join("\r\n") +
    "\r\n";
  assert.equal(spreadsheetCsv(source, "en"), source);
  assert.equal(
    spreadsheetCsv(source, "pt-BR"),
    '\ufeff"solo";"oxigênio";"CO₂";"semente";"aula";"valor"\r\n' +
      '23,18202761773769;;0,23175515264929222;"123.45";"Aula; A, B. ""ensaio""\r\nlinha 2";-1,25e-8\r\n',
  );
});

test("CSV localizado mantém a proteção de campos que começam com fórmula", () => {
  const seed = "=1+2";
  const source = "\ufeff" + [csvCell(seed), csvCell(2.5)].join(",") + "\r\n";
  assert.equal(spreadsheetCsv(source, "pt-BR"), '\ufeff"\'=1+2";2,5\r\n');
});
