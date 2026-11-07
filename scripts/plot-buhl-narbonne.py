"""Plot the newly measured Narbonne arena against both archived controls."""
import csv
import hashlib
import io
import json
import math
import runpy
from pathlib import Path
from statistics import fmean

import matplotlib
matplotlib.use("Agg")
from matplotlib import pyplot as plt
from matplotlib.lines import Line2D

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "docs" / "validacoes"
FIGURES = DATA / "figuras"
receipt = json.loads((DATA / "buhl-narbonne-operarias-comparacao.json").read_text(encoding="utf-8"))
old_receipt = json.loads((DATA / "buhl-fadiga-comparacao-72h.json").read_text(encoding="utf-8"))
loader = runpy.run_path(str(ROOT / "scripts" / "plot-buhl-fatigue.py"))
old = loader["mean_curves"]("local", old_receipt["arms"]["local"])
control = loader["mean_curves"]("controle", old_receipt["arms"]["controle"])
text = (DATA / "buhl-narbonne-operarias-72h.csv").read_text(encoding="utf-8")
assert hashlib.sha256(text.encode()).hexdigest() == receipt["seriesSha256Lf"]
rows = list(csv.DictReader(io.StringIO(text)))
times = loader["SECONDS"]
hours = [t / 3600 for t in times]
new = {}
for group in receipt["diagnostic"]["groups"]:
    n = group["workers"]
    values = [[float(row["voidVolumeCm3"]) for row in rows
               if int(row["workers"]) == n and int(row["timeSeconds"]) == t] for t in times]
    assert all(len(v) == 5 for v in values)
    new[n] = [fmean(v) for v in values]
    for p in group["curve"]:
        assert abs(new[n][times.index(p["hour"] * 3600)] - p["simulatedMeanCm3"]) < 1e-10

INK, GREEN, PURPLE, GREY, BROWN, BLUE = "#203e37", "#007c6e", "#8a67a0", "#a3aaa6", "#9a6626", "#4777a8"
BG = "#f8f8f2"
number = lambda n: f"{n:.2f}".replace(".", ",")


def legend(fig, y):
    handles = [
        Line2D([], [], color=GREEN, lw=3, label="Novo · morfologia + fadiga de escavação"),
        Line2D([], [], color=PURPLE, lw=2, ls="--", label="Anterior · fadiga de escavação"),
        Line2D([], [], color=GREY, lw=1.5, ls="--", label="Anterior · sem fadiga"),
        Line2D([], [], color=BROWN, lw=1.5, ls=":", marker="o", ms=4, label="Buhl 2001 · curva e leitura ±3 cm³"),
        Line2D([], [], color=BLUE, lw=1.2, marker="D", ms=4, label="Buhl 2005 · média ± DP em 72 h"),
    ]
    fig.legend(handles=handles, loc="upper left", bbox_to_anchor=(0.09, y),
               ncols=2, frameon=False, fontsize=9.2, handlelength=2.2,
               labelspacing=1, columnspacing=1.2)


def panel(ax, group, compact=False):
    n = group["workers"]
    points = group["curve"]
    x = [p["hour"] for p in points]
    lower, upper = zip(*(p["bandCm3"] for p in points))
    ax.fill_between(x, lower, upper, color="#eee0bf", zorder=0)
    ax.plot(x, [p["readCm3"] for p in points], ":o", color=BROWN, lw=1.5, ms=4, zorder=4)
    ax.plot(hours, control[n], "--", color=GREY, lw=1.3)
    ax.plot(hours, old[n], "--", color=PURPLE, lw=2)
    ax.plot(hours, new[n], color=GREEN, lw=2.8, zorder=3)
    table = group["articleFinal72h"]
    ax.errorbar([72], [table["observedMeanCm3"]], yerr=[table["observedSdCm3"]],
                fmt="D", ms=4, color=BLUE, capsize=4, lw=1.2, zorder=5)
    ceiling = int(math.ceil(max(max(control[n]), max(new[n]), max(upper),
                   table["observedMeanCm3"] + table["observedSdCm3"]) / 10) * 10)
    step = 10 if ceiling <= 80 else 20
    ax.set(xlim=(0, 76), ylim=(0, ceiling), xticks=[0, 12, 24, 36, 48, 60, 72],
           yticks=range(0, ceiling + 1, step), ylabel="Volume escavado (cm³)")
    ax.grid(axis="y", color="#cfd9d2", lw=0.7, alpha=0.6)
    ax.spines[["top", "right"]].set_visible(False)
    for side in ["left", "bottom"]:
        ax.spines[side].set_color("#abbab0")
    ax.set_axisbelow(True)
    ax.set_facecolor(BG)
    ax.tick_params(length=0, labelsize=10 if compact else 12)
    if compact:
        ax.set_title(f"{n} operárias", loc="left", fontsize=14, fontweight="bold", pad=8)
        ax.text(0.02, 0.85, f"Novo em 72 h: {number(new[n][-1])} cm³",
                transform=ax.transAxes, fontsize=10, color=GREEN)


def save(fig, name):
    path = FIGURES / name
    fig.savefig(path, dpi=120, facecolor=BG, metadata={"Title": "Buhl × Viveiro — novo ensaio com morfologia",
        "Description": "Fonte e hashes em buhl-narbonne-operarias-comparacao.json."})
    plt.close(fig)
    return path.relative_to(ROOT).as_posix()


def draw(group=None):
    fig = plt.figure(figsize=(9, 11.25), facecolor=BG)
    combined = group is None
    fig.text(0.11, 0.962, "viveiro. / NOVO ENSAIO DE 72 HORAS", fontsize=10, color=GREEN, fontweight="bold")
    title = "Morfologia e escavação" if combined else f'{group["workers"]} operárias'
    fig.text(0.11, 0.918, title, fontsize=27, color=INK, fontweight="bold")
    fig.text(0.11, 0.886, "Porte, contato corporal e marcha atualizados", fontsize=14, color=INK)
    legend(fig, 0.862)
    if combined:
        for i, item in enumerate(receipt["diagnostic"]["groups"]):
            ax = fig.add_axes([0.13, 0.58 - i * 0.235, 0.82, 0.15])
            panel(ax, item, True)
            if i == 2:
                ax.set_xlabel("Tempo simulado (horas)", fontsize=11)
    else:
        n = group["workers"]
        ax = fig.add_axes([0.13, 0.335, 0.82, 0.385])
        panel(ax, group)
        ax.set_xlabel("Tempo simulado (horas)", labelpad=10)
        fig.text(0.11, 0.24, "NOVO · COM MORFOLOGIA", fontsize=11, color=GREEN)
        fig.text(0.11, 0.198, f"{number(new[n][-1])} cm³", fontsize=30, color=GREEN, fontweight="bold")
        fig.text(0.56, 0.24, "ANTERIOR · COM FADIGA", fontsize=11, color=PURPLE)
        fig.text(0.56, 0.198, f"{number(old[n][-1])} cm³", fontsize=27, color=PURPLE)
        fig.text(0.11, 0.125, "Resultado do conjunto das mudanças; efeitos individuais não isolados.", fontsize=10, color=INK)
    foot = ["5 seeds pareadas por grupo · médias · modelo exploratório",
            "±3 cm³: leitura de 2001. DP: dispersão de 2005. Escala própria por painel.",
            "Novo lote: perfil Narbonne v2, 24 °C e fadiga apenas de escavação."]
    for i, line in enumerate(foot):
        fig.text(0.11, 0.06 - i * 0.02, line, fontsize=9, color="#53655b")
    return save(fig, f'buhl-narbonne-{group["workers"] if group else "comparacao"}-1080x1350.png')


if __name__ == "__main__":
    with plt.rc_context({"font.family": "DejaVu Sans", "font.size": 12, "text.color": INK, "axes.labelcolor": INK}):
        files = [draw(), *(draw(g) for g in receipt["diagnostic"]["groups"])]
    print(json.dumps(files, ensure_ascii=False))
