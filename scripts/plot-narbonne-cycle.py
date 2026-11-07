"""Render the frozen, paired Narbonne 3D series without rerunning the model."""
import csv
import hashlib
import io
import json
from pathlib import Path
from statistics import fmean

import matplotlib
matplotlib.use("Agg")
from matplotlib import pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "docs" / "validacoes"
text = (EVIDENCE / "narbonne-v2-series.csv").read_text(encoding="utf-8")
summary = json.loads((EVIDENCE / "narbonne-v2-comparacao.json").read_text(encoding="utf-8"))
assert hashlib.sha256(text.encode()).hexdigest() == summary["seriesSha256Lf"]
rows = list(csv.DictReader(io.StringIO(text)))
assert len(rows) == summary["sampleCount"]
days = sorted({int(row["day"]) for row in rows})
colors = {1: "#957244", 2: "#287169"}
labels = {1: "Narbonne v1 · anterior", 2: "Narbonne v2 · quatro ajustes"}
plt.rcParams.update({
    "font.family": "DejaVu Sans", "font.size": 10, "axes.spines.top": False,
    "axes.spines.right": False, "svg.hashsalt": "narbonne-v2",
})
fig, axes = plt.subplots(2, 2, figsize=(12, 8))
panels = [
    ("adults", "Formigas adultas", "Indivíduos, incluindo rainha"),
    ("brood", "Prole em desenvolvimento", "Ovos + larvas + pupas"),
    ("soilRemoved", "Solo escavado", "Volume do modelo (u³)"),
    ("food", "Alimento em estoque", "Unidades de alimento do modelo"),
]
for ax, (field, title, unit) in zip(axes.flat, panels):
    ax.axvspan(38, 74, color="#e5eddd", alpha=0.7, zorder=0)
    for version in [1, 2]:
        grouped = [
            [float(r[field]) for r in rows if int(r["profileVersion"]) == version and int(r["day"]) == day]
            for day in days
        ]
        assert all(len(group) == 3 for group in grouped)
        ax.fill_between(days, [min(g) for g in grouped], [max(g) for g in grouped],
                        color=colors[version], alpha=0.13, linewidth=0)
        ax.plot(days, [fmean(g) for g in grouped], color=colors[version],
                linewidth=2, label=labels[version])
    ax.set(title=title, ylabel=unit, xlabel="Dias do modelo", xlim=(0, 80))
    ax.set_ylim(bottom=0)
    ax.grid(axis="y", alpha=0.16)
handles, names = axes[0, 0].get_legend_handles_labels()
fig.suptitle("Narbonne: como as curvas mudaram", fontsize=20, x=0.07, ha="left", y=0.97)
fig.text(0.07, 0.92, "3 seeds pareadas · linha = média · faixa = mínimo–máximo, sem intervalo de confiança",
         fontsize=10, color="#43524a")
fig.legend(handles, names, loc="upper center", bbox_to_anchor=(0.5, 0.9), ncol=2, frameon=False)
fig.text(0.07, 0.045, "Fundo verde: janela de postura da v2 (dias 38–74). Ciclo comprimido de 80 dias do modelo.",
         fontsize=9, color="#43524a")
fig.text(0.07, 0.021, "Terrário 3D exploratório. Estes eixos não equivalem aos dias e cm³ do disco experimental de Buhl.",
         fontsize=9, color="#43524a")
fig.subplots_adjust(left=0.07, right=0.98, bottom=0.14, top=0.81, hspace=0.47, wspace=0.25)
(EVIDENCE / "figuras").mkdir(exist_ok=True)
fig.savefig(EVIDENCE / "figuras" / "narbonne-v2-curvas.svg",
            metadata={"Date": None, "Description": "Fonte e hashes em narbonne-v2-comparacao.json"})
fig.savefig(ROOT / ".runtime" / "narbonne-v2-curvas.png", dpi=160)
print("SVG e PNG gerados a partir da série arquivada e verificada.")
