# Buhl: critérios físicos antes do ajuste · B4

Este é um diagnóstico pré-especificado. Só se aplica à arena física de B3
(disco de 200 mm, 5 mm de espessura, arena de 500 mm). Não converte ou
reclassifica o benchmark histórico rt24b. Nenhum dado de uma arena nova
foi produzido para este diagnóstico.

## O que comparar

- **Curva e saturação.** Compare as médias de cada grupo nas mesmas 12,
  24, 36, 48, 60 e 72 horas físicas. Use a curva lida da Figura 2a do
  [relatório de 2001](../validacoes/buhl-2005.md), com faixa bilateral de
  leitura de ±3 cm³. Calcule MAE, fração de pontos dentro da faixa e o
  volume relativo ao final em 24 h e 48 h. Um resultado muito adiantado
  ou atrasado fica fora da faixa mesmo que o valor final coincida.
  A tolerância representa leitura da figura; não cobre variabilidade
  entre colônias nem é um intervalo de confiança.
- **Escala entre grupos.** Calcule a inclinação log-log do volume final
  médio para 50, 100 e 200 operárias. Se algum grupo não escavou, não
  calcule a inclinação descartando esse grupo. O intervalo de referência
  usa os oito extremos da faixa de leitura dos três volumes de 72 h.
  Não use o expoente do artigo que agrupa os dois protocolos de densidade.
- **Valores finais publicados.** Mostre em separado as médias, desvios
  padrão e N da Tabela 1 de [Buhl et al. (2005)](https://doi.org/10.1007/s00265-004-0906-2)
  para disco fixo. Média ± desvio padrão é uma faixa descritiva. Não
  trate os valores de 2005 como réplicas independentes dos de 2001.
- **Replicação.** Exija cinco ou mais seeds distintas por grupo; preserve
  a lista e a fonte de todas as rodadas. Separar seeds do simulador não
  reserva observações reais. A validação B7/B8 ainda precisa de dados
  empíricos reservados, incerteza amostral e avaliação dos mecanismos.

## Contrato para o runner de B3

O comando `node scripts/assess-buhl-arena.ts SERIE.json` lê um lote no schema
`viveiro-buhl-arena-series-v1`, protocolo `disco-fixo-2005`, com:

- `geometryMm`: `arenaDiameter: 500`, `sandDiameter: 200`,
  `sandThickness: 5`.
- `timeUnit: "s"`, `volumeUnit: "cm3"`, `secondsPerTick` positivo e
  `sourceFingerprint` SHA-256 da fonte.
- `runs`: um objeto por seed/grupo com `seed`, `workers` e `samples` em ordem.
  Cada ponto tem `timeSeconds` inteiro e `voidVolumeCm3` não negativo,
  medido no disco em relação ao estado inicial. Os sete tempos de comparação
  de 0 a 72 h precisam existir. O verificador não extrapola pontos ausentes.

O relatório mantém diferenças desfavoráveis e não retorna erro por elas.
Entrada inválida ou série incompleta retorna erro. O schema documenta unidades,
mas não prova que o runner mediu corretamente o vazio. Essa equivalência, a
geração da arena e a aplicação do critério a rodadas reais continuam abertas.
