const COLORS = ["#6f8c50", "#b8784f", "#527f9b", "#aa9847"];
export const colonyColor = (id: number) =>
  COLORS[Math.abs(id - 1) % COLORS.length];
