import {test} from 'node:test';
import assert from 'node:assert/strict';
import {World} from '../src/modules/simulation/world.js';
import {SOIL_GRID as g,terrainVoid} from '../src/modules/terrain/terrain.js';

function nearestSupport(nest,p){
  const ix=Math.floor((p.x+10)/g.sx),iy=Math.floor((p.y+4.2)/g.sy);
  const iz=Math.floor((p.z+6.5)/g.sz);
  let distance=Infinity;
  for(let y=iy-1;y<=iy+1;y++)for(let z=iz-1;z<=iz+1;z++)for(let x=ix-1;x<=ix+1;x++){
    const min={x:-10+x*g.sx,y:-4.2+y*g.sy,z:-6.5+z*g.sz};
    if(min.y>=0)continue;
    const outside=x<0||x>=g.nx||z<0||z>=g.nz||y<0;
    if(!outside&&terrainVoid(nest,min.x+g.sx/2,min.y+g.sy/2,min.z+g.sz/2))continue;
    const d=Math.hypot(
      Math.max(min.x-p.x,0,p.x-min.x-g.sx),
      Math.max(min.y-p.y,0,p.y-min.y-g.sy),
      Math.max(min.z-p.z,0,p.z-min.z-g.sz));
    distance=Math.min(distance,d);
  }
  return distance;
}

test('workers keep bounded movement and reachable terrain support through tunnel transitions',()=>{
  const w=new World('support-regression'),previous=new Map();
  let maxJump=0,maxGap=0,checked=0;
  for(let tick=0;tick<650;tick++){
    w.step();
    for(const ant of w.workers){
      const old=previous.get(ant.id);
      if(old){
        const displacement=Math.hypot(ant.x-old.x,ant.y-old.y,ant.z-old.z);
        maxJump=Math.max(maxJump,displacement);
        assert.ok(displacement<=ant.speed*1.2+.002,'unbounded step for ant '+ant.id);
      }
      if(tick%5===0){
        const gap=nearestSupport(w.nest,ant);
        maxGap=Math.max(maxGap,gap);checked++;
        assert.ok(gap<=.11,'unsupported ant '+ant.id+' gap '+gap.toFixed(3)+' in '+ant.state);
      }
      previous.set(ant.id,{x:ant.x,y:ant.y,z:ant.z});
    }
  }
  console.log(JSON.stringify({checked,maxJump,maxGap}));
});
