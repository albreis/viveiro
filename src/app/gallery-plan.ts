import { galleryEntry, galleryPlan } from "../modules/gallery/catalog.ts";
import type { ExperimentPlan } from "../modules/experiments/plan.ts";
import type { MessageKey } from "../i18n/catalogs.ts";
import { locale, message, t } from "../i18n/runtime.ts";
/** Only an owned id@version can load a recipe. Never fetch or execute a URL from a query. */
export function initializeGalleryPlan(field: HTMLTextAreaElement): void {
  const requested = new URL(window.location.href).searchParams.get("gallery");
  if (requested === null) return;
  const item = galleryEntry(requested);
  const notice = document.createElement("p");
  notice.id = "gallery-source";
  notice.setAttribute("role", item ? "status" : "alert");
  field.closest("label")?.before(notice);
  if (!notice.isConnected) field.before(notice);
  if (item)
    field.value = JSON.stringify(
      galleryPlan(item) satisfies ExperimentPlan,
      null,
      2,
    );
  const render = () => {
    if (item)
      message(notice, "gallery.loaded", {
        title: t(("gallery.entry." + item.id + ".title") as MessageKey),
        version: item.version,
      });
    else message(notice, "gallery.notFound");
  };
  render();
  const stop = locale.subscribe(render);
  window.addEventListener("pagehide", stop, { once: true });
}
