import { ATMOSPHERE, type AirNetwork, type GasState } from "./types.ts";
export function transportGases(
  s: GasState,
  net: AirNetwork,
  inlets: number[],
  dt: number,
) {
  const outgoing = new Float64Array(s.cells.length);
  net.edges.forEach(
    (e, i) => (outgoing[s.flow[i] >= 0 ? e.a : e.b] += Math.abs(s.flow[i])),
  );
  inlets.forEach((q, i) => {
    if (q < 0) outgoing[i] -= q;
  });
  const maxRate = outgoing.reduce(
    (max, q, i) => Math.max(max, q / s.cells[i].volume),
    0,
  );
  const steps = Math.max(1, Math.ceil(dt * Math.max(1, maxRate / 0.1))),
    h = dt / steps;
  for (let sub = 0; sub < steps; sub++)
    for (const species of ["oxygen", "carbon"] as const) {
      const delta = new Float64Array(s.cells.length);
      net.edges.forEach((e, i) => {
        const a = s.cells[e.a],
          b = s.cells[e.b],
          flow = s.flow[i],
          donor = flow >= 0 ? a : b;
        const q = (flow * h * donor[species]) / donor.volume;
        delta[e.a] -= q;
        delta[e.b] += q;
      });
      let boundary = 0;
      inlets.forEach((flow, i) => {
        const c = s.cells[i],
          q =
            flow *
            h *
            (flow >= 0 ? ATMOSPHERE[species] : c[species] / c.volume);
        delta[i] += q;
        boundary += q;
      });
      s.cells.forEach((c, i) => (c[species] += delta[i]));
      for (const e of net.edges) {
        const a = s.cells[e.a],
          b = s.cells[e.b];
        let q =
          e.diffusion * h * (a[species] / a.volume - b[species] / b.volume);
        const equilibrium =
          (a[species] * b.volume - b[species] * a.volume) /
          (a.volume + b.volume);
        q = Math.sign(q) * Math.min(Math.abs(q), Math.abs(equilibrium) * 0.45);
        a[species] -= q;
        b[species] += q;
      }
      for (const i of net.vents) {
        const c = s.cells[i],
          difference = ATMOSPHERE[species] - c[species] / c.volume;
        const q =
          difference *
          c.volume *
          Math.min(0.2, (net.ventDiffusion[i] / c.volume) * h);
        c[species] += q;
        boundary += q;
      }
      if (species === "oxygen") s.boundaryOxygen += boundary;
      else s.boundaryCarbon += boundary;
    }
}
