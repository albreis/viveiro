import json
from pathlib import Path
from statistics import fmean
import matplotlib
matplotlib.use('Agg')
from matplotlib import pyplot as plt
r=Path(__file__).resolve().parents[1]; bg='#f8f8f2'; ink='#203e37'
proof=json.loads((r/'docs/validacoes/buhl-locomocao-resultado.json').read_text(encoding='utf-8'))
series={a:json.loads((r/path).read_text(encoding='utf-8')) for a,path in [('base','.runtime/buhl-locomocao-72h/base/series.json'),('velocidade','.runtime/buhl-acesso-geometrico-72h/series.json')]}
assert series['base']['sourceFingerprint']==series['velocidade']['sourceFingerprint']
with plt.rc_context({'font.family':'DejaVu Sans','text.color':ink,'axes.labelcolor':ink,'font.size':11}):
 fig,axes=plt.subplots(3,1,figsize=(9,11.25),facecolor=bg)
 fig.subplots_adjust(left=.13,right=.95,top=.78,bottom=.13,hspace=.55)
 fig.text(.11,.95,'viveiro. / ACESSO À FRENTE DE ESCAVAÇÃO',color='#007c6e',fontsize=11,fontweight='bold')
 fig.text(.11,.905,'Hipótese de acesso geométrico',fontsize=26,fontweight='bold')
 fig.text(.11,.868,'15 pares de 72 horas; cinco seeds por grupo',fontsize=13)
 for i,(ax,n) in enumerate(zip(axes,[50,100,200])):
  ax.set_facecolor(bg);points=proof['arms'][0]['diagnostic']['groups'][i]['curve'];h=[p['hour'] for p in points]
  ax.fill_between(h,[p['bandCm3'][0] for p in points],[p['bandCm3'][1] for p in points],color='#eee0bf')
  ax.plot(h,[p['readCm3'] for p in points],':o',lw=1.5,color='#684517',label='Buhl 2001: leitura ±3 cm³')
  for arm,color,label,ls in [('base','#8a67a0','Acesso 0,35','--'),('velocidade','#4777a8','Acesso 1','-')]:
   runs=[v for v in series[arm]['runs'] if v['workers']==n];xs=[s['timeSeconds']/3600 for s in runs[0]['samples']]
   ys=[fmean(v['samples'][j]['voidVolumeCm3'] for v in runs) for j in range(len(xs))];ax.plot(xs,ys,ls,color=color,lw=2.5,label=label)
  ax.set_title(f'{n} operárias',loc='left',fontweight='bold',fontsize=14)
  ax.set(xlim=(0,72),ylim=(0,None),xticks=[0,12,24,36,48,60,72],ylabel='Volume escavado (cm³)')
  ax.spines[['top','right']].set_visible(False);ax.grid(axis='y',color='#d9e2df',alpha=.7);ax.tick_params(length=0)
  if i==0:handles,labels=ax.get_legend_handles_labels()
  if i==2:ax.set_xlabel('Tempo simulado (horas)')
 fig.legend(handles,labels,ncols=2,frameon=False,bbox_to_anchor=(.10,.846),loc='upper left',fontsize=10)
 fig.text(.11,.068,'Morfologia e fadiga de escavação mantidas. Sem multiplicador de volume.',fontsize=10,color='#53655b')
 fig.text(.11,.043,'Ablação exploratória do acesso. Não é validação independente do modelo.',fontsize=9,color='#53655b')
 fig.savefig(r/'docs/validacoes/figuras/buhl-acesso-geometrico-1080x1350.png',dpi=120,facecolor=bg);plt.close(fig)
print('Prévia criada com os dois braços completos.')
