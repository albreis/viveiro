import {add,sub,scale,dot,length,normalize,cross,limit,position} from './vectors.js';

export const loaded = ant => !!(ant.hasFood||ant.carrying>0||ant.carryingBrood);
export const NAVIGATION = {
  sensingRadius:1.2,
  safetyRadius:.52,
  relaxationTicks:2.8,
  repulsion:.018,
  lateralStrength:.028
};

// A locally sensed social-force adaptation, not a calibrated biological law.
export function socialForces(agent,neighbors,direction,speed,options={}){
  const normal=options.normal||{x:0,y:1,z:0};
  const forward=normalize(direction);
  const side=normalize(cross(forward,normal));
  const velocity=agent.navigation?.velocity||{x:0,y:0,z:0};
  const desired=scale(sub(scale(forward,speed),velocity),1/NAVIGATION.relaxationTicks);
  let repulsion={x:0,y:0,z:0},pressure=0,frontal=null;
  for(const other of neighbors){
    const offset=sub(position(agent),position(other));
    const distance=length(offset);
    if(distance>NAVIGATION.safetyRadius)continue;
    const away=distance>.001?scale(offset,1/distance):
      scale(side,agent.id<other.id?1:-1);
    const weight=loaded(other)&&!loaded(agent)?2:1;
    const strength=Math.min(.1,NAVIGATION.repulsion*weight*
      Math.max(0,1/(distance+.08)-1/(NAVIGATION.safetyRadius+.08)));
    repulsion=add(repulsion,scale(away,strength));
    if(dot(away,forward)<-.25){
      pressure+=weight*(1-distance/NAVIGATION.safetyRadius);
      frontal=other;
    }
  }
  if(pressure>0){
    repulsion=add(repulsion,scale(side,pressure*NAVIGATION.lateralStrength));
    if(options.climb)repulsion.y+=pressure*.009;
  }
  const total=add(desired,repulsion);
  const nextVelocity=limit(add(velocity,total),speed*1.15);
  return {desired,repulsion,total,velocity:nextVelocity,pressure,frontal};
}
