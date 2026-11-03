import { installLocalePicker } from "../i18n/picker.ts";
import { locale, message } from "../i18n/runtime.ts";
import { gallery } from "../modules/gallery/catalog.ts";
import { galleryCard, entryText } from "./gallery-card.ts";
import metadata from "../../package.json" with { type: "json" };
installLocalePicker();
const search = document.querySelector<HTMLInputElement>("#gallery-search")!;
const topic = document.querySelector<HTMLSelectElement>("#gallery-topic")!;
const origin = document.querySelector<HTMLSelectElement>("#gallery-origin")!;
const list = document.querySelector<HTMLElement>("#gallery-list")!;
const count = document.querySelector<HTMLElement>("#gallery-count")!;
const empty = document.querySelector<HTMLElement>("#gallery-empty")!;
const urls: string[] = [];
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
function releaseUrls() {
  for (const url of urls) URL.revokeObjectURL(url);
  urls.length = 0;
}
function render() {
  releaseUrls();
  const query = normalize(search.value.trim());
  const selected = gallery.filter(
    (item) =>
      (!topic.value || topic.value === item.topic) &&
      (!origin.value || origin.value === item.credit.origin) &&
      normalize(
        [
          entryText(item, "title"),
          entryText(item, "question"),
          item.plan.seed,
        ].join(" "),
      ).includes(query),
  );
  list.replaceChildren(...selected.map((item) => galleryCard(item, urls)));
  message(count, "gallery.count", { count: selected.length });
  empty.hidden = selected.length > 0;
  message(document.querySelector("#gallery-version")!, "gallery.version", {
    version: metadata.version,
  });
}
document
  .querySelector(".gallery-filters")!
  .addEventListener("submit", (event) => event.preventDefault());
search.addEventListener("input", render);
topic.addEventListener("change", render);
origin.addEventListener("change", render);
const stop = locale.subscribe(render);
render();
window.addEventListener(
  "pagehide",
  () => {
    stop();
    releaseUrls();
  },
  { once: true },
);
