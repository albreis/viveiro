import { readFileSync } from "node:fs";
import { resolve, sep } from "node:path";
/** Expand trusted structural fragments while keeping editable source files small. */
export function htmlIncludes(
  root: string,
  html: string,
  stack: string[] = [],
): string {
  const directory = resolve(root, "src/templates");
  return html.replace(
    /<!--\s*@include\s+([^\s]+)\s*-->/g,
    (_all, name: string) => {
      const path = resolve(directory, name);
      if (!path.startsWith(directory + sep) || !path.endsWith(".html"))
        throw Error("Invalid HTML fragment: " + name);
      if (stack.includes(path) || stack.length >= 16)
        throw Error("Cyclic or excessively nested HTML fragment: " + name);
      return htmlIncludes(root, readFileSync(path, "utf8"), [...stack, path]);
    },
  );
}
