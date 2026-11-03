import { installLocalePicker } from "./i18n/picker.ts";
installLocalePicker();
import "./styles/index.css";
import "./app/controller.ts";

import { renderReleaseLabel } from "./app/release-label.ts";
renderReleaseLabel();

import { installOfflineControls } from "./app/offline-controls.ts";
installOfflineControls();
