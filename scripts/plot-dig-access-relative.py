"""Relative shapes and between-group ratios, without fitting a volume conversion."""
import argparse
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from matplotlib.ticker import PercentFormatter, MaxNLocator, FuncFormatter
import numpy as np

p = argparse.ArgumentParser()
p.add_argument("input", type=Path)
p.add_argument("reference", type=Path)
p.add_argument("out", type=Path)
a = p.parse_args()
data = json.loads(a.input.read_text(encoding="utf-8"))
ref = json.loads(a.reference.read_text(encoding="utf-8"))
assert len(data["results"]) == data["plannedRuns"] == 12
observed = {g["workers"]: np.array(g["curveCm3"]) for g in ref["groups"]}
rt = np.array(ref["hours"]) / ref["hours"][-1]
a.out.mkdir(parents=True, exist_ok=True)
BG, INK = "#f8f8f2", "#23433b"
COLORS = {2: "#9471ad", 3: "#008477", 50: "#3182ad", 100: "#b87328", 200: "#458347"}
GOLD = "#96702c"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 12,
    "text.color": INK, "axes.labelcolor": INK, "xtick.color": INK, "ytick.color": INK})

def samples(n, version):
    runs = [r for r in data["results"] if r["options"]["workers"] == n and r["options"]["profileVersion"] == version]
    assert len(runs) == 2
    ticks = np.array([s["tick"] for s in runs[0]["samples"]])
    assert all([s["tick"] for s in r["samples"]] == list(ticks) for r in runs)
    values = np.array([[s["removed"] for s in r["samples"]] for r in runs])
    assert np.all(values[:, -1] > 0)
    return ticks / ticks[-1], values

def canvas(title, subtitle):
    fig, axes = plt.subplots(3, 1, figsize=(10.8, 13.5), dpi=100)
    fig.patch.set_facecolor(BG)
    fig.subplots_adjust(left=.12, right=.95, top=.79, bottom=.18, hspace=.75)
    fig.text(.10, .955, "viveiro. / MOTOR 3D E REFERÊNCIA EMPÍRICA", fontsize=12, weight="bold", color=COLORS[3])
    fig.text(.10, .913, title, fontsize=28, weight="bold")
    fig.text(.10, .881, subtitle, fontsize=15)
    for ax in axes:
        ax.set_facecolor(BG)
        ax.spines[["top", "right"]].set_visible(False)
        for s in ax.spines.values(): s.set_color("#a2b4aa")
        ax.grid(axis="y", color="#dce5dc")
        ax.tick_params(length=0)
        ax.set_xlim(0, 1)
        ax.set_xticks([0, .25, .5, .75, 1])
        ax.xaxis.set_major_formatter(PercentFormatter(xmax=1, decimals=0))
    return fig, axes

fig, axes = canvas("Viveiro × Buhl", "Formato temporal em proporções do próprio ensaio")
for ax, n in zip(axes, [50, 100, 200]):
    ax.set_title(f"{n} operárias", loc="left", fontsize=17, weight="bold", pad=10)
    ax.set_ylim(0, 1.08)
    ax.set_yticks([0, .25, .5, .75, 1])
    ax.yaxis.set_major_formatter(PercentFormatter(xmax=1, decimals=0))
    ax.set_ylabel("Fração do volume final")
    for version in [2, 3]:
        t, v = samples(n, version)
        fraction = v / v[:, -1, None]
        ax.fill_between(t, fraction.min(axis=0), fraction.max(axis=0), color=COLORS[version], alpha=.11, linewidth=0)
        ax.plot(t, fraction.mean(axis=0), color=COLORS[version], lw=2.8, ls="--" if version == 2 else "-")
    ax.plot(rt, observed[n] / observed[n][-1], color=GOLD, lw=2.3, ls=":", marker="o", ms=4)
axes[-1].set_xlabel("Progresso relativo do ensaio")
fig.legend([Line2D([0], [0], color=COLORS[2], lw=3, ls="--"),
    Line2D([0], [0], color=COLORS[3], lw=3), Line2D([0], [0], color=GOLD, lw=2.3, ls=":", marker="o")],
    ["Viveiro v2", "Viveiro v3 · geométrico", "Buhl 2001 · leitura"],
    loc="upper left", bbox_to_anchor=(.10, .85), ncol=3, frameon=False, fontsize=11)
fig.text(.10, .102, "Cada curva termina em 100% por definição. Compara ritmo, não quantidade.", fontsize=11)
fig.text(.10, .077, "Viveiro: 2.000 ticks (2 seeds; faixa mín–máx). Buhl: 72 horas reais.", fontsize=11)
fig.text(.10, .052, "Buhl: incerteza original de leitura ±3 cm³ não propagada nesta escala.", fontsize=11)
fig.text(.10, .027, "Normalização não calibra tempo/volume nem valida o modelo. Fonte: Buhl (2001), Fig. 2a.", fontsize=10, color="#597063")
fig.savefig(a.out / "viveiro-buhl-padrao-relativo-1080x1350.png", facecolor=BG)
plt.close(fig)

fig, axes = canvas("Proporção entre os grupos", "Uma escala por motor: volume final do grupo de 100 = 1")
anchor = samples(100, 3)[1][:, -1].mean()
final_model, final_ref = [], []
for index, (ax, label) in enumerate(zip(axes[:2], ["Viveiro v3 · acesso geométrico", "Buhl 2001 · curva lida"])):
    ax.set_title(label, loc="left", fontsize=17, weight="bold", pad=10)
    ax.set_ylim(0, 1.8)
    ax.set_ylabel("Volume relativo a 100")
    ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: format(v, ".2g").replace(".", ",")))
    ax.yaxis.set_major_locator(MaxNLocator(nbins=4))
    for n in [50, 100, 200]:
        if index == 0:
            t, raw = samples(n, 3)
            v = raw / anchor
            ax.fill_between(t, v.min(axis=0), v.max(axis=0), color=COLORS[n], alpha=.10, lw=0)
            ax.plot(t, v.mean(axis=0), color=COLORS[n], lw=2.7)
            final_model.append(v.mean(axis=0)[-1])
        else:
            v = observed[n] / observed[100][-1]
            ax.plot(rt, v, color=COLORS[n], lw=2.4, ls=":", marker="o", ms=4)
            final_ref.append(v[-1])
axes[1].set_xlabel("Progresso relativo do ensaio")
ax = axes[2]
ax.set_title("Razão de volume no final de cada ensaio", loc="left", fontsize=17, weight="bold", pad=10)
ax.set_xlim(-.6, 2.6)
ax.set_ylim(0, 1.95)
ax.set_xticks([0, 1, 2], ["50 operárias", "100 operárias", "200 operárias"])
ax.set_ylabel("Volume relativo a 100")
ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: format(v, ".2g").replace(".", ",")))
for offset, vals, color, label in [(-.18, final_model, COLORS[3], "Viveiro v3"), (.18, final_ref, GOLD, "Buhl 2001")]:
    bars = ax.bar(np.arange(3) + offset, vals, width=.34, color=color, label=label)
    ax.bar_label(bars, labels=[f"{v:.2f}".replace(".", ",") for v in vals], padding=3, fontsize=10)
ax.legend(loc="upper left", ncol=2, frameon=False, fontsize=10)
fig.legend([Line2D([0], [0], color=COLORS[n], lw=3) for n in [50, 100, 200]],
    [f"{n} operárias" for n in [50, 100, 200]], loc="upper left", bbox_to_anchor=(.10, .85), ncol=3, frameon=False, fontsize=12)
fig.text(.10, .102, "Esta escala preserva a diferença de volume entre os tamanhos de grupo.", fontsize=11)
fig.text(.10, .077, "Viveiro: duas seeds, grupos preparados; quem não cabe inicia na superfície.", fontsize=11)
fig.text(.10, .052, "Viveiro: 2.000 ticks. Buhl: 72 h. Referências temporais distintas.", fontsize=11)
fig.text(.10, .027, "Padrão relativo; não são volumes físicos comparáveis nem validação independente.", fontsize=10, color="#597063")
fig.savefig(a.out / "viveiro-buhl-proporcao-grupos-1080x1350.png", facecolor=BG)
plt.close(fig)
print(a.out.resolve())
