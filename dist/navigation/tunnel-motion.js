import {tunnelFooting} from '../terrain.js';
import {nestPath} from '../nest.js';
import {neighborsOf} from './sensors.js';
import {socialForces} from './social-forces.js';
import {navigationState,contactResponse,recordCongestion,widenCongestedTunnel} from './contact.js';
import {positionClear} from './collision.js';
import {normalize,sub,scale,add,dot} from './vectors.js';

function rerouteAfterRetreat(world,ant,blocked){
  const destination=ant.route.at(-1);
  let route=nestPath(world.nest,ant.node,destination,blocked);
  if(!route.length){
    const exits=world.nest.nodes.map((node,id)=>({...node,id})).filter(n=>n.type==='entrance');
    for(const exit of exits){
      route=nestPath(world.nest,ant.node,exit.id,blocked);
      if(route.length){ant.avoidEntrance=exit.id;ant.avoidEntranceUntil=world.tick+250;break;}
    }
  }
  if(route.length)ant.route=route;
}

function finishSegment(world,ant,targetId,reversing,blocked){
  const nav=navigationState(ant);
  if(reversing){
    nav.retreating=false;nav.stagnantTicks=0;nav.contactTicks=0;
    if(world.nest.nodes[targetId].type==='entrance'){
      ant.avoidEntrance=targetId;ant.avoidEntranceUntil=world.tick+250;
      ant.route=[];ant.y=0;ant.node=null;ant.tunnelCenter=null;ant.tunnelY=0;
      ant.normal={x:0,y:1,z:0};ant.pitch=0;ant.state='Buscando outro acesso';
      nav.retreats++;return;
    }
    nav.retreats++;rerouteAfterRetreat(world,ant,blocked);
    ant.state='Reavaliando o caminho';return;
  }
  ant.node=ant.route.shift();
  if(ant.route.length)return;
  const target=world.nest.nodes[targetId];
  if(target.type==='storage'){
    world.food+=ant.carrying;ant.carrying=0;
    if(world.food>.15){world.food-=.15;ant.energy=100;}
    ant.route=nestPath(world.nest,ant.node,ant.id%2?0:6);
  }else if(target.type!=='entrance'){
    ant.route=nestPath(world.nest,ant.node,ant.id%2?0:6);
  }else{
    ant.y=0;ant.node=null;ant.tunnelCenter=null;ant.tunnelY=0;
    ant.normal={x:0,y:1,z:0};ant.pitch=0;ant.state='Explorando';
    ant.angle=world.range(0,Math.PI*2);nav.velocity={x:0,y:0,z:0};
  }
}

export function moveInNest(world,ant){
  const nav=navigationState(ant);
  recordCongestion(ant);
  const blocked=[ant.node,ant.route[0]];
  const edgeIndex=world.nest.links.findIndex(([a,b])=>
    (a===blocked[0]&&b===blocked[1])||(b===blocked[0]&&a===blocked[1]));
  if(widenCongestedTunnel(world,ant,edgeIndex))return;
  const reversing=!!nav.retreating;
  const targetId=reversing?ant.node:ant.route[0];
  const target=world.nest.nodes[targetId];
  if(!target){ant.route=[];return;}
  const center=ant.tunnelCenter||{
    x:ant.x,y:ant.tunnelY??world.nest.nodes[ant.node]?.y??ant.y,z:ant.z
  };
  const from=world.nest.nodes[reversing?ant.route[0]:ant.node]||center;
  const delta=sub(target,center),distance=Math.hypot(delta.x,delta.y,delta.z);
  const forward=normalize(delta),normal=ant.normal||{x:0,y:1,z:0};
  const neighbors=neighborsOf(world,ant),speed=ant.speed*.85;
  const initial=socialForces(ant,neighbors,forward,speed,{normal,climb:true});
  const preferred=contactResponse(world,ant,initial,forward,normal);
  const force=socialForces(ant,neighbors,preferred,speed,{normal,climb:true});
  nav.velocity=force.velocity;
  if(!reversing&&(nav.stagnantTicks>18+ant.id%17||
      (dot(preferred,forward)<0&&nav.contactTicks>3))){
    nav.retreating=true;ant.state='Recuando para liberar passagem';return;
  }
  nav.wallAngle=Math.max(.2,Math.min(1.6,nav.wallAngle+
    (force.pressure>.1?.045:-.018)));
  const step=Math.min(distance,Math.max(speed*.2,dot(force.velocity,forward)));
  const next=add(center,scale(forward,step));
  let footing=null;
  for(const angle of [nav.wallAngle,nav.wallAngle+.18,nav.wallAngle-.18,-nav.wallAngle]){
    const candidate=tunnelFooting(world.nest,next,from,target,angle);
    const heading=candidate.heading??Math.atan2(target.z-from.z,target.x-from.x);
    if(candidate.inside&&positionClear(world,ant,candidate,heading,candidate.pitch,candidate.normal)){
      footing=candidate;nav.wallAngle=angle;break;
    }
  }
  if(!footing){ant.state='Contato Antenal';return;}
  nav.velocity=sub(footing,ant);
  ant.distanceWalked=(ant.distanceWalked||0)+Math.hypot(
    footing.x-ant.x,footing.y-ant.y,footing.z-ant.z);
  Object.assign(ant,{
    x:footing.x,y:footing.y,z:footing.z,tunnelY:next.y,tunnelCenter:next,
    normal:footing.normal,pitch:footing.pitch,
    angle:footing.heading??Math.atan2(target.z-from.z,target.x-from.x)
  });
  if(reversing)ant.state='Recuando para liberar passagem';
  else if(nav.contactTicks<4)ant.state=ant.carrying?'Indo para a despensa':'Percorrendo uma galeria';
  if(distance<=step+.001)finishSegment(world,ant,targetId,reversing,blocked);
}
