import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { NEST, LIMIT, hashSeed } from './simulation.js';
import { createSoilGeometry } from './soil.js';
const UP = new THREE.Vector3(0,1,0);
export class Terrarium {
  constructor(element,world,onPlace) {
    this.element=element; this.onPlace=onPlace; this.world=world; this.tool=null; this.showTrails=false;
    this.scene=new THREE.Scene(); this.scene.background=new THREE.Color('#e5e9da');
    this.scene.fog=new THREE.Fog('#e5e9da',35,76);
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.8));
    this.renderer.shadowMap.enabled=true; this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure=1.22;
    element.appendChild(this.renderer.domElement);
    this.camera=new THREE.PerspectiveCamera(37,1,.1,130); this.camera.position.set(22,23,27);
    this.controls=new OrbitControls(this.camera,this.renderer.domElement);
    this.controls.target.set(0,-.2,0); this.controls.enableDamping=true;
    this.controls.minDistance=9; this.controls.maxDistance=53;
    this.controls.maxPolarAngle=Math.PI*.47; this.controls.minPolarAngle=.07;
    this.controls.enablePan=true;
    this.scene.add(new THREE.HemisphereLight(0xf4f4da,0x6d7357,3.2));
    this.followLight=new THREE.PointLight(0xffe5b5,0,4,1.5);this.scene.add(this.followLight);
    this.followId=null;this.selectedId=null;this.lookYaw=0;this.lookPitch=0;
    const sun=new THREE.DirectionalLight(0xfff0c6,4.3); sun.position.set(-6,18,9);
    sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
    sun.shadow.camera.left=-16;sun.shadow.camera.right=16;sun.shadow.camera.top=15;sun.shadow.camera.bottom=-15;
    sun.shadow.normalBias=.04;sun.shadow.bias=-.0002;this.scene.add(sun);this.sun=sun;
    const fill=new THREE.DirectionalLight(0xd9ead4,1.2);fill.position.set(12,8,-15);this.scene.add(fill);
    this.staticGroup=new THREE.Group();this.scene.add(this.staticGroup);
    this.plantGroup=new THREE.Group();this.scene.add(this.plantGroup);
    this.foodGroup=new THREE.Group();this.scene.add(this.foodGroup);
    this.antGroup=new THREE.Group();this.scene.add(this.antGroup);
    this.predatorGroup=new THREE.Group();this.scene.add(this.predatorGroup);
    this.buildGround(world.seed);
    this.antParts=this.buildInsects(LIMIT, false);
    this.predatorParts=this.buildInsects(10, true);
    this.queen=this.buildQueen();this.scene.add(this.queen);
    this.male=this.buildMale();this.scene.add(this.male);
    this.broodMesh=new THREE.InstancedMesh(new THREE.SphereGeometry(.075,7,5),this.material('#ded7aa'),LIMIT);
    this.broodMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.broodMesh.count=0;this.scene.add(this.broodMesh);
    const trailPositions=new Float32Array(1040*3), trailColors=new Float32Array(1040*3);
    for(let z=0;z<26;z++)for(let x=0;x<40;x++){const i=z*40+x;trailPositions[i*3]=(x+.5)/40*20-10;trailPositions[i*3+1]=.055;trailPositions[i*3+2]=(z+.5)/26*13-6.5;}
    const trailGeo=new THREE.BufferGeometry();trailGeo.setAttribute('position',new THREE.BufferAttribute(trailPositions,3));trailGeo.setAttribute('color',new THREE.BufferAttribute(trailColors,3));
    this.trails=new THREE.Points(trailGeo,new THREE.PointsMaterial({size:.27,vertexColors:true,transparent:true,opacity:.6,depthWrite:false,blending:THREE.AdditiveBlending}));this.trails.visible=false;this.scene.add(this.trails);
    this.marker=new THREE.Mesh(new THREE.RingGeometry(.3,.36,32),new THREE.MeshBasicMaterial({color:0x567b35,side:THREE.DoubleSide,transparent:true,opacity:.75}));
    this.marker.rotation.x=-Math.PI/2;this.marker.position.y=.045;this.marker.visible=false;this.scene.add(this.marker);
    this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();this.plane=new THREE.Plane(UP,0);
    let down=null;
    this.renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY};});
    this.renderer.domElement.addEventListener('pointermove',e=>{
      if(this.followId&&down){this.lookYaw+=(e.clientX-down.lastX)*.004;this.lookPitch=Math.max(-.8,Math.min(.8,this.lookPitch-(e.clientY-down.lastY)*.004));down.lastX=e.clientX;down.lastY=e.clientY;return;}
      const p=this.groundPoint(e);this.marker.visible=!!this.tool&&!!p;
      if(p)this.marker.position.set(p.x,.045,p.z);
    });
    this.renderer.domElement.addEventListener('pointerleave',()=>this.marker.visible=false);
    this.renderer.domElement.addEventListener('pointerup',e=>{
      if(!down)return;
      const moved=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;
      if(this.followId||moved>6)return;
      const p=this.groundPoint(e);
      if(this.tool){if(p)this.onPlace(this.tool,p.x,p.z);return;}
      const hits=this.raycaster.intersectObjects([...this.antParts,this.queen,this.male,this.soil],true);
      if(hits.length){const hit=hits[0];let id=null;
        if(this.antParts.includes(hit.object))id=this.visibleWorkers[hit.instanceId]?.id;
        else{let obj=hit.object;while(obj.parent&&obj!==this.queen&&obj!==this.male)obj=obj.parent;
          if(obj===this.queen)id=this.world.ants.find(a=>a.kind==='queen')?.id;
          if(obj===this.male)id=this.world.ants.find(a=>a.kind==='male')?.id;}
        if(id){this.selectedId=id;this.onSelect?.(id);}
      }
    });
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(element);this.resize();
    this.plantViews=new Map();this.foodViews=new Map();this.lastTick=-1;
  }
  material(color,extra={}){return new THREE.MeshStandardMaterial({color,roughness:.85,...extra});}
  mesh(geometry,material,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  buildGround(seed) {
    let state=hashSeed(seed+':terrain');const rnd=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
    const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const ctx=canvas.getContext('2d');
    ctx.fillStyle='#6d7549';ctx.fillRect(0,0,512,512);
    for(let i=0;i<20000;i++){ctx.fillStyle=['#52613b','#8b8c59','#838450','#778353','#646e43'][Math.floor(rnd()*5)];ctx.globalAlpha=.25+rnd()*.4;const s=1+rnd()*5;ctx.fillRect(rnd()*512,rnd()*512,s,s);}
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(2,1.3);
    this.soil=this.mesh(createSoilGeometry(this.world.nest),[this.material('#ffffff',{vertexColors:true}),this.material('#ffffff',{map:texture,vertexColors:true})],this.staticGroup);
    this.mesh(new THREE.BoxGeometry(20.5,.17,13.5),this.material('#5c624c'),this.staticGroup,0,-4.31,0);
    this.mesh(new THREE.BoxGeometry(20.8,.12,13.8),this.material('#aab295'),this.staticGroup,0,-4.46,0);
    const floor=this.mesh(new THREE.PlaneGeometry(180,180),this.material('#e5e9da'),this.scene,0,-4.55,0);floor.rotation.x=-Math.PI/2;floor.castShadow=false;
    const glass=new THREE.MeshPhysicalMaterial({color:0xc5dac1,transparent:true,opacity:.065,roughness:.08,metalness:.05,depthWrite:false,side:THREE.DoubleSide});
    const edge=new THREE.LineBasicMaterial({color:0xa5b89b,transparent:true,opacity:.4});
    const glassGeos=[{size:[20,.01,13],p:[0,4.1,0],top:true},{size:[20,8.3,.035],p:[0,-.05,-6.5]},{size:[.035,8.3,13],p:[10,-.05,0]},{size:[.035,8.3,13],p:[-10,-.05,0]},{size:[20,8.3,.035],p:[0,-.05,6.5]}];
    for(const box of glassGeos){const geo=new THREE.BoxGeometry(...box.size);if(!box.top){const m=this.mesh(geo,glass,this.staticGroup,...box.p);m.castShadow=false;m.receiveShadow=false;}const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geo),edge);edges.position.set(...box.p);this.staticGroup.add(edges);}
    const pondGeo=new THREE.CircleGeometry(1,50);this.pond=this.mesh(pondGeo,new THREE.MeshPhysicalMaterial({color:'#7baf9e',roughness:.13,metalness:.16,transparent:true,opacity:.85}),this.staticGroup,4.3,.035,-2.5);this.pond.rotation.x=-Math.PI/2;this.pond.scale.set(1.9,1.35,1);
    const bank=this.mesh(new THREE.TorusGeometry(1,.045,5,60),this.material('#a2a778'),this.staticGroup,4.3,.025,-2.5);bank.rotation.x=-Math.PI/2;bank.scale.set(1.94,1.4,.7);
    for(let i=0;i<20;i++){const t=i/20*Math.PI*2;const rock=this.mesh(new THREE.DodecahedronGeometry(.12+rnd()*.18,0),this.material(['#a7aa8b','#868e72','#bac0a1'][i%3]),this.staticGroup,4.3+Math.cos(t)*2,.07,-2.5+Math.sin(t)*1.45);rock.scale.y=.6;}
    for(const entrance of this.world.nest.nodes.filter(n=>n.type==='entrance')){
      const rim=this.mesh(new THREE.TorusGeometry(.41,.095,7,22),this.material('#a18b60'),this.staticGroup,entrance.x,.02,entrance.z);rim.rotation.x=-Math.PI/2;
    }
    for(let i=0;i<95;i++){
      const x=(rnd()-.5)*18.8,z=(rnd()-.5)*11.8;
      if(this.world.inPond(x,z))continue;
      const r=.055+rnd()*.16,rock=this.mesh(new THREE.DodecahedronGeometry(r,0),this.material(['#c0b28d','#888f70','#a59e78'][i%3]),this.staticGroup,x,r*.4,z);rock.scale.set(1,.55+rnd()*.4,1.3);rock.rotation.y=rnd()*6;
    }
    const log=new THREE.Group();log.position.set(4.3,.28,3.6);log.rotation.z=.09;log.rotation.y=.5;
    const timber=this.mesh(new THREE.CylinderGeometry(.35,.42,3.4,9),this.material('#71634b'),log);timber.rotation.z=Math.PI/2;
    for(const x of [-1.72,1.72]){const cut=this.mesh(new THREE.CircleGeometry(.33,16),this.material('#c2aa7e'),log,x,0,0);cut.rotation.y=x<0?-Math.PI/2:Math.PI/2;}
    this.staticGroup.add(log);
    // A few grass tufts add scale without requiring imported assets.
    const grassMat=this.material('#748a45',{side:THREE.DoubleSide});
    const blade=new THREE.ConeGeometry(.045,.45,3);
    for(let i=0;i<240;i++){
      const x=(rnd()-.5)*18.6,z=(rnd()-.5)*11.5;if(this.world.inPond(x,z)||Math.hypot(x-NEST.x,z-NEST.z)<1.2)continue;
      const g=this.mesh(blade,grassMat,this.staticGroup,x,.17,z);g.rotation.z=(rnd()-.5)*.6;g.scale.y=.4+rnd();
    }
    this.nestLabel=this.label('ENTRADA',NEST.x,.9,NEST.z);
    this.label('ÁGUA',4.3,.7,-2.5);
  }
  label(text,x,y,z) {
    const c=document.createElement('canvas');c.width=256;c.height=64;const ctx=c.getContext('2d');
    ctx.fillStyle='#f5f8e5cc';ctx.beginPath();ctx.roundRect(4,4,248,56,20);ctx.fill();ctx.font='500 21px Arial';ctx.fillStyle='#64754e';ctx.textAlign='center';ctx.fillText(text,128,41);
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false,opacity:.85}));
    sprite.scale.set(1.3,.325,1);sprite.position.set(x,y,z);this.staticGroup.add(sprite);return sprite;
  }
  buildInsects(max,spider) {
    const group=spider?this.predatorGroup:this.antGroup,mat=this.material(spider?'#51483d':'#553b2c');
    const parts=[],counts=spider?11:9;
    for(let i=0;i<counts;i++){const geo=i<3?new THREE.SphereGeometry(1,8,6):new THREE.CylinderGeometry(.012,.009,1,3);const m=new THREE.InstancedMesh(geo,mat,max);m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.count=0;m.castShadow=true;m.frustumCulled=false;group.add(m);parts.push(m);}return parts;
  }
  buildQueen() {
    const g=new THREE.Group(),mat=this.material('#75432a',{roughness:.55});
    const abdomen=this.mesh(new THREE.SphereGeometry(1,12,8),mat,g,-.23,.19,0);abdomen.scale.set(.31,.19,.22);
    this.mesh(new THREE.SphereGeometry(.12,10,7),mat,g,.07,.15,0);
    const head=this.mesh(new THREE.SphereGeometry(.14,10,7),mat,g,.29,.17,0);head.scale.x=1.1;
    for(let side of [-1,1])for(let i=0;i<3;i++){const leg=this.mesh(new THREE.CylinderGeometry(.015,.01,.45,4),mat,g,(i-1)*.12,.08,side*.19);leg.rotation.x=side*1.1;leg.rotation.z=(i-1)*.6;}
    return g;
  }
  buildMale() {
    const g=new THREE.Group(),mat=this.material('#816341');const body=this.mesh(new THREE.SphereGeometry(.15,8,6),mat,g);body.scale.set(1.5,.6,.7);
    for(const side of [-1,1]){const wing=this.mesh(new THREE.SphereGeometry(1,8,5),this.material('#dbe5cd',{transparent:true,opacity:.6}),g,0,.1,side*.16);wing.scale.set(.23,.012,.13);wing.rotation.y=side*.7;}
    return g;
  }
  buildPlant(plant) {
    const g=new THREE.Group();g.position.set(plant.x,0,plant.z);
    const greens=['#5d7c38','#708c45','#496c3c','#8a9b53'];
    const leafMat=this.material(greens[plant.kind%4]),stem=this.material('#7b8550');
    const trunk=this.mesh(new THREE.CylinderGeometry(.025,.045,1,5),stem,g,0,.5,0);
    const count=plant.kind===3?9:6;
    for(let i=0;i<count;i++){
      const angle=i*2.4+plant.id;
      const height=.2+i*.1,spread=.18+(i%3)*.05;
      const leaf=this.mesh(new THREE.SphereGeometry(1,7,4),leafMat,g,Math.cos(angle)*spread,height,Math.sin(angle)*spread);
      leaf.scale.set(.09,.035,.28);leaf.rotation.y=-angle+Math.PI/2;leaf.rotation.z=.35;
    }
    if(plant.kind===2){trunk.scale.y=1.6;for(let i=0;i<3;i++){const crown=this.mesh(new THREE.IcosahedronGeometry(.28,1),leafMat,g,(i-1)*.16,1.2+i*.22,0);crown.scale.set(1.2,1,.9);}}
    this.plantGroup.add(g);return g;
  }
  update(world,time) {
    this.world=world;this.lastTick=world.tick;
    this.sun.intensity=2.2+world.params.light/30;
    for(const p of world.plants){let g=this.plantViews.get(p.id);if(!g){g=this.buildPlant(p);this.plantViews.set(p.id,g);}g.scale.setScalar(.5+p.biomass*.75);g.rotation.z=Math.sin(time*.7+p.id)*.013;}
    const patchIds=new Set(world.patches.map(p=>p.id));
    for(const [id,view] of this.foodViews)if(!patchIds.has(id)){this.foodGroup.remove(view);view.geometry.dispose();view.material.dispose();this.foodViews.delete(id);}
    for(const p of world.patches){let m=this.foodViews.get(p.id);if(!m){m=this.mesh(new THREE.DodecahedronGeometry(.16,0),this.material('#c9a24f'),this.foodGroup,p.x,.12,p.z);this.foodViews.set(p.id,m);}m.visible=p.amount>.06;m.scale.setScalar(.5+Math.sqrt(p.amount)*.32);}
    this.visibleWorkers=world.workers.filter(a=>a.id!==this.followId);
    this.updateAnts(this.visibleWorkers,this.antParts,false,time);
    this.updateAnts(world.predators,this.predatorParts,true,time);
    const queen=world.ants.find(a=>a.kind==='queen');this.queen.visible=!!queen&&queen.id!==this.followId;
    if(queen){this.queen.position.set(queen.x,(queen.y||0)+.07,queen.z);this.queen.rotation.y=.6;}
    const male=world.ants.find(a=>a.kind==='male');this.male.visible=!!male&&male.id!==this.followId;
    if(male){this.male.position.set(male.x,.18,male.z);this.male.rotation.y=Math.sin(time)*.3;}
    const dummy=new THREE.Object3D();
    this.broodMesh.count=Math.min(world.brood.length,LIMIT);
    const nursery=world.nest.nodes[3];
    for(let i=0;i<this.broodMesh.count;i++){const a=i*2.4,r=.1+Math.sqrt(i)*.032;dummy.position.set(nursery.x+Math.cos(a)*r,nursery.y-.1,nursery.z+Math.sin(a)*r);dummy.scale.set(.7,.7,1.3);dummy.updateMatrix();this.broodMesh.setMatrixAt(i,dummy.matrix);}
    this.broodMesh.instanceMatrix.needsUpdate=true;
    this.trails.visible=this.showTrails;
    if(this.showTrails){const colors=this.trails.geometry.attributes.color;for(let i=0;i<1040;i++){const v=Math.min(1,world.pheromones[i]/2);colors.setXYZ(i,v*.7,v,v*.2);}colors.needsUpdate=true;}
    if(this.followId){
      const ant=world.ants.find(a=>a.id===this.followId);
      if(!ant){this.stopFollowing();this.onFollowEnded?.();}
      else{
        const heading=(ant.kind==='queen'?-.6:ant.angle)+this.lookYaw,pitch=(ant.pitch||0)+this.lookPitch;
        const eye=new THREE.Vector3(ant.x+Math.cos(ant.angle)*.13,(ant.y||0)+.17,ant.z+Math.sin(ant.angle)*.13);
        this.camera.position.lerp(eye,.35);
        const target=this.camera.position.clone().add(new THREE.Vector3(Math.cos(heading)*Math.cos(pitch),Math.sin(pitch),Math.sin(heading)*Math.cos(pitch)));
        this.camera.lookAt(target);this.followLight.position.copy(eye);this.followLight.intensity=ant.y<-.1?1.8:0;
      }
    }
  }
  updateAnts(agents,parts,spider,time) {
    const d=new THREE.Object3D(),q=new THREE.Quaternion(),axis=new THREE.Vector3();
    for(const m of parts)m.count=Math.min(agents.length,m.instanceMatrix.count);
    agents.slice(0,parts[0].count).forEach((a,i)=>{
      const c=Math.cos(a.angle),s=Math.sin(a.angle),scale=spider?1.6:1;
      for(let p=0;p<3;p++){
        const offset=(p-1)*.12*scale;
        d.position.set(a.x+c*offset,(a.y||0)+.12*scale,a.z+s*offset);d.rotation.set(0,-a.angle,0);
        d.scale.set((p===0?.12:p===1?.065:.085)*scale,.055*scale,.06*scale);
        if(spider&&p===0)d.scale.set(.18,.12,.14);
        d.updateMatrix();parts[p].setMatrixAt(i,d.matrix);
      }
      const legs=spider?8:6;
      for(let p=0;p<legs;p++){
        const side=p%2?1:-1,along=Math.floor(p/2)-1;
        const walk=Math.sin(time*18+a.id+along*2)*.035;
        const ax=a.x+c*along*.07*scale-s*side*.045*scale,az=a.z+s*along*.07*scale+c*side*.045*scale;
        const bx=a.x+c*(along*.12+walk)*scale-s*side*.16*scale,bz=a.z+s*(along*.12+walk)*scale+c*side*.16*scale;
        axis.set(bx-ax,-.095*scale,bz-az);const len=axis.length();q.setFromUnitVectors(UP,axis.normalize());
        d.position.set((ax+bx)/2,(a.y||0)+.075*scale,(az+bz)/2);d.quaternion.copy(q);d.scale.set(1,len,1);d.updateMatrix();parts[p+3].setMatrixAt(i,d.matrix);
      }
    });
    for(const m of parts)m.instanceMatrix.needsUpdate=true;
  }
  groundPoint(e) {
    const r=this.element.getBoundingClientRect();this.pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
    this.raycaster.setFromCamera(this.pointer,this.camera);const v=new THREE.Vector3();
    if(!this.raycaster.ray.intersectPlane(this.plane,v)||Math.abs(v.x)>9.3||Math.abs(v.z)>5.8)return null;return v;
  }
  setTool(tool){this.tool=tool;this.controls.enableRotate=!tool;this.renderer.domElement.style.cursor=tool?'crosshair':'grab';if(!tool)this.marker.visible=false;}
  followAnt(id){
    const ant=this.world.ants.find(a=>a.id===Number(id));if(!ant)return false;
    if(!this.followId)this.previousView={position:this.camera.position.clone(),target:this.controls.target.clone()};
    this.followId=ant.id;this.lookYaw=0;this.lookPitch=0;
    this.controls.enabled=false;this.camera.fov=82;this.camera.near=.018;this.camera.updateProjectionMatrix();
    this.camera.position.set(ant.x,(ant.y||0)+.17,ant.z);this.setTool(null);
    return true;
  }
  stopFollowing(){
    if(!this.followId)return;
    this.followId=null;this.controls.enabled=true;this.followLight.intensity=0;
    this.camera.fov=37;this.camera.near=.1;this.camera.updateProjectionMatrix();
    if(this.previousView){this.camera.position.copy(this.previousView.position);this.controls.target.copy(this.previousView.target);}
    this.controls.update();
  }
  setView(view){
    this.stopFollowing();
    const lateral=view==='side',top=view===true;
    this.controls.maxPolarAngle=lateral?Math.PI*.6:Math.PI*.47;
    this.camera.position.set(lateral?0:top?.01:22,lateral?-1.2:top?35:23,lateral?29:top?.01:27);
    this.controls.target.set(0,lateral?-1.9:-.7,lateral?2:0);this.controls.update();
  }
  resize(){const {width,height}=this.element.getBoundingClientRect();if(!width||!height)return;this.camera.aspect=width/height;this.camera.updateProjectionMatrix();this.renderer.setSize(width,height);}
  render(){if(!this.followId)this.controls.update();this.renderer.render(this.scene,this.camera);}
  dispose(){
    this.resizeObserver.disconnect();this.controls.dispose();
    const geos=new Set(),mats=new Set(),textures=new Set();
    this.scene.traverse(o=>{if(o.geometry)geos.add(o.geometry);for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m){mats.add(m);if(m.map)textures.add(m.map);}});
    geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());this.renderer.dispose();this.renderer.domElement.remove();
  }
}
