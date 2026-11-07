# Imagens das curvas de escavação

07/11/2026. Exportação das séries arquivadas de 72 horas, com cinco seeds
pareadas por grupo. Não são novas rodadas nem resultados do terrário 3D.
Os CSVs e os hashes continuam no [recibo original](../validacoes/buhl-fadiga-comparacao-72h.json).

A pedido do mantenedor, a fadiga apenas de escavação (`work-recovery`)
fica como referência principal para os próximos ensaios dessa arena.
O [plano explícito](../validacoes/buhl-fadiga-local-plano.json) é a configuração
a usar. O controle sem fadiga e a variante por ação continuam preservados.
Planos legados sem esse campo conservam seu significado. A preferência
operacional não altera os critérios científicos anteriores nem transforma
o ajuste em validado. A investigação do desvio de 50 operárias fica para
uma próxima etapa.

## Imagens de 1080 × 1350 pixels

- [Comparação dos três grupos](../validacoes/figuras/buhl-fadiga-comparacao-1080x1350.png).
- [50 operárias](../validacoes/figuras/buhl-fadiga-50-1080x1350.png).
- [100 operárias](../validacoes/figuras/buhl-fadiga-100-1080x1350.png).
- [200 operárias](../validacoes/figuras/buhl-fadiga-200-1080x1350.png).

As linhas do Viveiro são médias de cinco seeds. A curva de Buhl de 2001
é digitalizada, com faixa de leitura de ±3 cm³. O losango e a barra em
72 h representam a média ± desvio padrão publicada na tabela de 2005.
Esse desvio padrão descreve dispersão entre réplicas; não é intervalo
de confiança. Os dois trabalhos não são tratados como réplicas independentes.

Com 200 operárias, a média simulada de 64,46 cm³ fica próxima dos
65,27 cm³ da tabela de 2005, mas acima dos 59 ±3 cm³ lidos da curva de 2001.
Com 100 operárias, 36,15 cm³ cai na faixa de leitura de 34–40 cm³ em 72 h.
Com 50, 19,92 cm³ fica abaixo dos 22–28 cm³ da leitura em 72 h, embora
dentro da faixa descritiva de média ± desvio padrão da tabela de 2005.

Essa distinção explica por que proximidade no ponto final não encerra a
comparação das trajetórias. O MAE piorou para 50 operárias; os critérios
pré-especificados permanecem aquém do aceite. [Relatório completo](buhl-fadiga.md).

## Reprodução

Executar `python scripts/plot-buhl-fatigue-share.py` com Matplotlib.
O gerador reutiliza a leitura verificada das séries do gráfico original.
A exportação confere os SHA-256 e as médias antes de produzir os PNGs.
Nenhum parâmetro do motor ou resultado numérico é alterado.

[Recibo da exportação com SHA-256 dos PNGs](../validacoes/buhl-graficos-exportacao.json).
