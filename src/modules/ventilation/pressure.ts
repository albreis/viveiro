import type { AirNetwork, GasWorld, GasState } from "./types.ts";
/** Graph Poiseuille network; pressure is an incompressible auxiliary variable, not measured Pa. */
export function solveAirPressure(w: GasWorld, net: AirNetwork, s: GasState) {
  const n = net.volume.length,
    fixed = new Map<number, number>();
  for (const i of net.vents) {
    const p = w.nest.nodes[i];
    fixed.set(
      i,
      0.04 * ((w.params.windX ?? 0) * p.x + (w.params.windZ ?? 0) * p.z),
    );
  }
  const neighbors = Array.from({ length: n }, () => [] as number[]);
  for (const e of net.edges)
    if (e.conductance > 0) {
      neighbors[e.a].push(e.b);
      neighbors[e.b].push(e.a);
    }
  const seen = new Set<number>();
  for (let i = 0; i < n; i++)
    if (!seen.has(i)) {
      const stack = [i],
        component: number[] = [];
      seen.add(i);
      while (stack.length) {
        const j = stack.pop()!;
        component.push(j);
        for (const k of neighbors[j])
          if (!seen.has(k)) {
            seen.add(k);
            stack.push(k);
          }
      }
      if (!component.some((j) => fixed.has(j))) fixed.set(i, 0);
    }
  const diagonal = new Float64Array(n),
    rhs = new Float64Array(n);
  for (const e of net.edges) {
    const g = e.conductance;
    diagonal[e.a] += g;
    diagonal[e.b] += g;
    rhs[e.a] -= g * e.head;
    rhs[e.b] += g * e.head;
    if (fixed.has(e.b)) rhs[e.a] += g * fixed.get(e.b)!;
    if (fixed.has(e.a)) rhs[e.b] += g * fixed.get(e.a)!;
  }
  const multiply = (v: Float64Array) => {
    const out = Float64Array.from(v, (x, i) =>
      fixed.has(i) ? 0 : diagonal[i] * x,
    );
    for (const e of net.edges)
      if (!fixed.has(e.a) && !fixed.has(e.b)) {
        out[e.a] -= e.conductance * v[e.b];
        out[e.b] -= e.conductance * v[e.a];
      }
    return out;
  };
  const dot = (a: Float64Array, b: Float64Array) =>
    a.reduce((sum, v, i) => sum + v * b[i], 0);
  const x = Float64Array.from({ length: n }, (_, i) =>
    fixed.has(i) ? 0 : (s.pressure[i] ?? 0),
  );
  const ax = multiply(x),
    r = Float64Array.from(rhs, (v, i) => (fixed.has(i) ? 0 : v - ax[i])),
    direction = r.slice();
  let rr = dot(r, r);
  for (let k = 0; k < Math.min(2 * n + 8, 1024) && rr > 1e-26; k++) {
    const ad = multiply(direction),
      den = dot(direction, ad);
    if (den <= 0) break;
    const alpha = rr / den;
    for (let i = 0; i < n; i++) {
      x[i] += alpha * direction[i];
      r[i] -= alpha * ad[i];
    }
    const next = dot(r, r),
      beta = next / rr;
    for (let i = 0; i < n; i++) direction[i] = r[i] + beta * direction[i];
    rr = next;
  }
  s.pressure = Array.from(x, (v, i) => fixed.get(i) ?? v);
  s.flow = net.edges.map(
    (e) => e.conductance * (s.pressure[e.a] - s.pressure[e.b] + e.head),
  );
  const balance = new Float64Array(n);
  net.edges.forEach((e, i) => {
    balance[e.a] += s.flow[i];
    balance[e.b] -= s.flow[i];
  });
  s.residual = balance.reduce(
    (max, v, i) => (net.vents.includes(i) ? max : Math.max(max, Math.abs(v))),
    0,
  );
  return Array.from(balance, (v, i) => (net.vents.includes(i) ? v : 0));
}
