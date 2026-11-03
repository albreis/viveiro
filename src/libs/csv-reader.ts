/** Small RFC4180 reader for exported observations, including BOM, quotes and CRLF. */
export function readCsv(text: string): string[][] {
  const rows: string[][] = [],
    row: string[] = [];
  let value = "",
    quoted = false,
    closed = false;
  text = text.replace(/^\uFEFF/, "");
  const cell = () => {
    row.push(value);
    value = "";
    closed = false;
  };
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          value += '"';
          i++;
        } else {
          quoted = false;
          closed = true;
        }
      } else value += ch;
    } else if (ch === '"') {
      if (value || closed) throw Error("Aspas fora de posição no CSV.");
      quoted = true;
    } else if (ch === ",") cell();
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      cell();
      rows.push([...row]);
      row.length = 0;
    } else {
      if (closed) throw Error("Texto após aspas no CSV.");
      value += ch;
    }
  }
  if (quoted) throw Error("Campo CSV não terminado.");
  if (value || row.length || closed) {
    cell();
    rows.push([...row]);
  }
  if (rows.some((r) => r.length !== rows[0].length))
    throw Error("Largura inconsistente no CSV.");
  return rows;
}
