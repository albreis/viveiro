import { prepareDiggingWorld } from "/home/user/viveiro/src/modules/benchmarks/digging-run.ts";
for (const s of ["BUHL-1","BUHL-2","BUHL-3"]) {
const w = prepareDiggingWorld(s, 10, {});
const n = w.nest; let v = 0;
for (const x of n.nodes) v += 4/3*Math.PI*x.r**3;
let l = 0; n.links.forEach(([a,b],i)=>{const A=n.nodes[a],B=n.nodes[b]; const w2=(n.linkWidths?.[i]??0.38); l += Math.PI*(w2/2)**2*Math.hypot(A.x-B.x,A.y-B.y,A.z-B.z);});
console.log(s, n.nodes.length, v.toFixed(3), l.toFixed(3), n.nodes.map(x=>x.r.toFixed(2)).join(","));
}
