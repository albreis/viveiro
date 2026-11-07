"""Measured curves from the frozen factorial assay. No amplitude correction."""
import csv
import hashlib
import io
import json
from pathlib import Path
from statistics import fmean

import matplotlib
matplotlib.use("Agg")
from matplotlib import pyplot as plt
from matplotlib.lines import Line2D

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "docs/validacoes"
receipt = json.loads((DATA / "buhl-locomocao-resultado.json").read_text(encoding="utf-8"))
text = (DATA / "buhl-locomocao-72h.csv").read_text(encoding="utf-8")
assert hashlib.sha256(text.encode()).hexdigest() == receipt["csvSha256Lf"]
rows = list(csv.DictReader(io.StringIO(text)))
assert len(rows) == receipt["sampleCount"] == 13020
BG, INK = "#f8f8f2", "#203e37"
styles = {
    "base": ("#8a67a0", "Base: 11,02 mm/s; carga 0,85", "--"),
    "velocidade": ("#4777a8", "Só velocidade: 15,05 mm/s", "-"),
    "carga": ("#c17e37", "Só carga: fator 1", "-"),
    "ambos": ("#007c6e", "Velocidade e carga", "-"),
}
number = lambda x: f"{x:.2f}".replace(".", ",")

with plt.rc_context({"font.family":"DejaVu Sans", "font.size":11,
                     "text.color":INK, "axes.labelcolor":INK}):
    fig = plt.figure(figsize=(9,11.25), facecolor=BG)
    fig.text(.11,.962,"viveiro. / ENSAIO FATORIAL DE 72 HORAS",fontsize=10,
             color="#007c6e",fontweight="bold")
    fig.text(.11,.918,"Velocidade, carga e escavação",fontsize=25,
             fontweight="bold")
    fig.text(.11,.886,"Mesma morfologia; intervenções separadas",fontsize=14)
    handles = [Line2D([],[],color=c,label=label,ls=ls,lw=2.4)
               for c,label,ls in styles.values()]
    handles += [Line2D([],[],color="#684517",ls=":",marker="o",ms=4,
                      label="Buhl 2001: leitura ±3 cm³"),
                Line2D([],[],color="#294573",marker="D",ms=4,
                       label="Buhl 2005: média ± DP em 72 h")]
    fig.legend(handles=handles,ncols=2,loc="upper left",bbox_to_anchor=(.10,.862),
               frameon=False,fontsize=9.1,columnspacing=1.1,labelspacing=.9)
    for i,n in enumerate([50,100,200]):
        ax=fig.add_axes([.13,.58-i*.235,.82,.15], facecolor=BG)
        group=receipt["arms"][0]["diagnostic"]["groups"][i]
        points=group["curve"]
        x=[p["hour"] for p in points]
        ax.fill_between(x,[p["bandCm3"][0] for p in points],
                        [p["bandCm3"][1] for p in points],color="#eee0bf",zorder=0)
        ax.plot(x,[p["readCm3"] for p in points],":o",color="#684517",lw=1.5,ms=4)
        endpoints={}
        for arm,(color,label,ls) in styles.items():
            values={}
            for row in rows:
                if row["arm"]==arm and int(row["workers"])==n:
                    values.setdefault(int(row["timeSeconds"]),[]).append(float(row["voidVolumeCm3"]))
            assert all(len(v)==5 for v in values.values())
            times=sorted(values)
            mean=[fmean(values[t]) for t in times]
            expected=next(a for a in receipt["arms"] if a["id"]==arm)["diagnostic"]["groups"][i]
            assert abs(mean[-1]-expected["finalCm3"])<1e-10
            endpoints[arm]=mean[-1]
            ax.plot([t/3600 for t in times],mean,ls,color=color,lw=2.7 if arm=="ambos" else 1.9)
        table=group["articleFinal72h"]
        ax.errorbar([72],[table["observedMeanCm3"]],yerr=[table["observedSdCm3"]],
                    fmt="D",color="#294573",capsize=4,lw=1.1,ms=4,zorder=5)
        ax.set_title(f"{n} operárias",loc="left",fontweight="bold",fontsize=14,pad=8)
        ax.text(.02,.86,f"Base {number(endpoints['base'])} → ambos {number(endpoints['ambos'])} cm³",
                transform=ax.transAxes,color="#007c6e",fontsize=10)
        ax.set(xlim=(0,76),ylim=(0,None),xticks=[0,12,24,36,48,60,72],ylabel="Volume escavado (cm³)")
        ax.grid(axis="y",color="#cfd9d2",lw=.7,alpha=.6)
        ax.spines[["top","right"]].set_visible(False)
        for side in ["left","bottom"]: ax.spines[side].set_color("#abbab0")
        ax.tick_params(length=0,labelsize=10)
        if i==2: ax.set_xlabel("Tempo simulado (horas)",fontsize=11)
    for i,line in enumerate([
        "5 seeds pareadas por grupo; médias das execuções, sem multiplicador de volume.",
        "±3 cm³: digitalização de 2001. DP: dispersão de 2005. Modelo exploratório.",
        "Fadiga apenas de escavação; ensaio da arena, separado do motor World 3D.",
    ]): fig.text(.11,.06-i*.02,line,fontsize=8.9,color="#53655b")
    output=DATA/"figuras/buhl-locomocao-1080x1350.png"
    fig.savefig(output,dpi=120,facecolor=BG,metadata={"Title":"Buhl: velocidade e carga",
                "Description":"Curvas medidas e hashes em buhl-locomocao-resultado.json."})
    plt.close(fig)
    print(output)
