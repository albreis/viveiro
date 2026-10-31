import { NEST } from './constants.js';

export function createNest() {
  return {
    nodes: [
      {name:'Entrada oeste',x:NEST.x,y:.03,z:NEST.z,r:.36,type:'entrance'},
      {name:'Poço oeste',x:NEST.x,y:-.85,z:NEST.z,r:.31,type:'shaft'},
      {name:'Câmara da rainha',x:-3.6,y:-1.5,z:6.22,r:.67,type:'royal'},
      {name:'Berçário',x:-1.4,y:-2.65,z:6.22,r:.72,type:'nursery'},
      {name:'Despensa',x:2.1,y:-1.45,z:6.22,r:.65,type:'storage'},
      {name:'Resíduos',x:5.3,y:-3.05,z:6.22,r:.55,type:'waste'},
      {name:'Entrada leste',x:3,y:.03,z:2.5,r:.36,type:'entrance'},
      {name:'Poço leste',x:3,y:-.85,z:2.5,r:.31,type:'shaft'},
      {name:'Galeria principal',x:0,y:-1.5,z:6.22,r:.35,type:'junction'}
    ],
    links:[[0,1],[1,2],[2,8],[8,4],[8,3],[3,5],[4,7],[7,6],[2,3]],
    revision:2
  };
}
export function nestPath(nest,start,end,blocked=null) {
  const queue=[[start]],visited=new Set([start]);
  while(queue.length){const path=queue.shift(),node=path.at(-1);if(node===end)return path.slice(1);
    for(const edge of nest.links){if(blocked&&((edge[0]===blocked[0]&&edge[1]===blocked[1])||(edge[0]===blocked[1]&&edge[1]===blocked[0])))continue;const next=edge[0]===node?edge[1]:edge[1]===node?edge[0]:null;
      if(next!==null&&!visited.has(next)){visited.add(next);queue.push([...path,next]);}}
  }
  return [];
}
