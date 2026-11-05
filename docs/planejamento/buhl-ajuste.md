# Ajuste exploratório e separação das amostras de Buhl

O ajuste usa somente o ponto de 12 h da curva digitalizada de 2001.
Os três grupos recebem o mesmo peso. O erro de um candidato é a média,
entre os grupos, da diferença absoluta entre a média simulada e a
referência, dividida pelo volume de referência de cada grupo. Em caso
de empate, usa-se a ordem registrada abaixo.

`contactAccess` é a fração de oportunidades de escavação em que uma
operária adjacente consegue acessar a face. É uma hipótese para a
representação de uma operária por célula. O fator multiplica a
probabilidade local calculada em cada decisão de escavação. A massa e
o tempo por pelota permanecem os do protocolo B3.

1. [Seguimento, acesso 0,35](../validacoes/buhl-ajuste-follow-035.json).
2. [Seguimento, acesso 0,60](../validacoes/buhl-ajuste-follow-060.json).
3. [Recrutamento, acesso 0,20](../validacoes/buhl-ajuste-recruit-020.json).

Cada candidato usa cinco seeds de desenvolvimento para cada grupo.
A configuração com menor erro segue para 72 h. O plano dessa execução
usa as [seeds reservadas](../validacoes/buhl-arena-particoes.json) e
mantém a configuração escolhida. O erro de 12 h é de ajuste. A curva
de 72 h em novas seeds examina a estabilidade e a extrapolação temporal
da simulação. Os pontos empíricos pertencem à mesma fonte e a
independência empírica continua pendente.

## Resultado da escolha

| Candidato | 50 operárias (cm³) | 100 operárias (cm³) | 200 operárias (cm³) | Erro relativo médio |
| --- | ---: | ---: | ---: | ---: |
| follow-035 | 6,11 | 11,18 | 19,77 | 10,0% |
| follow-060 | 8,40 | 15,73 | 27,30 | 52,6% |
| recruit-020 | 7,87 | 16,47 | 32,19 | 61,8% |

A referência em 12 h é 6, 10 e 17 cm³ para os três grupos. O candidato
selecionado foi `follow-035` com erro de 10,0%.
O [recibo](../validacoes/buhl-arena-escolha-12h.json) inclui as 45 medidas
finais, os hashes das séries e o critério. O [plano reservado](../validacoes/buhl-arena-reservado-plano.json)
registra a configuração antes da rodada de 72 h.

```sh
node scripts/select-buhl-arena.ts .runtime
```
