import { message, locale, t } from "../i18n/runtime.ts";
import type { MessageKey } from "../i18n/catalogs.ts";
import {
  parameterRanges,
  parameterDetails,
  baseParameterRanges,
  type ExperimentParameter,
  type ExperimentParameters,
} from "../modules/experiments/parameters.ts";
const keys = Object.keys(parameterRanges) as ExperimentParameter[];
export function parameterFields(container: HTMLElement) {
  const inputs = new Map<ExperimentParameter, HTMLInputElement>(),
    toggles = new Map<ExperimentParameter, HTMLInputElement>();
  for (const key of keys) {
    const [min, max, fallback] = parameterRanges[key],
      meta = parameterDetails[key];
    const group = document.createElement("fieldset"),
      legend = document.createElement("legend");
    message(legend, ("profiles.parameter." + key) as MessageKey);
    group.append(legend);
    const label = document.createElement("label"),
      input = document.createElement("input");
    input.id = "parameter-" + key;
    input.type = "number";
    input.min = String(min);
    input.max = String(max);
    input.step = "any";
    input.value = String(fallback);
    input.required = true;
    const valueLabel = document.createElement("span");
    label.append(valueLabel, " ", input);
    group.append(label);
    const info = document.createElement("p");
    info.className = "parameter-source";
    info.id = "parameter-" + key + "-source";
    input.setAttribute("aria-describedby", info.id);
    const render = () => {
      const unit = t(("profiles.unit." + key) as MessageKey);
      message(valueLabel, "profiles.value", { unit });
      message(info, "profiles.source", {
        min,
        max,
        unit,
        source: meta.source,
        kind: t(
          meta.kind === "hypothesis"
            ? "profiles.hypothesis"
            : "profiles.approximation",
        ),
      });
    };
    render();
    const stop = locale.subscribe(render);
    window.addEventListener("pagehide", stop, { once: true });
    group.append(info);
    inputs.set(key, input);
    if (!Object.hasOwn(baseParameterRanges, key)) {
      const active = document.createElement("input"),
        wrap = document.createElement("label");
      active.type = "checkbox";
      input.disabled = true;
      const optionalLabel = document.createElement("span");
      message(optionalLabel, "profiles.optional");
      wrap.append(active, " ", optionalLabel);
      group.append(wrap);
      toggles.set(key, active);
      active.addEventListener("change", () => {
        input.disabled = !active.checked;
      });
    }
    container.append(group);
  }
  return {
    read(): ExperimentParameters {
      const result = {} as ExperimentParameters;
      for (const key of keys)
        if (!inputs.get(key)!.disabled)
          result[key] = Number(inputs.get(key)!.value);
      return result;
    },
    write(values: ExperimentParameters) {
      for (const key of keys) {
        const input = inputs.get(key)!,
          active = toggles.get(key),
          present = Object.hasOwn(values, key);
        input.value = String(values[key] ?? parameterRanges[key][2]);
        if (active) {
          active.checked = present;
          input.disabled = !present;
        }
      }
    },
  };
}
