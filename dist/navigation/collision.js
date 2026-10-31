import {neighborsOf} from './sensors.js';

export function positionClear(world,entity,point,heading,pitch=0,normal={x:0,y:1,z:0}){
  const forward={x:Math.cos(heading)*Math.cos(pitch),y:Math.sin(pitch),z:Math.sin(heading)*Math.cos(pitch)};
  const side={
    x:forward.y*normal.z-forward.z*normal.y,
    y:forward.z*normal.x-forward.x*normal.z,
    z:forward.x*normal.y-forward.y*normal.x
  };
  for(const other of neighborsOf(world,entity)){
    const x=point.x-other.x,y=(point.y||0)-(other.y||0),z=point.z-other.z;
    const distance=x*x+y*y+z*z;
    const previous=(entity.x-other.x)**2+((entity.y||0)-(other.y||0))**2+(entity.z-other.z)**2;
    if(distance>previous+.0001)continue; // Escape from an existing overlap remains possible.
    const height=Math.abs(x*normal.x+y*normal.y+z*normal.z);
    const along=x*forward.x+y*forward.y+z*forward.z;
    const across=x*side.x+y*side.y+z*side.z;
    const radius=other.kind==='queen'?.53:.38;
    const width=other.kind==='queen'?.25:.14;
    if(height<.18&&(along/radius)**2+(across/width)**2<1)return false;
  }
  return true;
}
