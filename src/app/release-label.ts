import { message } from "../i18n/runtime.ts";
import { version } from "../../package.json" with { type: "json" };
export function renderReleaseLabel() {
  const label = document.getElementById("release-label");
  if (label) message(label, "status.release", { version });
}
