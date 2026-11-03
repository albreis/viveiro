import { balancedReference } from "../modules/extensions/registry.ts";
import { normalizeExperiment } from "../modules/experiments/plan.ts";
const field = document.getElementById("experiment-plan") as HTMLTextAreaElement;
const picker = document.getElementById(
  "experiment-policy",
) as HTMLSelectElement;
function sync() {
  picker.disabled = field.disabled;
  try {
    const ref = JSON.parse(field.value).extension;
    picker.value =
      ref === undefined
        ? "aco"
        : JSON.stringify(ref) === JSON.stringify(balancedReference)
          ? "balanced"
          : "manual";
  } catch {
    picker.value = "manual";
  }
}
picker.addEventListener("change", () => {
  try {
    if (field.disabled) {
      sync();
      return;
    }
    const value = JSON.parse(field.value);
    if (picker.value === "aco") delete value.extension;
    else value.extension = balancedReference;
    field.value = JSON.stringify(normalizeExperiment(value), null, 2);
    field.dispatchEvent(new Event("input", { bubbles: true }));
  } catch (error) {
    const target = document.getElementById("experiment-error")!;
    target.textContent = error instanceof Error ? error.message : String(error);
    target.focus();
    sync();
  }
});
field.addEventListener("input", sync);
const observer = new MutationObserver(sync);
observer.observe(field, { attributes: true, attributeFilter: ["disabled"] });
window.addEventListener("pagehide", () => observer.disconnect(), {
  once: true,
});
