"""Export the verified, archived Buhl comparison as four portrait PNGs."""
import hashlib
import json
import math
import runpy
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
from matplotlib import pyplot as plt
from matplotlib.lines import Line2D

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "docs" / "validacoes"
OUT = ARCHIVE / "figuras"
loader = runpy.run_path(str(ROOT / "scripts" / "plot-buhl-fatigue.py"))
receipt = json.loads((ARCHIVE / "buhl-fadiga-comparacao-72h.json").read_text(encoding="utf-8"))
control = loader["mean_curves"]("controle", receipt["arms"]["controle"])
fatigue = loader["mean_curves"]("local", receipt["arms"]["local"])
groups = receipt["arms"]["controle"]["groups"]
HOURS = [t / 3600 for t in loader["SECONDS"]]
INK, GREEN, PURPLE, BROWN, BLUE = "#203e37", "#007c6e", "#8a789e", "#9a6626", "#4777a8"
BG = "#f8f8f2"


def number(value):
    return f"{value:.2f}".replace(".", ",")


def legend(fig, y, fontsize=11):
    handles = [
        Line2D([], [], color=GREEN, lw=3, label="Fadiga de escavação · principal"),
        Line2D([], [], color=PURPLE, lw=2, ls="--", label="Controle sem fadiga"),
        Line2D([], [], color=BROWN, lw=1.8, ls=":", marker="o", ms=4,
               label="Buhl 2001 · curva e leitura ±3 cm³"),
        Line2D([], [], color=BLUE, lw=1.2, marker="D", ms=4,
               label="Buhl 2005 · média ± DP em 72 h"),
    ]
    fig.legend(handles=handles, loc="upper left", bbox_to_anchor=(0.09, y),
               ncols=2, frameon=False, fontsize=fontsize, columnspacing=1.4,
               handlelength=2.3, labelspacing=1)


def panel(ax, group, compact=False):
    workers = group["workers"]
    points = group["curve"]
    times = [p["hour"] for p in points]
    values = [p["readCm3"] for p in points]
    lower, upper = zip(*(p["bandCm3"] for p in points))
    table = group["articleFinal72h"]
    ax.fill_between(times, lower, upper, color="#eee0bf", zorder=1)
    ax.plot(times, values, ":o", color=BROWN, lw=1.8, ms=4, zorder=4)
    ax.plot(HOURS, control[workers], "--", color=PURPLE, lw=2, alpha=0.85)
    ax.plot(HOURS, fatigue[workers], color=GREEN, lw=2.8, zorder=3)
    ax.errorbar([72], [table["observedMeanCm3"]], yerr=[table["observedSdCm3"]],
                color=BLUE, fmt="D", ms=4.5, capsize=4, lw=1.2, zorder=5)
    ceiling = math.ceil(max(max(control[workers]), max(upper),
                            table["observedMeanCm3"] + table["observedSdCm3"]) / 10) * 10
    step = 10 if ceiling <= 80 else 20
    ax.set(xlim=(0, 76), ylim=(0, ceiling), xticks=[0, 12, 24, 36, 48, 60, 72],
           yticks=range(0, ceiling + 1, step), ylabel="Volume escavado (cm³)")
    ax.grid(axis="y", color="#cfd9d2", lw=0.7, alpha=0.6)
    ax.set_axisbelow(True)
    ax.spines[["top", "right"]].set_visible(False)
    for side in ["left", "bottom"]:
        ax.spines[side].set_color("#abbab0")
    ax.tick_params(length=0, labelcolor=INK, labelsize=10 if compact else 12)
    ax.set_facecolor(BG)
    if compact:
        ax.set_title(f"{workers} operárias", loc="left", color=INK,
                     fontsize=14, fontweight="bold", pad=9)
        ax.text(0.02, 0.86, f"Fadiga em 72 h: {number(fatigue[workers][-1])} cm³",
                transform=ax.transAxes, color=GREEN, fontsize=10)


def footer(fig, combined=False):
    lines = [
        ("5 seeds pareadas por grupo · médias do Viveiro · modelo exploratório", 10),
        ("±3 cm³: incerteza de digitalização, não intervalo de confiança.", 9.5),
        ("DP: desvio padrão publicado em 2005. Fontes: Fig. 2a (2001); Tabela 1 (2005).", 8.5),
    ]
    if combined:
        lines.insert(1, ("Cada painel tem sua própria escala vertical.", 9.5))
    for index, (text, size) in enumerate(lines):
        y = (0.073 - index * 0.018) if combined else (0.06 - index * 0.02)
        fig.text(0.11, y, text, color="#53655b", fontsize=size)


def save(fig, name):
    path = OUT / name
    fig.savefig(path, dpi=120, facecolor=BG, metadata={
        "Title": "Buhl × Viveiro — fadiga de escavação",
        "Description": "Séries e hashes em docs/validacoes/buhl-fadiga-comparacao-72h.json; não é ensaio novo.",
    })
    plt.close(fig)
    return path.relative_to(ROOT).as_posix()


def individual(group):
    workers = group["workers"]
    fig = plt.figure(figsize=(9, 11.25), facecolor=BG)
    fig.text(0.11, 0.96, "viveiro. / ANDAMENTO DA PESQUISA", fontsize=11,
             color=GREEN, fontweight="bold")
    fig.text(0.11, 0.91, f"{workers} operárias", fontsize=31, color=INK, fontweight="bold")
    fig.text(0.11, 0.875, "Como a fadiga muda a terra retirada", fontsize=17, color=INK)
    legend(fig, 0.84)
    ax = fig.add_axes([0.13, 0.345, 0.82, 0.395])
    panel(ax, group)
    ax.set_xlabel("Tempo simulado (horas)", fontsize=12, labelpad=10)
    fig.text(0.11, 0.245, "VIVEIRO · FADIGA DE ESCAVAÇÃO", fontsize=11, color=GREEN)
    fig.text(0.11, 0.204, f"{number(fatigue[workers][-1])} cm³",
             fontsize=31, color=GREEN, fontweight="bold")
    fig.text(0.56, 0.245, "BUHL 2005 · MÉDIA EM 72 H", fontsize=11, color=BLUE)
    fig.text(0.56, 0.204, f'{number(group["articleFinal72h"]["observedMeanCm3"])} cm³',
             fontsize=25, color=BLUE)
    fig.text(0.11, 0.15, f"Controle sem fadiga: {number(control[workers][-1])} cm³ em 72 h.",
             color=INK, fontsize=12)
    fig.text(0.11, 0.118, "Comparar a trajetória inteira continua necessário.",
             color=INK, fontsize=12)
    footer(fig)
    return save(fig, f"buhl-fadiga-{workers}-1080x1350.png")


def overview():
    fig = plt.figure(figsize=(9, 11.25), facecolor=BG)
    fig.text(0.11, 0.967, "viveiro. / ANDAMENTO DA PESQUISA", fontsize=10,
             color=GREEN, fontweight="bold")
    fig.text(0.11, 0.925, "A fadiga muda a escavação", fontsize=25, color=INK, fontweight="bold")
    fig.text(0.11, 0.895, "50, 100 e 200 operárias · curvas de 72 horas", fontsize=14, color=INK)
    legend(fig, 0.87, 10)
    for index, group in enumerate(groups):
        ax = fig.add_axes([0.13, 0.61 - index * 0.24, 0.82, 0.16])
        panel(ax, group, compact=True)
        if index == 2:
            ax.set_xlabel("Tempo simulado (horas)", labelpad=6, fontsize=11)
    footer(fig, combined=True)
    return save(fig, "buhl-fadiga-comparacao-1080x1350.png")


def main():
    OUT.mkdir(exist_ok=True)
    with plt.rc_context({"font.family": "DejaVu Sans", "font.size": 12,
                         "text.color": INK, "axes.labelcolor": INK}):
        files = [overview(), *(individual(group) for group in groups)]
    export = {
        "sourceRunCommit": receipt["runSourceCommit"],
        "sourceSeriesSha256Lf": {arm: receipt["arms"][arm]["publishedSeriesSha256Lf"] for arm in ["controle", "local"]},
        "renderer": "Matplotlib " + matplotlib.__version__,
        "pixels": [1080, 1350],
        "format": "PNG",
        "newModelRuns": False,
        "files": {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in files},
    }
    (ARCHIVE / "buhl-graficos-exportacao.json").write_text(
        json.dumps(export, indent=2, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n"
    )
    print(json.dumps({"pixels": [1080, 1350], "files": files}, ensure_ascii=False))


if __name__ == "__main__":
    main()
