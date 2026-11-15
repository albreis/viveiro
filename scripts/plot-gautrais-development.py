"""Observed development replicas only; never read raw or reserved graphs."""
import argparse
import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

parser = argparse.ArgumentParser()
parser.add_argument("report", type=Path)
parser.add_argument("output", type=Path)
args = parser.parse_args()
data = json.loads(args.report.read_text(encoding="utf-8"))
assert data["schema"] == "viveiro-gautrais-development-v1"
assert data["partition"] == "development"
assert data["integrity"]["reservedMetricsComputed"] is False
assert all(int(r["id"][-2:]) % 2 for r in data["replicas"])
assert not args.output.exists(), "A figura existente não será substituída"
fig, axes = plt.subplots(1, 3, figsize=(12, 5), layout="constrained")
colors = ["#758b4c", "#278379", "#344c63"]
for ax, (metric, title) in zip(axes, [("nodes", "Nós"), ("edges", "Túneis / arestas"), ("cycleRank", "Ciclos independentes")]):
    for i, group in enumerate(data["groups"]):
        values = [r["final"][metric] for r in data["replicas"] if r["workers"] == group["workers"]]
        n = len(values)
        offsets = [0.0] if n == 1 else [(j / (n-1) - 0.5) * 0.24 for j in range(n)]
        ax.scatter([i + x for x in offsets], values, color=colors[i], alpha=0.55, s=28)
        summary = next(s for s in group["final"] if s["metric"] == metric)
        ax.errorbar(i, summary["mean"], yerr=summary["sampleSD"], fmt="D", color=colors[i], capsize=5)
    ax.set(title=title, xticks=[0, 1, 2], xticklabels=["50 (n=3)", "100 (n=3)", "200 (n=9)"], xlabel="Operárias por réplica")
    ax.set_ylim(bottom=0)
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="y", alpha=0.16)
    ax.set_axisbelow(True)
fig.suptitle("Gautrais 2014 · observações de desenvolvimento", fontsize=16)
fig.supxlabel("Pontos: réplicas ímpares. Losangos: média ± DP amostral. Grafos finais; sem saídas do simulador.\nReserva par fechada · auditoria anterior conhecida · não é validação independente", fontsize=9)
fig.set_facecolor("#f6f7ef")
args.output.parent.mkdir(parents=True, exist_ok=True)
fig.savefig(args.output, dpi=160, facecolor=fig.get_facecolor())
plt.close(fig)
