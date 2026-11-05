# Triagem de microclima e esforço na arena plana

A [arena de Buhl](buhl-variaveis.md) mantém o protocolo anterior ao omitir
as opções novas. A geometria plana permite separar o custo de andar, o
trabalho de retirada de areia e a recuperação individual. A hipótese
adicional no terrário 3D terá parâmetros próprios.

- Temperatura interpola as medianas de locomoção de 8, 11,4 e 15 mm/s a
  16, 25 e 30 °C do [experimento de Challet et al.](https://doi.org/10.1007/s00040-005-0821-1).
  O contraste de 25 a 30 °C não foi significativo no estudo. A interpolação
  é uma hipótese de locomoção fora das condições medidas.
- A água na areia é a massa de água dividida pela massa seca. Com secagem
  ativa, `w(t) = w₀ exp(−ln(2) t (1 − UR)(1 + 2u) / 28800)`.
  `UR` é umidade relativa e `u` é um índice de fluxo entre 0 e 1. O tempo
  de referência de 8 h é exploratório. Com secagem desligada, `w(t) = w₀`.
- O tempo da pelotização recebe o fator `1 + 0,5 |w − 0,08| / 0,08`.
  Trata-se de uma hipótese simétrica em torno de 8% de água. Os 25 mL
  borrifados por Buhl não determinam o teor inicial da areia.
- Na fadiga por ação, cada passo aceito de comprimento `s` acumula
  `0,05 × (s / 15,05) × (1 + f_carga)` segundos equivalentes de trabalho,
  com `s` em mm e a carga relativa à massa de referência do pellet. Cada
  tentativa concluída de escavação acumula os segundos gastos. O débito
  decai com a mesma meia-vida e reduz a prontidão para iniciar escavação,
  como na [regra anterior](buhl-fadiga.md).

## Plano fixado antes da execução

[Oito condições e três seeds novas](../validacoes/buhl-microclima-plano.json),
100 operárias, duas horas e amostras de 20 em 20 min. Cada condição é
pareada com e sem fadiga por ação. Os contrastes previstos são velocidade
pela temperatura, tempo de pelotização pela água e secagem pelo fluxo.
Com teor fixo, o fluxo deve preservar cada trajetória exatamente.
Os desfechos são massa removida, distância, segundos de escavação e
prontidão. O controle verifica conservação da massa em cada amostra.

```sh
node scripts/screen-buhl-microclimate.ts --plan docs/validacoes/buhl-microclima-plano.json --out .runtime/buhl-microclima-lote --jobs 4
```

A triagem testa os mecanismos internos em 48 rodadas simuladas. A
validação biológica de B7 requer séries independentes. A arena não
atribui arrasto ao corpo nem assume temperatura, umidade ou ventilação
medidas durante o experimento de Buhl.

## Resultados das duas horas

Médias de três réplicas simuladas por condição e braço. Massa seca retirada
em gramas e soma das horas de trabalho individual por rodada.

| Condição            | Massa sem fadiga | Massa com fadiga | Horas sem fadiga | Horas com fadiga |
| ------------------- | ---------------: | ---------------: | ---------------: | ---------------: |
| Referência, 25 °C   |            2,847 |            2,504 |           19,778 |           17,382 |
| 16 °C               |            2,213 |            2,032 |           15,389 |           14,107 |
| 30 °C               |            3,305 |            2,953 |           22,988 |           20,510 |
| Água fixa em 4%     |            2,636 |            2,461 |           22,947 |           21,431 |
| Água fixa em 12%    |            2,636 |            2,461 |           22,947 |           21,431 |
| Secagem sem fluxo   |            2,845 |            2,552 |           20,087 |           18,013 |
| Secagem com fluxo   |            2,834 |            2,579 |           20,619 |           18,748 |
| Fluxo com água fixa |            2,847 |            2,504 |           19,778 |           17,382 |

A massa e a distância subiram com a temperatura nos dois braços. Fixar
a água em 4% ou 12% aumentou o tempo de pelotização em 25% e produziu
a mesma massa nos dois níveis por construção. A secagem com fluxo levou
a água final de 7,53% para 6,67% em relação à secagem sem fluxo. A massa
mudou pouco e em sentidos diferentes nos dois braços. Com água fixa,
o fluxo preservou todas as trajetórias e telemetrias exatamente. O
balanço de massa fechou em todas as amostras.

[Série por seed e intervalo](../validacoes/buhl-microclima-2h.csv).
Fonte do modelo `efa393d`, fingerprint `996a363b3d4e586a7f250de07ba86c0b75dc883874ebeda2207d57bc42b788eb`, Node `v24.22.1`.
SHA-256 do CSV com LF `23ad0240d4bedeb3c095b248d94f8b11bc66abf88c494ee626077c13ae186216`.
