import { version } from "../../package.json" with { type: "json" };
export function renderReleaseLabel() {
  const label = document.getElementById("release-label");
  if (label) label.textContent = "PROTÓTIPO v" + version;
}
