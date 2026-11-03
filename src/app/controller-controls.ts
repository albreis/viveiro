import type { ViewController } from "./view-controller.ts";
import { installEnvironmentControls } from "./controls-environment.ts";
import { installExperimentsControls } from "./controls-experiments.ts";
import { installHelpControls } from "./controls-help.ts";
import { installExportControls } from "./controls-export.ts";
export function installControllerControls(this: ViewController) {
  installEnvironmentControls.call(this);
  installExperimentsControls.call(this);
  installHelpControls.call(this);
  installExportControls.call(this);
}
