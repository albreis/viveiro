"""Draw the archived, paired Buhl fatigue comparison as three SVG figures."""
import csv
import hashlib
import io
import json
import math
from collections import defaultdict
from pathlib import Path
from statistics import fmean

import matplotlib

matplotlib.use("Agg")
from matplotlib import pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "docs" / "validacoes"
FIGURES = EVIDENCE / "figuras"
SECONDS = tuple(range(0, 72 * 3600 + 1, 20 * 60))


def mean_curves(arm, summary):
    path = EVIDENCE / f"buhl-fadiga-{arm}-72h.csv"
    text = path.read_text(encoding="utf-8")
    checksum = hashlib.sha256(text.encode("utf-8")).hexdigest()
    if checksum != summary["publishedSeriesSha256Lf"]:
        raise ValueError(f"Série arquivada divergente: {path.name}")
    runs = defaultdict(dict)
    for row in csv.DictReader(io.StringIO(text)):
        key = (int(row["workers"]), row["seed"])
        runs[key][int(row["timeSeconds"])] = float(row["voidVolumeCm3"])

    curves = {}
    for group in summary["groups"]:
        workers = group["workers"]
        samples = [runs[workers, seed] for seed in group["replicateSeeds"]]
        if any(tuple(run) != SECONDS for run in samples):
            raise ValueError(f"Amostras ausentes ou fora de ordem: {arm}/{workers}")
        mean = [fmean(run[t] for run in samples) for t in SECONDS]
        for point in group["curve"]:
            index = SECONDS.index(point["hour"] * 3600)
            if not math.isclose(mean[index], point["simulatedMeanCm3"], abs_tol=1e-10):
                raise ValueError(f"Média divergente do relatório: {arm}/{workers}")
        curves[workers] = mean
    return curves


def draw(group, control, fatigue):
    workers = group["workers"]
    points = group["curve"]
    hours = [t / 3600 for t in SECONDS]
    reference_hours = [p["hour"] for p in points]
    reference = [p["readCm3"] for p in points]
    lower, upper = zip(*(p["bandCm3"] for p in points))
    fig, ax = plt.subplots(figsize=(7.4, 4.0), layout=None)
    fig.subplots_adjust(left=0.12, right=0.97, bottom=0.15, top=0.74)
    fig.suptitle(f"{workers} operárias", x=0.12, y=0.97, ha="left",
                 fontsize=17, fontweight="bold", color="#172a28")
    band = ax.fill_between(reference_hours, lower, upper, color="#f2e6c5",
                           label="Faixa de leitura (±3 cm³)", zorder=1)
    observed, = ax.plot(reference_hours, reference, ":o", color="#684517",
                        linewidth=1.6, markersize=5, label="Buhl et al. (2001)",
                        clip_on=False, zorder=4)
    before, = ax.plot(hours, control, "--", color="#594b83", linewidth=2.1,
                      label="Viveiro sem fadiga", zorder=2)
    after, = ax.plot(hours, fatigue, "-", color="#00736a", linewidth=2.3,
                     label="Viveiro com fadiga", zorder=3)
    fig.legend(handles=[observed, band, before, after], ncols=2, frameon=False,
               loc="upper left", bbox_to_anchor=(0.112, 0.91),
               handlelength=2.8, columnspacing=2.1)

    ymax = max(max(control), max(fatigue), max(upper))
    ystep = 10 if ymax <= 80 else 20
    ceiling = math.ceil(ymax * 1.07 / ystep) * ystep
    ax.set(xlim=(0, 72), ylim=(0, ceiling), xticks=reference_hours,
           yticks=range(0, ceiling + 1, ystep), xlabel="Tempo (h)",
           ylabel="Volume escavado (cm³)")
    ax.set_axisbelow(True)
    ax.grid(axis="y", color="#d9e2df", linewidth=0.8)
    ax.tick_params(length=0, pad=7, labelcolor="#3b504b")
    ax.spines[["top", "right"]].set_visible(False)
    for side in ("bottom", "left"):
        ax.spines[side].set_color("#9eb3aa")

    output = io.StringIO()
    fig.savefig(
        output,
        format="svg",
        metadata={
            "Date": None,
            "Title": f"Volume escavado em 72 horas — {workers} operárias",
            "Description": (
                "Curva aproximada de Buhl et al. (2001) e médias das cinco seeds "
                "pareadas do Viveiro, sem e com fadiga. A faixa de leitura "
                "de ±3 cm³ pertence à digitalização dos pontos observados."
            ),
        },
    )
    svg = "\n".join(line.rstrip() for line in output.getvalue().splitlines())
    (FIGURES / f"buhl-fadiga-{workers}.svg").write_text(
        svg + "\n", encoding="utf-8", newline="\n"
    )
    plt.close(fig)


def main():
    receipt = json.loads(
        (EVIDENCE / "buhl-fadiga-comparacao-72h.json").read_text(encoding="utf-8")
    )
    control = mean_curves("controle", receipt["arms"]["controle"])
    fatigue = mean_curves("local", receipt["arms"]["local"])
    FIGURES.mkdir(parents=True, exist_ok=True)
    with plt.rc_context({
        "font.family": "DejaVu Sans",
        "font.size": 11,
        "svg.hashsalt": "viveiro-buhl-fadiga",
        "svg.fonttype": "path",
    }):
        for group in receipt["arms"]["controle"]["groups"]:
            workers = group["workers"]
            draw(group, control[workers], fatigue[workers])


if __name__ == "__main__":
    main()
