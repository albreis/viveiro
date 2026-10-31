const indexes=new WeakMap();
const CELL=.8;
const key=(x,y,z)=>x+':'+y+':'+z;

export function neighborsOf(world,agent,radius=1.2){
  let index=indexes.get(world);
  if(!index||index.tick!==world.tick){
    index={tick:world.tick,cells:new Map(),queries:new Map()};
    for(const ant of world.ants){
      const cell=key(Math.floor(ant.x/CELL),Math.floor((ant.y||0)/CELL),Math.floor(ant.z/CELL));
      if(!index.cells.has(cell))index.cells.set(cell,[]);
      index.cells.get(cell).push(ant);
    }
    indexes.set(world,index);
  }
  const queryKey=agent.id+':'+radius;
  if(index.queries.has(queryKey))return index.queries.get(queryKey);
  const result=[],span=Math.ceil(radius/CELL);
  const cx=Math.floor(agent.x/CELL),cy=Math.floor((agent.y||0)/CELL),cz=Math.floor(agent.z/CELL);
  for(let y=cy-span;y<=cy+span;y++){
    for(let z=cz-span;z<=cz+span;z++){
      for(let x=cx-span;x<=cx+span;x++){
        for(const other of index.cells.get(key(x,y,z))||[]){
          if(other.id===agent.id)continue;
          if(Math.hypot(other.x-agent.x,(other.y||0)-(agent.y||0),other.z-agent.z)<=radius){
            result.push(other);
          }
        }
      }
    }
  }
  index.queries.set(queryKey,result);
  return result;
}
