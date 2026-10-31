// The renderer and locomotion sample the same terrain cells.
export const SOIL_GRID={nx:96,ny:28,nz:64,sx:20/96,sy:4.2/28,sz:13/64};
const caches=new WeakMap();
function terrainCache(nest){
  let cache=caches.get(nest);
  if(!cache||cache.revision!==nest.revision){
    cache={revision:nest.revision,columns:new Map(),voxels:new Map()};
    caches.set(nest,cache);
  }
  return cache;
}
export function terrainVoid(nest,x,y,z){
  for(const p of nest.nodes)if(Math.hypot(x-p.x,y-p.y,z-p.z)<p.r)return true;
  for(let i=0;i<nest.links.length;i++){
    const [ai,bi]=nest.links[i];
    const a=nest.nodes[ai],b=nest.nodes[bi],dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
    const t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy+(z-a.z)*dz)/(dx*dx+dy*dy+dz*dz||1)));
    if(Math.hypot(x-a.x-t*dx,y-a.y-t*dy,z-a.z-t*dz)<(nest.linkWidths?.[i]||.38))return true;
  }
  return false;
}
function cellEmpty(nest,x,y,z){
  const g=SOIL_GRID;
  if(x<0||x>=g.nx||z<0||z>=g.nz||y<0)return false;
  if(y>=g.ny)return true;
  const cache=terrainCache(nest),key=(y*g.nz+z)*g.nx+x;
  if(cache.voxels.has(key))return cache.voxels.get(key);
  const empty=terrainVoid(nest,-10+(x+.5)*g.sx,-4.2+(y+.5)*g.sy,-6.5+(z+.5)*g.sz);
  cache.voxels.set(key,empty);return empty;
}
export function tunnelEnvelope(nest,x,z,referenceY){
  const g=SOIL_GRID,ix=Math.max(0,Math.min(g.nx-1,Math.floor((x+10)/g.sx))),iz=Math.max(0,Math.min(g.nz-1,Math.floor((z+6.5)/g.sz)));
  let iy=Math.max(0,Math.min(g.ny-1,Math.floor((referenceY+4.2)/g.sy)));
  const cache=terrainCache(nest);
  const key=ix+':'+iz+':'+iy;if(cache.columns.has(key))return cache.columns.get(key);
  if(!cellEmpty(nest,ix,iy,iz)){
    let found=false;
    for(let d=1;d<5&&!found;d++)for(const sign of [-1,1])if(iy+sign*d>=0&&iy+sign*d<g.ny&&cellEmpty(nest,ix,iy+sign*d,iz)){iy+=sign*d;found=true;break;}
    if(!found)return {floor:referenceY,ceiling:referenceY,inside:false};
  }
  let low=iy,high=iy;
  while(low>0&&cellEmpty(nest,ix,low-1,iz))low--;
  while(high<g.ny-1&&cellEmpty(nest,ix,high+1,iz))high++;
  const result={floor:-4.2+low*g.sy,ceiling:high===g.ny-1?Infinity:-4.2+(high+1)*g.sy,inside:true};
  cache.columns.set(key,result);return result;
}
export function tunnelFooting(nest,center,from,to,wallAngle=.35){
  const g=SOIL_GRID,dx=to.x-from.x,dy=to.y-from.y,dz=to.z-from.z,horizontal=Math.hypot(dx,dz);
  if(horizontal>Math.abs(dy)*.7&&Math.abs(wallAngle)>.68){
    return boundaryFooting(nest,center,{x:dx,y:dy,z:dz},wallAngle);
  }
  if(Math.abs(dy)>horizontal*1.5){
    const laneZ=center.z+(dy>0?-.095:.095);
    const iy=Math.max(0,Math.min(g.ny-1,Math.floor((center.y+4.2)/g.sy))),iz=Math.max(0,Math.min(g.nz-1,Math.floor((laneZ+6.5)/g.sz)));
    let ix=Math.max(0,Math.min(g.nx-1,Math.floor((center.x+10)/g.sx)));
    while(ix<g.nx-1&&cellEmpty(nest,ix+1,iy,iz))ix++;
    return {x:-10+(ix+1)*g.sx-.012,y:center.y,z:laneZ,normal:{x:-1,y:0,z:0},pitch:dy>0?Math.PI/2:-Math.PI/2,inside:true};
  }
  const lane=.13*Math.min(1,Math.hypot(center.x-from.x,center.z-from.z)/.3,Math.hypot(center.x-to.x,center.z-to.z)/.3);
  const x=center.x-(horizontal?dz/horizontal:0)*lane,z=center.z+(horizontal?dx/horizontal:0)*lane;
  const envelope=tunnelEnvelope(nest,x,z,center.y);
  return {x,y:envelope.floor+.008,z,normal:{x:0,y:1,z:0},pitch:0,inside:envelope.inside};
}

function solidAt(nest,p){
  const g=SOIL_GRID;
  if(p.y>=0)return false;
  return !cellEmpty(nest,Math.floor((p.x+10)/g.sx),
    Math.floor((p.y+4.2)/g.sy),Math.floor((p.z+6.5)/g.sz));
}

function boundaryFooting(nest,center,direction,angle){
  const size=Math.hypot(direction.x,direction.y,direction.z)||1;
  const axis={x:direction.x/size,y:direction.y/size,z:direction.z/size};
  const horizontal=Math.hypot(axis.x,axis.z)||1;
  const side={x:-axis.z/horizontal,y:0,z:axis.x/horizontal};
  const out={
    x:side.x*Math.sin(angle),
    y:-Math.cos(angle),
    z:side.z*Math.sin(angle)
  };
  let previous={...center},hit=null;
  for(let distance=.025;distance<=1.25;distance+=.025){
    const p={x:center.x+out.x*distance,y:center.y+out.y*distance,z:center.z+out.z*distance};
    if(solidAt(nest,p)){hit=p;break;}previous=p;
  }
  if(!hit)return {inside:false};
  for(let i=0;i<5;i++){
    const middle={x:(previous.x+hit.x)/2,y:(previous.y+hit.y)/2,z:(previous.z+hit.z)/2};
    if(solidAt(nest,middle))hit=middle;else previous=middle;
  }
  const normal={x:-out.x,y:-out.y,z:-out.z};
  const normalSize=Math.hypot(normal.x,normal.y,normal.z)||1;
  normal.x/=normalSize;normal.y/=normalSize;normal.z/=normalSize;
  return {
    x:previous.x+normal.x*.008,y:previous.y+normal.y*.008,
    z:previous.z+normal.z*.008,normal,pitch:Math.atan2(axis.y,horizontal),
    heading:Math.atan2(axis.z,axis.x),inside:true
  };
}
