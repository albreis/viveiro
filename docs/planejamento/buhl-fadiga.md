# Buhl — hipótese de fadiga na escavação

Protocolo fixado antes de executar a comparação. Buhl et al. discutem a
exaustão individual como possível explicação para a atividade residual
menor no laboratório. O estudo não fornece uma medida da resposta ao
esforço ou da recuperação. [Discussão de Buhl et al. (2005)](https://doi.org/10.1007/s00265-004-0906-2).

## Regra e controle

Cada operária mantém uma dívida de esforço `W`, em segundos. A dívida
diminui exponencialmente entre registros de trabalho, com meia-vida
de 24 h simuladas. Ao terminar uma tentativa, a operária soma o tempo
que passou cavando, inclusive se outra operária já removeu o material.
A próxima decisão local de cavar é aceita com probabilidade
`1 / (1 + W / 3600)` depois da decisão usual de contato. Uma hora de
dívida reduz essa probabilidade à metade. Os dois valores são
hipóteses exploratórias e foram fixados antes do lote. O esforço
altera a decisão de iniciar. Relógio físico, massa por pelota, tempo
por tentativa, movimento e transporte mantêm os parâmetros do controle.

A regra usa somente o histórico da própria operária. Não há meta de
volume, contagem do grupo, hora programada de parada ou dados
observados dentro do agente. A variante tem uma sequência aleatória
separada para a decisão adicional. O controle conserva a sequência
anterior. O pareamento fixa a seed e a posição inicial. Trajetórias
podem divergir após a primeira decisão diferente.

- [Controle, seguimento com acesso 0,35](../validacoes/buhl-fadiga-controle-plano.json).
- [Variante, seguimento com fadiga local](../validacoes/buhl-fadiga-local-plano.json).

São cinco seeds inéditas de desenvolvimento por grupo e por variante,
para 50, 100 e 200 operárias durante 72 h. Cada rodada tem amostras
a cada 20 minutos e é gravada ao terminar. As partições anteriores
permanecem arquivadas. A curva digitalizada usada na comparação
faz parte da referência de desenvolvimento. A validação em réplicas
empíricas independentes segue pendente.

## Comparação prevista

- Comparar o erro absoluto médio nas 12, 24, 36, 48, 60 e 72 h e a
  cobertura na faixa de leitura de ±3 cm³ por grupo. Relatar também
  os volumes de 72 h frente à tabela de 2005 e a inclinação log-log.
- Medir separadamente o erro no volume de 12 h e a taxa média de
  escavação de 48 a 72 h. Relatar diferenças pareadas por seed.
- Considerar a variante promissora para nova avaliação somente se
  reduzir o MAE nos três grupos, deixar as três médias de 12 h na
  faixa de leitura e aproximar a taxa tardia em pelo menos dois grupos.
  Preservar resultados desfavoráveis mesmo se algum indicador melhorar.
- Verificar a conservação de massa e de células e a abertura zero por
  trânsito em todas as amostras. A concordância numérica de um lote
  não encerra P3.2 ou P3.3.

## Reprodução

```sh
node scripts/sweep-buhl-arena.ts --plan docs/validacoes/buhl-fadiga-controle-plano.json --out .runtime/buhl-fadiga-controle --jobs 6
node scripts/sweep-buhl-arena.ts --plan docs/validacoes/buhl-fadiga-local-plano.json --out .runtime/buhl-fadiga-local --jobs 6
node scripts/assess-buhl-arena.ts .runtime/buhl-fadiga-controle/series.json
node scripts/assess-buhl-arena.ts .runtime/buhl-fadiga-local/series.json
```
