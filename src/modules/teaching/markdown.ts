export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
function inlineText(text: string) {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (all, label: string, href: string) => {
      if (
        !/^(https?:\/\/|(?:\.\.\/)?(?:[a-z0-9-]+\/)*[a-z0-9-]+\.(?:html|md|txt|json|csv)(?:#[a-z0-9-]+)?$)/i.test(
          href,
        )
      )
        return all;
      return '<a href="' + href + '">' + label + "</a>";
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
function inline(text: string) {
  return text
    .split(/(`[^`]+`)/g)
    .map((part) =>
      part.startsWith("`") && part.endsWith("`")
        ? "<code>" + escapeHtml(part.slice(1, -1)) + "</code>"
        : inlineText(part),
    )
    .join("");
}
/** Small trusted-document subset; raw HTML and executable link schemes stay text. */
export function teachingMarkdown(markdown: string): string {
  const html: string[] = [];
  let paragraph: string[] = [],
    list: "ul" | "ol" | undefined,
    itemText: string[] = [];
  const flush = () => {
    if (paragraph.length)
      html.push("<p>" + inline(paragraph.join(" ")) + "</p>");
    paragraph = [];
  };
  const closeItem = () => {
    if (itemText.length)
      html.push("<li>" + inline(itemText.join(" ")) + "</li>");
    itemText = [];
  };
  const closeList = () => {
    closeItem();
    if (list) html.push("</" + list + ">");
    list = undefined;
  };
  let table: string[] = [];
  const cells = (row: string) =>
    row
      .slice(1, -1)
      .split("|")
      .map((c) => c.trim());
  const closeTable = () => {
    if (!table.length) return;
    const rows = table.map(cells),
      header = rows[0];
    if (
      rows.length >= 2 &&
      rows[1].every((c) => /^:?-{3,}:?$/.test(c)) &&
      rows.every((r) => r.length === header.length)
    ) {
      html.push(
        '<div class="table-scroll" tabindex="0" role="region" aria-label="Tabela de dados"><table><thead><tr>' +
          header.map((c) => '<th scope="col">' + inline(c) + "</th>").join("") +
          "</tr></thead><tbody>" +
          rows
            .slice(2)
            .map(
              (r) =>
                "<tr>" +
                r.map((c) => "<td>" + inline(c) + "</td>").join("") +
                "</tr>",
            )
            .join("") +
          "</tbody></table></div>",
      );
    } else html.push("<p>" + inline(table.join(" ")) + "</p>");
    table = [];
  };
  let fenced = false,
    code: string[] = [];
  const closeCode = () => {
    html.push(
      '<pre tabindex="0" role="region" aria-label="Código ou equação em texto"><code>' +
        escapeHtml(code.join("\n")) +
        "</code></pre>",
    );
    code = [];
    fenced = false;
  };
  for (const raw of markdown.split(/\r?\n/)) {
    if (/^```[a-z0-9-]*\s*$/i.test(raw.trim())) {
      closeTable();
      if (fenced) closeCode();
      else {
        flush();
        closeList();
        fenced = true;
      }
      continue;
    }
    if (fenced) {
      code.push(raw);
      continue;
    }
    const line = raw.trim(),
      heading = /^(#{1,3}) (.+)$/.exec(line);
    const item = /^(?:([-*])|([0-9]+)\.) (.+)$/.exec(line);
    if (line.startsWith("|") && line.endsWith("|")) {
      flush();
      closeList();
      table.push(line);
      continue;
    }
    closeTable();
    if (!line) {
      flush();
      closeList();
      continue;
    }
    if (heading) {
      flush();
      closeList();
      html.push(
        "<h" +
          heading[1].length +
          ">" +
          inline(heading[2]) +
          "</h" +
          heading[1].length +
          ">",
      );
    } else if (item) {
      flush();
      const kind = item[1] ? "ul" : "ol";
      if (list !== kind) {
        closeList();
        list = kind;
        html.push("<" + kind + ">");
      }
      closeItem();
      itemText = [item[3]];
    } else if (list && /^\s{2,}\S/.test(raw)) {
      itemText.push(line);
    } else {
      closeList();
      paragraph.push(line);
    }
  }
  if (fenced) closeCode();
  closeTable();
  flush();
  closeList();
  return html.join("\n");
}
