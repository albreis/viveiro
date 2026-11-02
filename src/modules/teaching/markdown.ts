export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
function inline(text: string) {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (all, label: string, href: string) => {
      if (
        !/^(https?:\/\/|(?:[a-z0-9-]+\/)*[a-z0-9-]+\.(?:html|md|txt)(?:#[a-z0-9-]+)?$)/i.test(
          href,
        )
      )
        return all;
      return '<a href="' + href + '">' + label + "</a>";
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
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
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trim(),
      heading = /^(#{1,3}) (.+)$/.exec(line);
    const item = /^(?:([-*])|([0-9]+)\.) (.+)$/.exec(line);
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
  flush();
  closeList();
  return html.join("\n");
}
