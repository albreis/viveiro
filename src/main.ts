import "./styles/index.css";
import { installLocalePicker } from "./i18n/picker.ts";
import { startTerrarium } from "./app/controller.ts";
import { renderReleaseLabel } from "./app/release-label.ts";
import { installOfflineControls } from "./app/offline-controls.ts";

installLocalePicker();
renderReleaseLabel();
await startTerrarium();
installOfflineControls();
