"""Measured World curves; requires matplotlib and numpy. Never rescales outcomes."""
import argparse
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D
from matplotlib.ticker import FuncFormatter, MaxNLocator
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument("input", type=Path)
parser.add_argument("out", type=Path)
args = parser.parse_args()
data = json.loads(args.input.read_text(encoding="utf-8"))
if len(data["results"]) != data["plannedRuns"]:
    raise SystemExit("Wait for all predeclared runs before making the final figure")
args.out.mkdir(parents=True, exist_ok=True)
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 12,
    "text.color": "#23433b", "axes.labelcolor": "#23433b",
    "xtick.color": "#23433b", "ytick.color": "#23433b"})
BG, GRID = "#f8f8f2", "#dce5dc"
COLORS = {2: "#9471ad", 3: "#008477", 50: "#3182ad", 100: "#b87328", 200: "#458347"}

def series(n, version, field):
    runs = [r for r in data["results"] if r["options"]["workers"] == n and r["options"]["profileVersion"] == version]
    assert len(runs) == 2
    ticks = [s["tick"] for s in runs[0]["samples"]]
    assert all([s["tick"] for s in r["samples"]] == ticks for r in runs)
    values = np.array([[s["removed"] - s["frontRemoved"] if field == "traffic" else s[field]
        for s in r["samples"]] for r in runs])
    return np.array(ticks), values.mean(axis=0), values.min(axis=0), values.max(axis=0)

def canvas(title, subtitle):
    fig, axes = plt.subplots(3, 1, figsize=(10.8, 13.5), dpi=100)
    fig.patch.set_facecolor(BG)
    fig.subplots_adjust(left=.12, right=.95, top=.79, bottom=.18, hspace=.75)
    fig.text(.10, .955, "viveiro. / ENSAIO DO MOTOR 3D", fontsize=13, weight="bold", color=COLORS[3])
    fig.text(.10, .913, title, fontsize=28, weight="bold")
    fig.text(.10, .881, subtitle, fontsize=15)
    for ax in axes:
        ax.set_facecolor(BG)
        ax.spines[["top", "right"]].set_visible(False)
        for s in ax.spines.values(): s.set_color("#a2b4aa")
        ax.grid(axis="y", color=GRID)
        ax.set_xlim(0, 2000)
        ax.set_xticks([0, 500, 1000, 1500, 2000])
        ax.set_ylabel("Volume (u. do modelo)")
        ax.tick_params(length=0)
        ax.yaxis.set_major_locator(MaxNLocator(nbins=5))
        ax.yaxis.set_major_formatter(FuncFormatter(lambda v, _: format(v, ".3g").replace(".", ",")))
    axes[-1].set_xlabel("Ticks do motor (100 ticks = 1 dia do modelo)")
    fig.text(.10, .098, "2 seeds pareadas por grupo · médias; faixas mostram mínimo–máximo.", fontsize=11)
    fig.text(.10, .073, "Grupos preparados em ninho procedural; excesso inicia na superfície.", fontsize=11)
    fig.text(.10, .048, "Não são horas físicas nem cm³ de Buhl. Sem multiplicador de volume.", fontsize=11)
    fig.text(.10, .025, "Fonte: " + data["sourceFingerprint"][:16] + " · World.step · modelo exploratório", fontsize=10, color="#597063")
    return fig, axes

fig, axes = canvas("Escavação no Viveiro", "Antes e depois do acesso geométrico às frentes")
limit = max(series(n, v, "removed")[3].max() for n in [50, 100, 200] for v in [2, 3]) * 1.12
for ax, n in zip(axes, [50, 100, 200]):
    ax.set_title(f"{n} operárias", loc="left", fontsize=17, weight="bold", pad=10)
    ax.set_ylim(0, limit)
    for v in [2, 3]:
        ticks, mean, low, high = series(n, v, "removed")
        ax.fill_between(ticks, low, high, color=COLORS[v], alpha=.13, linewidth=0)
        ax.plot(ticks, mean, color=COLORS[v], linewidth=3, linestyle="--" if v == 2 else "-")
    a, b = series(n, 2, "removed")[1][-1], series(n, 3, "removed")[1][-1]
    ax.text(.02, .90, f"Final médio: v2 {a:.3f} → v3 {b:.3f}".replace(".", ","), transform=ax.transAxes, fontsize=12)
fig.legend([Line2D([0], [0], color=COLORS[2], lw=3, linestyle="--"), Line2D([0], [0], color=COLORS[3], lw=3)],
    ["v2 · cota por projeto", "v3 · acesso geométrico"], loc="upper left", bbox_to_anchor=(.10, .85), ncol=2, frameon=False, fontsize=12)
fig.savefig(args.out / "viveiro-acesso-comparacao-1080x1350.png", facecolor=BG)
plt.close(fig)

fig, axes = canvas("Origem e destino da terra", "Narbonne v3 · grupos de 50, 100 e 200 operárias")
for ax, field, title in zip(axes, ["frontRemoved", "traffic", "deposited"],
        ["Escavação nas frentes", "Alargamento por congestionamento", "Entregue na superfície"]):
    ax.set_title(title, loc="left", fontsize=17, weight="bold", pad=10)
    highmax = max(series(n, 3, field)[3].max() for n in [50, 100, 200])
    ax.set_ylim(0, highmax * 1.15 if highmax else 1)
    for n in [50, 100, 200]:
        ticks, mean, low, high = series(n, 3, field)
        ax.fill_between(ticks, low, high, color=COLORS[n], alpha=.12, linewidth=0)
        ax.plot(ticks, mean, color=COLORS[n], linewidth=2.6)
fig.legend([Line2D([0], [0], color=COLORS[n], lw=3) for n in [50, 100, 200]],
    [f"{n} operárias" for n in [50, 100, 200]], loc="upper left", bbox_to_anchor=(.10, .85), ncol=3, frameon=False, fontsize=12)
fig.savefig(args.out / "viveiro-acesso-transporte-1080x1350.png", facecolor=BG)
plt.close(fig)
print(args.out.resolve())
