# Fluxo por densidade num túnel (forma de Poissonnier et al. 2019)

O trânsito do Viveiro usa forças sociais adaptadas do modelo de pedestres de
Helbing e Molnár (`src/modules/navigation/social-forces.ts`). Em humanos, acima
de certa densidade o fluxo despenca e forma engarrafamento. Em formigas,
Poissonnier et al. mediram o contrário: o fluxo cresce com a densidade e depois
se estabiliza, sem engarrafar, porque as formigas ajustam a velocidade e evitam
contatos demorados.

- Poissonnier, L.-A.; Motsch, S.; Gautrais, J.; Buhl, J.; Dussutour, A.
  Experimental investigation of ant traffic under crowded conditions. _eLife_
  8:e48945 (2019). https://doi.org/10.7554/eLife.48945
- Aguilar, J. et al. Collective clog control: optimizing traffic flow in
  confined biological and robophysical excavation. _Science_ 361, 672 (2018).
  Em túneis estreitos, ociosidade e recuos evitam entupimento.

Este teste não usa os números do artigo, só a forma da curva.

## Rodar

```sh
npm run benchmark:fluxo -- --out ./fluxo.csv --seed FLUXO-1 \
  --groups 2,4,8,16,32,64,128,200 --ticks 700
```

Operárias começam divididas entre as duas câmaras nas pontas do túnel mais
longo entre câmaras e vão e voltam usando só o movimento de produção
(`moveInNest`: forças sociais, contato antenal, colisão, recuo e alargamento).
Tarefas, fome e o resto da colônia ficam desligados. Fluxo é o número de
chegadas às pontas por tick; densidade e velocidade são medidas nos 70% centrais
do túnel; os primeiros 100 ticks são descartados.

## Resultado na 0.41.0

| Operárias | Densidade (FLUXO-1) | Fluxo FLUXO-1 | Fluxo FLUXO-2 | Velocidade FLUXO-1 |
| --- | --- | --- | --- | --- |
| 2 | 0,18 | 0,007 | 0,005 | 0,047 |
| 8 | 0,72 | 0,025 | 0,018 | 0,049 |
| 32 | 2,71 | 0,095 | 0,073 | 0,046 |
| 128 | 8,71 | 0,225 | 0,177 | 0,045 |
| 200 | 6,36 | 0,070 | 0,117 | 0,042 |

Velocidade livre nominal: 0,087 por tick.

- **Dentro do túnel não há engarrafamento de tipo humano.** A velocidade fica
  quase igual de 2 a 200 operárias e o fluxo cresce com a densidade. Nesse
  trecho o Viveiro se parece mais com formigas do que com pedestres. A colisão
  permite sobreposição, então a densidade passa do que caberia fisicamente e o
  fluxo não chega a se estabilizar como em Poissonnier.
- **O entupimento acontece nas câmaras.** Com 200 operárias o fluxo cai (para
  31% do pico em FLUXO-1 e 66% em FLUXO-2) e a densidade no túnel diminui. Numa
  medição à parte, 53% das operárias estavam dentro das câmaras e 19% paradas
  lá, contra 13% e 1% com 64 operárias. Muitas sobem e descem pelas paredes da
  câmara sem chegar à boca do túnel.
- Mesmo sozinha, uma operária anda a cerca de metade da velocidade nominal.

## Ligação com a escavação

Na comparação com Buhl, quem carrega terra anda na mesma velocidade com 50 e
com 200 operárias (cerca de 0,05 por tick). A viagem até a saída dura o dobro
com 200 porque o caminho é cerca de duas vezes mais longo (mediana de 114 e 229
ticks). O aglomerado parado observado na tela é coerente com o entupimento nas
câmaras, não com o túnel.

Próximos passos possíveis, sem mudar regras ainda: medir como as operárias
saem de uma câmara lotada (distribuição pelas paredes, fila na boca do túnel) e
por que as rotas de quem carrega terra ficam mais longas no ninho maior.
