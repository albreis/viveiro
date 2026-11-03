export const baseParameterRanges = {
  humidity: [0, 100, 58],
  light: [0, 100, 72],
  randomness: [0, 100, 28],
  reposeAngle: [15, 55, 36],
  temperatureC: [5, 45, 24],
  windX: [-4, 4, 0],
  windZ: [-4, 4, 0],
} as const;
export const optionalParameterRanges = {
  photoperiodHours: [0, 24, 12],
  initialFood: [0, 36, 18],
  initialRainPulse: [0, 1, 0],
  surfaceDiffusionScale: [0.5, 1.5, 1],
  surfaceEvaporationScale: [0.5, 1.5, 1],
} as const;
export const parameterRanges = {
  ...baseParameterRanges,
  ...optionalParameterRanges,
} as const;
export type ExperimentParameter = keyof typeof parameterRanges;
export type ExperimentParameters = Record<
  keyof typeof baseParameterRanges,
  number
> &
  Partial<Record<keyof typeof optionalParameterRanges, number>>;
export const parameterDetails: Record<
  ExperimentParameter,
  {
    label: string;
    unit: string;
    source: string;
    kind: "approximation" | "hypothesis";
  }
> = {
  humidity: {
    label: "Umidade do ar",
    unit: "%",
    source: "simulation/environment-step.js; microclimate/boundaries.ts",
    kind: "approximation",
  },
  light: {
    label: "Luz solar",
    unit: "%",
    source: "landscape/dynamics.ts",
    kind: "approximation",
  },
  randomness: {
    label: "Aleatoriedade das decisões",
    unit: "%",
    source: "simulation/worker-step.js",
    kind: "hypothesis",
  },
  reposeAngle: {
    label: "Ângulo de repouso",
    unit: "graus",
    source: "granular/update.ts",
    kind: "approximation",
  },
  temperatureC: {
    label: "Temperatura do ar",
    unit: "°C",
    source: "microclimate/boundaries.ts",
    kind: "approximation",
  },
  windX: {
    label: "Vento X",
    unit: "u. do modelo",
    source: "simulation/environment-step.js",
    kind: "approximation",
  },
  windZ: {
    label: "Vento Z",
    unit: "u. do modelo",
    source: "simulation/environment-step.js",
    kind: "approximation",
  },
  photoperiodHours: {
    label: "Fotoperíodo",
    unit: "h/dia do modelo",
    source: "seasons/update.ts",
    kind: "hypothesis",
  },
  initialFood: {
    label: "Estoque inicial da colônia",
    unit: "u. de alimento",
    source: "experiments/initial-inputs.ts",
    kind: "hypothesis",
  },
  initialRainPulse: {
    label: "Pulso de chuva inicial",
    unit: "0–1 relativo",
    source: "experiments/initial-inputs.ts; landscape/dynamics.ts",
    kind: "hypothesis",
  },
  surfaceDiffusionScale: {
    label: "Escala de difusão superficial",
    unit: "multiplicador de D",
    source: "simulation/environment-step.js; chemistry/reaction-diffusion.ts",
    kind: "approximation",
  },
  surfaceEvaporationScale: {
    label: "Escala de evaporação superficial",
    unit: "multiplicador de lambda",
    source: "simulation/environment-step.js; chemistry/reaction-diffusion.ts",
    kind: "approximation",
  },
};
export function validateOptionalInputs(params: Record<string, unknown>): void {
  for (const [key, [min, max]] of Object.entries(optionalParameterRanges)) {
    const value = params[key];
    if (value === undefined) continue;
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < min ||
      value > max
    )
      throw Error(`Entrada ${key} fora de ${min}–${max}.`);
  }
}
