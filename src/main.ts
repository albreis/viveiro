import "./styles/index.css";
import "./app/controller.js";

import { renderReleaseLabel } from "./app/release-label.ts";
renderReleaseLabel();

import { installOfflineControls } from "./app/offline-controls.ts";
installOfflineControls();
