import {
  ATMOSPHERE,
  type AirNetwork,
  type GasState,
  type GasWorld,
} from "./types.ts";
export function syncGases(w: GasWorld, net: AirNetwork): GasState {
  if (!w.gases)
    w.gases = {
      version: 1,
      cells: [],
      pressure: [],
      flow: [],
      steps: 0,
      residual: 0,
      initialOxygen: 0,
      initialCarbon: 0,
      geometryOxygen: 0,
      geometryCarbon: 0,
      boundaryOxygen: 0,
      boundaryCarbon: 0,
      consumed: 0,
      produced: 0,
    };
  const s = w.gases,
    initial = s.cells.length === 0;
  for (let i = 0; i < net.volume.length; i++) {
    const old = s.cells[i],
      volume = net.volume[i];
    if (old) {
      const ratio = volume / old.volume,
        oxygen = old.oxygen * (ratio - 1),
        carbon = old.carbon * (ratio - 1);
      old.volume = volume;
      old.oxygen += oxygen;
      old.carbon += carbon;
      s.geometryOxygen += oxygen;
      s.geometryCarbon += carbon;
    } else {
      const neighbor = net.edges
        .flatMap((e) => (e.a === i ? [e.b] : e.b === i ? [e.a] : []))
        .map((j) => s.cells[j])
        .find(Boolean);
      const oxygen =
        volume *
        (neighbor ? neighbor.oxygen / neighbor.volume : ATMOSPHERE.oxygen);
      const carbon =
        volume *
        (neighbor ? neighbor.carbon / neighbor.volume : ATMOSPHERE.carbon);
      s.cells[i] = { volume, oxygen, carbon };
      if (initial) {
        s.initialOxygen += oxygen;
        s.initialCarbon += carbon;
      } else {
        s.geometryOxygen += oxygen;
        s.geometryCarbon += carbon;
      }
    }
  }
  for (const removed of s.cells.slice(net.volume.length)) {
    s.geometryOxygen -= removed.oxygen;
    s.geometryCarbon -= removed.carbon;
  }
  s.cells.length = net.volume.length;
  return s;
}
