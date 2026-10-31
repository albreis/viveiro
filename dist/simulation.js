export const TICKS_PER_DAY = 100;
export const LIMIT = 450;
export const NEST = { x: -4.8, z: -1.1 };
export const BOUNDS = { x: 9.3, z: 5.8 };
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
export function nestPath(nest,start,end) {
  const queue=[[start]],visited=new Set([start]);
  while(queue.length){const path=queue.shift(),node=path.at(-1);if(node===end)return path.slice(1);
    for(const edge of nest.links){const next=edge[0]===node?edge[1]:edge[1]===node?edge[0]:null;
      if(next!==null&&!visited.has(next)){visited.add(next);queue.push([...path,next]);}}
  }
  return [];
}
export function hashSeed(value) {
  let h = 2166136261;
  for (const c of String(value)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const distance = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
export class World {
  constructor(seed = 'SEMENTE-42', parameters = {}) {
    this.seed = String(seed);
    this.rng = hashSeed(seed);
    this.params = { humidity: 58, light: 72, randomness: 28, ...parameters };
    this.tick = 0; this.nextId = 1; this.food = 18; this.queenHealth = 100;
    this.ants = []; this.brood = []; this.predators = []; this.plants = []; this.patches = [];
    this.nest=createNest();
    this.events = []; this.history = []; this.deaths = 0; this.born = 0;
    this.lastLaying = -50; this.lastRecord = -25; this.lastWarning = -1000;
    this.lastDiscovery = -1000; this.pheromones = new Array(40 * 26).fill(0);
    this.ants.push(this.makeAnt('queen', NEST.x, NEST.z));
    Object.assign(this.ants[0],this.nest.nodes[2],{kind:'queen',node:2});
    this.ants.push(this.makeAnt('male', NEST.x + .8, NEST.z + .3));
    for (let i = 0; i < 32; i++) {
      let x = this.range(-8.7, 8.7), z = this.range(-5.2, 5.2);
      if (distance({x,z}, NEST) < 1.6 || this.inPond(x,z)) { i--; continue; }
      this.plants.push({ id: this.nextId++, x, z, biomass: this.range(.45, 1), kind: i % 4 });
    }
    for (let i = 0; i < 12; i++) {
      const plant = this.plants[(i * 2 + 1) % this.plants.length];
      this.patches.push({ id: this.nextId++, x: plant.x + .25, z: plant.z + .2, amount: this.range(1, 3.5), capacity: 4, discovered: false });
    }
    this.addPredator(6, 3.5, false);
    this.addPredator(4.5, -4, false);
    this.log('Uma rainha e um macho. O começo de uma colônia.', 'birth');
    this.record();
  }
  random() {
    this.rng = (this.rng + 0x6D2B79F5) >>> 0;
    let t = this.rng;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a,b) { return a + (b-a) * this.random(); }
  get day() { return this.tick / TICKS_PER_DAY; }
  get workers() { return this.ants.filter(a => a.kind === 'worker'); }
  get population() { return this.ants.length; }
  inPond(x,z) { return ((x - 4.3) / 1.9) ** 2 + ((z + 2.5) / 1.35) ** 2 < 1; }
  makeAnt(kind, x, z) {
    return { id: this.nextId++, kind, x, y:0, z, angle: this.range(0, Math.PI * 2),
      energy: 100, age: 0, carrying: 0, speed: this.range(.07,.105), state: kind === 'queen' ? 'Fundando o ninho' : 'Explorando', rest: 0 };
  }
  moveInNest(ant) {
    const target=this.nest.nodes[ant.route[0]];
    if(!target){ant.route=[];return;}
    const dx=target.x-ant.x,dy=target.y-ant.y,dz=target.z-ant.z,d=Math.hypot(dx,dy,dz);
    const speed=ant.speed*.85;
    ant.state=ant.carrying?'Indo para a despensa':'Percorrendo uma galeria';
    if(d<=speed){
      Object.assign(ant,{x:target.x,y:target.y,z:target.z,node:ant.route.shift()});
      if(!ant.route.length){
        if(target.type==='storage'){
          this.food+=ant.carrying;ant.carrying=0;
          if(this.food>.15){this.food-=.15;ant.energy=100;}
          ant.route=nestPath(this.nest,ant.node,ant.id%2?0:6);
        }else if(target.type!=='entrance')ant.route=nestPath(this.nest,ant.node,ant.id%2?0:6);
        else{ant.y=0;ant.node=null;ant.state='Explorando';ant.angle=this.range(0,6.283);}
      }
    }else{
      ant.x+=dx/d*speed;ant.y+=dy/d*speed;ant.z+=dz/d*speed;
      ant.angle=Math.atan2(dz,dx);ant.pitch=Math.atan2(dy,Math.hypot(dx,dz));
    }
  }
  log(text, type = 'info') {
    this.events.unshift({ tick: this.tick, day: this.day, text, type });
    this.events.length = Math.min(this.events.length, 35);
  }
  record() {
    this.history.push({ tick: this.tick, day: this.day, population: this.population,
      brood: this.brood.length, food: this.food, plants: this.plants.reduce((n,p)=>n+p.biomass,0) });
    if (this.history.length > 500) this.history.shift();
    this.lastRecord = this.tick;
  }
  addPredator(x,z,announce=true) {
    if (this.predators.length >= 10) return false;
    this.predators.push({ id: this.nextId++, x, z, angle: this.range(0, 6.283), energy: 100, cooldown: 0, prey: 0 });
    if (announce) this.log('Um predador entrou no terrário.', 'danger');
    return true;
  }
  intervene(type, x=0, z=0, value) {
    x = clamp(Number(x) || 0, -BOUNDS.x, BOUNDS.x); z = clamp(Number(z) || 0, -BOUNDS.z, BOUNDS.z);
    if (type === 'food') {
      this.patches.push({ id:this.nextId++, x, z, amount:5, capacity:5, discovered:false, supplemental:true });
      if (this.patches.length > 55) this.patches.splice(this.patches.findIndex(p=>p.supplemental),1);
      this.log('Alimento adicionado. Quem vai encontrá-lo?', 'food');
    } else if (type === 'plant' && this.plants.length < 100 && !this.inPond(x,z)) {
      this.plants.push({ id:this.nextId++, x,z,biomass:.35,kind:this.nextId%4 });
      this.patches.push({ id:this.nextId++, x:x+.25,z:z+.2,amount:.25,capacity:3,discovered:false });
      this.log('Uma nova planta começa a crescer.', 'plant');
    } else if (type === 'predator') {
      if (distance({x,z},NEST)<2) { this.log('O ninho oferece abrigo. Coloque o predador mais longe.', 'info'); return false; }
      return this.addPredator(x,z);
    } else if (type === 'rain') {
      this.params.humidity = clamp(this.params.humidity + 12, 0, 100);
      this.log('Chuva: a umidade do terrário aumentou.', 'rain');
    } else if (['humidity','light','randomness'].includes(type)) {
      this.params[type] = clamp(Number(value) || 0, 0, 100);
      this.log(({humidity:'Umidade',light:'Luz',randomness:'Aleatoriedade'})[type] + ' ajustada para ' + this.params[type] + '%.');
    }
    return true;
  }
  pheromoneIndex(x,z) {
    return clamp(Math.floor((z+6.5)/13*26),0,25)*40 + clamp(Math.floor((x+10)/20*40),0,39);
  }
  step(count=1) {
    for (let n=0; n<count; n++) this.advance();
  }
  advance() {
    this.tick++;
    const h = this.params.humidity / 100, light = this.params.light / 100;
    const suitability = Math.max(.02, 1 - Math.abs(h-.62)*1.7);
    const plantGrowth = light * suitability;
    for (const p of this.plants) p.biomass = clamp(p.biomass + (plantGrowth*.002 - .00045) * (1.15-p.biomass), .04,1.1);
    for (const p of this.patches) {
      if (!p.supplemental) p.amount = Math.min(p.capacity, p.amount + plantGrowth * .0028);
    }
    for (let i=0;i<this.pheromones.length;i++) this.pheromones[i] *= .986;
    const queen = this.ants.find(a=>a.kind==='queen');
    const consumption = (queen ? .004 : 0) + this.brood.length * .00065;
    const fed = this.food >= consumption;
    this.food = Math.max(0,this.food-consumption);
    if (queen) {
      this.queenHealth = clamp(this.queenHealth + (fed ? .018 : -.09), 0,100);
      queen.energy = this.queenHealth;
      queen.state = this.tick < 40 ? 'Preparando a primeira postura' : 'Cuidando da colônia';
      if (this.tick >= 25 && this.tick - this.lastLaying >= 65 && this.food > 2 && this.population + this.brood.length < LIMIT) {
        const eggs = Math.min(4 + Math.floor(this.random()*3), LIMIT-this.population-this.brood.length);
        for(let i=0;i<eggs;i++) this.brood.push({id:this.nextId++, age:0});
        this.food = Math.max(0,this.food-eggs*.21);
        this.lastLaying = this.tick;
        this.log('A rainha colocou '+eggs+' ovos.', 'birth');
      }
    }
    const remaining = [];
    let hatched=0;
    for(const b of this.brood) {
      if(fed) b.age += .006 + suitability*.004;
      if(b.age >= 1.3 && this.population < LIMIT) {
        const ant=this.makeAnt('worker',this.nest.nodes[3].x,this.nest.nodes[3].z);
        ant.y=this.nest.nodes[3].y;ant.node=3;ant.route=nestPath(this.nest,3,ant.id%2?0:6);
        this.ants.push(ant);
        this.born++; hatched++;
      } else remaining.push(b);
    }
    this.brood = remaining;
    if(hatched) this.log(hatched===1 ? 'Uma operária nasceu e se juntou à colônia.' : hatched+' operárias nasceram.', 'birth');
    const dead = new Set();
    for (const ant of this.ants) {
      ant.age += .01;
      if(ant.kind === 'queen') {
        if(this.queenHealth<=0) { dead.add(ant.id); this.log('A rainha morreu por falta de alimento.', 'danger'); }
        continue;
      }
      if(ant.kind==='male') {
        ant.state='Acasalamento';
        if(this.tick>65) { dead.add(ant.id); this.log('Após o acasalamento, o ciclo do macho terminou.', 'info'); }
        continue;
      }
      if(ant.route?.length){this.moveInNest(ant);continue;}
      ant.pitch=0;
      ant.energy -= .025 + (1-suitability)*.015;
      if(ant.energy<=0 || ant.age>this.lifeLimit(ant)) { dead.add(ant.id); this.deaths++; continue; }
      if(ant.rest>0) { ant.rest--; continue; }
      const danger = this.predators.find(p=>distance(ant,p)<1.5);
      let heading = ant.angle;
      if(danger) { heading=Math.atan2(ant.z-danger.z,ant.x-danger.x); ant.state='Fugindo'; }
      else if(ant.carrying || ant.energy<35) {
        const entrances=this.nest.nodes.map((p,i)=>({...p,index:i})).filter(p=>p.type==='entrance');
        const entrance=entrances.reduce((best,p)=>distance(ant,p)<distance(ant,best)?p:best);
        heading=Math.atan2(entrance.z-ant.z,entrance.x-ant.x); ant.state=ant.carrying?'Levando alimento':'Voltando ao ninho';
        if(distance(ant,entrance)<.4) {
          ant.y=entrance.y;ant.node=entrance.index;ant.route=nestPath(this.nest,entrance.index,4);
        }
      } else {
        let nearest=null, best=2.3;
        for(const patch of this.patches) {
          const d=distance(ant,patch);
          if(patch.amount>.12 && d<best) { best=d; nearest=patch; }
        }
        if(nearest) {
          heading=Math.atan2(nearest.z-ant.z,nearest.x-ant.x); ant.state='Coletando';
          if(best<.38) {
            ant.carrying=Math.min(.65,nearest.amount); nearest.amount-=ant.carrying;
            ant.angle+=Math.PI;
            if(!nearest.discovered && this.tick-this.lastDiscovery>30) {
              nearest.discovered=true; this.lastDiscovery=this.tick;
              this.log('Uma exploradora encontrou uma fonte de alimento.', 'food');
            }
          }
        } else {
          ant.state='Explorando';
          const spread=.7;
          const choices=[heading-spread,heading,heading+spread];
          let max=-1;
          for(const angle of choices) {
            const score=this.pheromones[this.pheromoneIndex(ant.x+Math.cos(angle)*.7,ant.z+Math.sin(angle)*.7)];
            if(score>max) {max=score; heading=angle;}
          }
          // Local exploration is stochastic and reproducible from this world's seed.
          heading += this.range(-.35,.35) * (this.params.randomness/50 + .2);
          if(max<.04) heading=ant.angle+this.range(-.5,.5);
        }
      }
      const dx=Math.cos(heading)*ant.speed, dz=Math.sin(heading)*ant.speed;
      const x=ant.x+dx, z=ant.z+dz;
      if(Math.abs(x)>BOUNDS.x || Math.abs(z)>BOUNDS.z || this.inPond(x,z)) {
        ant.angle=heading+this.range(1.3,2.1);
      } else { ant.x=x; ant.z=z; ant.angle=heading; }
      if(ant.carrying) {
        const idx=this.pheromoneIndex(ant.x,ant.z);
        this.pheromones[idx]=Math.min(5,this.pheromones[idx]+.25);
      }
    }
    for (const p of this.predators) {
      p.energy -= .012;
      if(p.cooldown>0) p.cooldown--;
      let target=null, nearest=2.6;
      for(const a of this.ants) if(a.kind==='worker' && a.y>=-.1 && !dead.has(a.id) && distance(a,NEST)>1.3) {
        const d=distance(a,p); if(d<nearest) {nearest=d;target=a;}
      }
      if(target) {
        p.angle=Math.atan2(target.z-p.z,target.x-p.x);
        if(nearest<.4 && p.cooldown===0 && this.random()<.24) {
          dead.add(target.id); this.deaths++; p.prey++; p.energy=Math.min(100,p.energy+20); p.cooldown=65;
          this.log('Uma aranha capturou uma operária.', 'danger');
        }
      } else if(this.random()<.07) p.angle+=this.range(-1,1);
      const speed=target?.kind ? .062 : .024;
      const x=p.x+Math.cos(p.angle)*speed,z=p.z+Math.sin(p.angle)*speed;
      if(Math.abs(x)>BOUNDS.x || Math.abs(z)>BOUNDS.z || this.inPond(x,z) || distance({x,z},NEST)<1.4) p.angle+=1.8;
      else {p.x=x;p.z=z;}
    }
    this.predators=this.predators.filter(p=>p.energy>0);
    this.ants=this.ants.filter(a=>!dead.has(a.id));
    if(this.food<1 && this.tick-this.lastWarning>200) {
      this.lastWarning=this.tick; this.log('A reserva está baixa. A colônia precisa de alimento.', 'danger');
    }
    if(this.tick-this.lastRecord>=25) this.record();
  }
  lifeLimit(ant) { return 70 + (ant.id%37); }
  snapshot() { return JSON.parse(JSON.stringify(this)); }
  static restore(snapshot) {
    const world=Object.create(World.prototype);
    Object.assign(world,JSON.parse(JSON.stringify(snapshot)));
    if(!world.nest||world.nest.revision<2){world.nest=createNest();const q=world.ants.find(a=>a.kind==='queen');if(q)Object.assign(q,world.nest.nodes[2],{node:2});}
    for(const ant of world.ants){if(ant.y===undefined){ant.y=0;if(ant.kind==='queen')Object.assign(ant,world.nest.nodes[2],{node:2});}}
    return world;
  }
}
export function forecast(snapshot, runs=18, days=3) {
  const values=[];
  for(let i=0;i<runs;i++) {
    const w=World.restore(snapshot);
    w.rng=hashSeed(snapshot.seed+':forecast:'+snapshot.tick+':'+i);
    w.params.humidity=clamp(w.params.humidity+w.range(-3,3),0,100);
    w.params.light=clamp(w.params.light+w.range(-3,3),0,100);
    w.step(Math.round(days*TICKS_PER_DAY));
    values.push(w.population);
  }
  values.sort((a,b)=>a-b);
  return { low:values[Math.floor((runs-1)*.1)], high:values[Math.ceil((runs-1)*.9)],
    median:values[Math.floor(runs/2)], runs, days, tick:snapshot.tick, values };
}
