# Lotes retomáveis e triagem da arena de Buhl

A referência usa [15 rodadas fixadas](../validacoes/buhl-arena-base-plano.json).
Cada seed é aplicada a 50, 100 e 200 operárias por 72 h, com amostras a cada
20 minutos. A densidade seca de 1,5 mg/mm³ e o espaçamento inicial de 5 mm
são hipóteses do plano. A comparação usa o diagnóstico bilateral de B4.

```sh
node scripts/sweep-buhl-arena.ts --plan docs/validacoes/buhl-arena-base-plano.json --out .runtime/buhl-arena-base-72h --jobs 4
node scripts/assess-buhl-arena.ts .runtime/buhl-arena-base-72h/series.json
```

Acrescente `--resume` para retomar na mesma pasta e com o mesmo plano, fonte
do modelo e versão do Node. `--limit N` restringe quantas rodadas novas
serão feitas naquele comando. Cada rodada concluída ganha um arquivo
imutável com hash vinculado ao plano. `plano.json` lista as combinações
previstas e a origem. O arquivo `series.json` aparece ao fechar o lote.
Workers independentes podem terminar em ordens diferentes. A exportação
segue a ordem do plano. A trava impede dois executores na mesma pasta.

## Triagem de sensibilidade

```sh
node scripts/sensitivity-buhl-arena.ts --plan docs/validacoes/buhl-arena-morris-plano.json --out .runtime/buhl-arena-morris --jobs 4
```

O [plano Morris](../validacoes/buhl-arena-morris-plano.json) usa quatro
trajetórias de quatro níveis, duas réplicas pareadas por ponto e 100
operárias. O ensaio de seis horas tria densidade seca, taxa de início de
escavação e chance de pegar uma pelota por contato. As faixas são hipóteses
de triagem e ficam no desenho exportado. O relatório conserva os efeitos
assinados, μ*, σ, o volume aberto, o volume equivalente retirado e o total
de pelotas. As seeds da triagem têm prefixo próprio.

A retomada vale também para Morris. As rodadas de seis horas orientam a
seleção de mecanismos e parâmetros. A referência de 72 h mede a curva
coletiva no horizonte do estudo.
