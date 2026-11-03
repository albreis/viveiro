const { lessonWorld, finishLessonWorld } = await import(process.cwd() + "/src/modules/lessons/world.ts");
const w = lessonWorld("FLUXO-1", false, false);
w.nest.links.forEach(([a,b],i)=>{const A=w.nest.nodes[a],B=w.nest.nodes[b];console.log(i,A.type,B.type,Math.hypot(A.x-B.x,A.y-B.y,A.z-B.z).toFixed(2),"dy",(B.y-A.y).toFixed(2),"w",(w.nest.linkWidths?.[i]??0.38))});
const wk=w.ants.find(a=>a.kind==="worker")||w.makeAnt("worker",0,0); console.log("speed",wk.speed, "ants", w.ants.length);
