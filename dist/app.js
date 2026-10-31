import { World, TICKS_PER_DAY, hashSeed } from './simulation.js';
import { Terrarium } from './scene.js';
const $ = id => document.getElementById(id);
let world, comparison=null, scenario='a', scene, running=true, speed=1, accumulator=0;
let initial={seed:'SEMENTE-42',params:{humidity:58,light:72,randomness:28}};
let interventions=[], replaying=false, replayIndex=0, lastUi=0,lastSave=0,lastForecast=-1000;
let forecastPending=false, forecastId=0, forecastCache=null, worker=null, toastTimer,selectedAnt=null,antListKey='';
const active=()=>scenario==='b'&&comparison?comparison:world;
const format=n=>new Intl.NumberFormat('pt-BR',{maximumFractionDigits:1}).format(n);
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,3800);}
function load(){
  try{
    const saved=JSON.parse(localStorage.getItem('viveiro-v1'));
    if(saved?.version===1&&saved.world?.seed&&Array.isArray(saved.world.ants)&&saved.world.ants.length<=450){
      world=World.restore(saved.world);initial=saved.initial;interventions=saved.interventions||[];
      comparison=saved.comparison?World.restore(saved.comparison):null;scenario=saved.scenario==='b'&&comparison?'b':'a';
      replaying=!!saved.replaying;replayIndex=saved.replayIndex||0;running=false;return;
    }
  }catch{}
  world=new World(initial.seed,initial.params);
}
function save(){
  try{localStorage.setItem('viveiro-v1',JSON.stringify({version:1,world:world.snapshot(),comparison:comparison?.snapshot(),scenario,initial,interventions,replaying,replayIndex}));$('save-status').textContent='Progresso salvo neste navegador';}
  catch{$('save-status').textContent='Armazenamento indisponível · use Exportar dados';}
}
function intervention(type,x=0,z=0,value){
  if(replaying){interventions=interventions.slice(0,replayIndex);replaying=false;}
  const accepted=world.intervene(type,x,z,value);
  if(!accepted){toast(world.events[0].text);return;}
  if(comparison)comparison.intervene(type,x,z,value);
  interventions.push({tick:world.tick,type,x,z,value});
  lastForecast=-1000;syncControls();updateUi();save();
}
function reset(seed,params,replay=false){
  world=new World(seed,params);comparison=null;scenario='a';accumulator=0;
  if(!replay){initial={seed,params:{...params}};interventions=[];replaying=false;replayIndex=0;}
  else{replaying=true;replayIndex=0;}
  forecastId++;forecastPending=false;forecastCache=null;lastForecast=-1000;
  try{scene?.dispose();scene=new Terrarium($('viewport'),world,intervention);}catch(error){handleError(error);}
  running=true;document.querySelectorAll('[data-tool]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});
  if(scene)scene.showTrails=$('trails').checked;
  configureAntCamera();antListKey='';
  $('tool-hint').textContent='Escolha um elemento e clique no solo.';
  $('scene-guide').textContent='Arraste para orbitar · Role para aproximar';
  syncControls();updateUi();save();
}
function syncControls(){
  for(const key of ['humidity','light','randomness']){
    $(key).value=world.params[key];$(key+'-value').textContent=world.params[key]+'%';$(key).style.setProperty('--range',world.params[key]+'%');
  }
  $('seed').value=initial.seed;
  $('play').textContent=running?'Ⅱ':'▶';$('play').setAttribute('aria-label',running?'Pausar simulação':'Continuar simulação');
  $('status-text').textContent=running?'ECOSSISTEMA VIVO':'OBSERVAÇÃO PAUSADA';
  $('comparison-panel').hidden=!comparison;$('chart-b-legend').hidden=!comparison;$('chart-comparison-legend').hidden=!comparison;
  $('compare').firstChild.textContent=comparison?'Encerrar comparação ':'Comparar dois cenários ';
  document.querySelectorAll('[data-scenario]').forEach(b=>b.classList.toggle('active',b.dataset.scenario===scenario));
}
function updateUi(){
  const w=active(),workers=w.workers.length,queen=w.ants.some(a=>a.kind==='queen'),male=w.ants.some(a=>a.kind==='male');
  for(const key of ['humidity','light','randomness'])if(document.activeElement!==$(key)){
    $(key).value=world.params[key];$(key+'-value').textContent=world.params[key]+'%';$(key).style.setProperty('--range',world.params[key]+'%');
  }
  $('population').textContent=w.population;
  $('population-detail').textContent=(queen?'1 rainha':'Sem rainha')+(workers?' · '+workers+' operárias':male?' · 1 macho':'');
  $('brood').textContent=w.brood.length;$('food').replaceChildren(document.createTextNode(format(w.food)),Object.assign(document.createElement('span'),{textContent:' u.'}));
  $('vegetation').replaceChildren(document.createTextNode(w.plants.length),Object.assign(document.createElement('span'),{textContent:' plantas'}));
  $('predators').textContent=w.predators.length;
  $('day').textContent='Dia '+format(w.day);
  $('time-of-day').textContent=w.day<1?'A fundação':w.workers.length===0?'O começo da colônia':scenario==='b'?'Cenário B · alterado':'O ritmo da colônia';
  $('chart-days').textContent=format(w.day)+' DIAS';
  const list=$('events');list.replaceChildren();
  for(const event of w.events.slice(0,7)){
    const li=document.createElement('li'),time=document.createElement('time'),dot=document.createElement('span'),text=document.createElement('span');
    time.textContent='D '+format(event.day);dot.className='event-dot '+event.type;text.textContent=event.text;
    li.append(time,dot,text);list.append(li);
  }
  let observation;
  if(!queen)observation='A colônia perdeu a rainha. Observe quanto tempo as operárias conseguem sobreviver.';
  else if(w.food<2)observation='As reservas estão baixas. Novas crias dependem do alimento que as operárias conseguirem trazer.';
  else if(w.workers.length===0&&w.brood.length)observation='As primeiras crias estão no ninho: '+w.brood.filter(b=>b.age<.35).length+' ovos, '+w.brood.filter(b=>b.age>=.35&&b.age<.9).length+' larvas e '+w.brood.filter(b=>b.age>=.9).length+' pupas.';
  else if(w.workers.some(a=>a.carrying))observation='Há operárias trazendo alimento. O caminho de volta deixa pistas de feromônios para a colônia.';
  else if(w.workers.length)observation='As operárias exploram o ambiente. Um encontro com alimento ou perigo pode mudar sua próxima decisão.';
  else observation='A rainha prepara o ninho. O primeiro ciclo de vida está começando.';
  $('observation').textContent=observation;
  if(comparison)$('comparison-text').textContent='B começou com +1 ponto de umidade. Agora: A '+world.population+' · B '+comparison.population+' formigas.';
  updateAntCamera(w);
  if(forecastCache&&forecastCache.scenario===scenario){
    const f=forecastCache.result;
    $('forecast-value').replaceChildren(document.createTextNode(f.low===f.high?String(f.low):f.low+'–'+f.high),Object.assign(document.createElement('span'),{textContent:' formigas'}));
    $('forecast-note').textContent='Intervalo P10–P90 · '+f.runs+' cenários · a partir do dia '+format(f.tick/100)+'.';
  }else{$('forecast-value').innerHTML='— <span>formigas</span>';$('forecast-note').textContent='Calculando 18 futuros possíveis…';}
  drawChart();
}
function configureAntCamera(){
  if(!scene)return;
  scene.onSelect=id=>{selectedAnt=id;$('ant-select').value=String(id);updateAntCamera(active());};
  scene.onFollowEnded=()=>{toast('Esta formiga não está mais na colônia. A câmera voltou ao terrário.');updateAntCamera(active());};
}
function updateAntCamera(w){
  const key=scenario+':'+w.ants.map(a=>a.id).join(',');
  if(key!==antListKey){
    antListKey=key;const options=w.ants.map(a=>{const option=document.createElement('option');option.value=String(a.id);option.textContent=({queen:'Rainha',male:'Macho',worker:'Operária'})[a.kind]+' #'+a.id;return option;});
    $('ant-select').replaceChildren(...options);
  }
  if(!w.ants.some(a=>a.id===selectedAnt))selectedAnt=w.workers[0]?.id??w.ants[0]?.id??null;
  $('ant-select').value=String(selectedAnt??'');
  const ant=w.ants.find(a=>a.id===selectedAnt);
  $('ant-state').textContent=ant?(ant.y<-.1?'Subsolo · ':'Superfície · ')+ant.state+' · energia '+Math.round(ant.energy)+'%':'Nenhuma formiga viva.';
  $('follow-ant').disabled=!ant;$('follow-ant').hidden=!!scene?.followId;$('exit-ant').hidden=!scene?.followId;
  $('scene-guide').textContent=scene?.followId?'Arraste para olhar · Esc para sair':scene?.tool?'Clique no solo · Esc para sair':'Arraste para orbitar · Role para aproximar';
}
function drawChart(){
  const canvas=$('chart'),r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
  const dpr=Math.min(window.devicePixelRatio||1,2),width=r.width,height=r.height;
  if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);}
  const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
  const left=24,right=6,top=9,bottom=18,w=width-left-right,h=height-top-bottom;
  const maxTick=Math.max(100,world.tick),minTick=Math.max(0,maxTick-3000);
  const histories=[world.history,...(comparison?[comparison.history]:[])];
  const maxValue=Math.max(5,...histories.flat().filter(p=>p.tick>=minTick).map(p=>p.population));
  const max=Math.ceil(maxValue/5)*5;
  ctx.font='8px Arial';ctx.textAlign='right';ctx.textBaseline='middle';
  for(let i=0;i<3;i++){const y=top+h*i/2;ctx.strokeStyle='#e3e8d9';ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(width-right,y);ctx.stroke();ctx.fillStyle='#a4ad97';ctx.fillText(String(Math.round(max*(1-i/2))),left-6,y);}
  histories.forEach((history,index)=>{
    const points=history.filter(p=>p.tick>=minTick);if(points.length<1)return;
    const coords=points.map(p=>[left+(p.tick-minTick)/(maxTick-minTick)*w,top+h-p.population/max*h]);
    if(!index){const gradient=ctx.createLinearGradient(0,top,0,height);gradient.addColorStop(0,'#9bb67a45');gradient.addColorStop(1,'#9bb67a00');ctx.fillStyle=gradient;ctx.beginPath();ctx.moveTo(coords[0][0],top+h);coords.forEach(p=>ctx.lineTo(...p));ctx.lineTo(coords.at(-1)[0],top+h);ctx.closePath();ctx.fill();}
    ctx.strokeStyle=index?'#bd8c57':'#698747';ctx.lineWidth=1.7;ctx.setLineDash(index?[4,3]:[]);ctx.beginPath();coords.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();ctx.setLineDash([]);
    const last=coords.at(-1);ctx.beginPath();ctx.arc(...last,2.4,0,Math.PI*2);ctx.fillStyle=index?'#bd8c57':'#698747';ctx.fill();
  });
  ctx.textAlign='left';ctx.fillStyle='#a4ad97';ctx.fillText(format(minTick/100),left,height-5);
  ctx.textAlign='right';ctx.fillText(format(maxTick/100),width-right,height-5);
}
function requestForecast(){
  if(!worker||forecastPending)return;
  const w=active();forecastPending=true;lastForecast=w.tick;const id=++forecastId;
  worker.postMessage({id,snapshot:w.snapshot(),runs:18,days:3});
}
function handleError(error){
  console.error(error);
  const loading=$('loading');loading.hidden=false;loading.replaceChildren();
  const title=document.createElement('strong'),message=document.createElement('span');
  title.textContent='A cena 3D não pôde iniciar.';message.textContent='Use um navegador com WebGL e aceleração de hardware ativada.';loading.append(title,message);
}
load();
try{
  scene=new Terrarium($('viewport'),active(),intervention);configureAntCamera();$('loading').hidden=true;
  worker=new Worker(new URL('./forecast.worker.js',import.meta.url),{type:'module'});
  worker.onmessage=({data})=>{
    if(data.id!==forecastId)return;forecastPending=false;
    if(data.result){forecastCache={scenario,result:data.result};updateUi();}
    else{$('forecast-note').textContent='Previsão indisponível nesta execução.';}
  };
  worker.onerror=()=>{forecastPending=false;worker.terminate();worker=null;$('forecast-note').textContent='Este navegador não disponibilizou a previsão.';};
}catch(error){handleError(error);}
for(const key of ['humidity','light','randomness']){
  $(key).addEventListener('input',()=>{$(key+'-value').textContent=$(key).value+'%';$(key).style.setProperty('--range',$(key).value+'%');});
  $(key).addEventListener('change',()=>intervention(key,0,0,Number($(key).value)));
}
$('rain').onclick=()=>{intervention('rain');toast('A umidade aumentou. Observe a resposta do ambiente.');};
$('play').onclick=()=>{running=!running;accumulator=0;syncControls();save();};
document.querySelectorAll('[data-speed]').forEach(button=>button.onclick=()=>{
  speed=Number(button.dataset.speed);document.querySelectorAll('[data-speed]').forEach(b=>b.classList.toggle('active',b===button));
});
document.querySelectorAll('[data-tool]').forEach(button=>button.onclick=()=>{
  if(!scene)return;const tool=scene.tool===button.dataset.tool?null:button.dataset.tool;scene.setTool(tool);
  document.querySelectorAll('[data-tool]').forEach(b=>{const selected=b.dataset.tool===tool;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  $('tool-hint').textContent=tool?'Clique no solo para adicionar '+({food:'alimento',plant:'uma planta',predator:'uma aranha'})[tool]+'.':'Escolha um elemento e clique no solo.';
  $('scene-guide').textContent=tool?'Clique no solo · Esc para sair':'Arraste para orbitar · Role para aproximar';
});
$('trails').onchange=()=>{if(scene)scene.showTrails=$('trails').checked;};
$('ant-select').onchange=()=>{selectedAnt=Number($('ant-select').value);if(scene?.followId)scene.followAnt(selectedAnt);updateAntCamera(active());};
$('follow-ant').onclick=()=>{if(scene?.followAnt(selectedAnt)){document.querySelectorAll('[data-tool]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false');});updateAntCamera(active());toast('Você acompanha a formiga. Arraste para olhar ao redor.');}};
$('exit-ant').onclick=()=>{scene?.stopFollowing();updateAntCamera(active());};
function setView(top){scene?.setView(top);$('view-top').classList.toggle('active',top===true);$('view-iso').classList.toggle('active',top===false);$('view-side').classList.toggle('active',top==='side');}
$('view-top').onclick=()=>setView(true);$('view-iso').onclick=()=>setView(false);
$('view-side').onclick=()=>setView('side');
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.scene-card').requestFullscreen();}catch{toast('Tela cheia indisponível neste navegador.');}};
$('new-world').onclick=()=>{const seed='SEMENTE-'+Math.floor(Date.now()%100000);reset(seed,{...world.params});toast('Um novo começo. Observe os primeiros ovos.');};
$('apply-seed').onclick=()=>{const seed=$('seed').value.trim();if(seed)reset(seed,{...world.params});};
$('seed').onkeydown=e=>{if(e.key==='Enter')$('apply-seed').click();};
$('replay').onclick=()=>{reset(initial.seed,initial.params,true);toast('Repetindo o cenário com as mesmas intervenções nos mesmos instantes.');};
$('compare').onclick=()=>{
  if(comparison){comparison=null;scenario='a';toast('Comparação encerrada. O cenário A continua.');}
  else{comparison=World.restore(world.snapshot());comparison.params.humidity=Math.min(100,comparison.params.humidity+1);comparison.log('Cenário B: umidade aumentada em 1 ponto.');toast('Dois mundos, uma pequena diferença. Compare a evolução no gráfico.');}
  forecastId++;forecastPending=false;forecastCache=null;lastForecast=-1000;syncControls();updateUi();save();
};
document.querySelectorAll('[data-scenario]').forEach(button=>button.onclick=()=>{
  scenario=button.dataset.scenario;forecastId++;forecastPending=false;forecastCache=null;lastForecast=-1000;syncControls();updateUi();
});
const dialog=$('help-dialog');
$('help').onclick=()=>dialog.showModal();
$('close-help').onclick=$('start-observing').onclick=()=>dialog.close();
dialog.onclick=e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}};
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&scene?.tool)document.querySelector('[data-tool].active')?.click();
  if(e.key==='Escape'&&scene?.followId){scene.stopFollowing();updateAntCamera(active());}
  if(e.code==='Space'&&!/INPUT|BUTTON/.test(e.target.tagName)&&!dialog.open){e.preventDefault();$('play').click();}
});
$('export').onclick=()=>{
  const data={version:1,exportedAt:new Date().toISOString(),initial,interventions,world:world.snapshot(),comparison:comparison?.snapshot(),forecast:forecastCache,
    description:'Modelo ecológico simplificado. Tempos de vida acelerados. 100 passos = 1 dia simulado.'};
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='viveiro-'+world.seed.replace(/[^a-z0-9_-]/gi,'_')+'-dia-'+Math.floor(world.day)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Dados, histórico e semente exportados em JSON.');
};
function tick(){
  if(replaying){
    while(replayIndex<interventions.length&&interventions[replayIndex].tick<=world.tick){
      const action=interventions[replayIndex++];world.intervene(action.type,action.x,action.z,action.value);
      if(comparison)comparison.intervene(action.type,action.x,action.z,action.value);
    }
  }
  world.step();comparison?.step();
}
let previous=performance.now();
function frame(now){
  const dt=Math.min((now-previous)/1000,.1);previous=now;
  if(running&&!document.hidden){accumulator+=dt*10*speed;let budget=30;while(accumulator>=1&&budget-->0){tick();accumulator--;}}
  if(scene){scene.update(active(),now/1000);scene.render();}
  if(now-lastUi>350){updateUi();lastUi=now;}
  if(now-lastSave>5000){save();lastSave=now;}
  if(active().tick-lastForecast>100||lastForecast<0)requestForecast();
  requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange',()=>{previous=performance.now();accumulator=0;if(document.hidden)save();});
window.addEventListener('pagehide',save);window.addEventListener('resize',drawChart);
syncControls();updateUi();requestForecast();requestAnimationFrame(frame);
