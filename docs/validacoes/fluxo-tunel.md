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

## Os dois suspeitos testados

Medição na escavação (semente BUHL-2, grupo fixo, modo projetos, 8 dias), em
cada viagem de quem carrega terra até a saída:

| | 50 operárias | 200 operárias |
| --- | --- | --- |
| Duração da viagem (mediana, ticks) | 102 | 232 |
| Caminho pelos nós / menor caminho | 3,72 / 3,82 | 3,12 / 3,82 |
| Distância andada dentro de câmaras | 0,67 | 8,15 |
| Distância andada em túneis | 3,42 | 4,74 |
| Tempo dentro de câmaras | 18% | 47% |
| Na câmara, em desvio pela superfície (`supportMotion`) | 29% | 84% |

- **Rotas longas: descartado.** A sequência de túneis escolhida já é a mais
  curta. O caminho extra é andado dentro das câmaras.
- **Câmara lotada: confirmado.** Com 200 operárias há 40 a 48 ociosas por
  câmara, contra 7 a 10 com 50. Em 90% dos casos, quem está ao lado de uma
  carregadora em desvio é uma operária ociosa andando pela câmara. A
  carregadora contorna pelas paredes e anda 12 vezes mais dentro da câmara.

Contraprovas numa cópia descartável do código (não incluídas aqui):

- Proibir o desvio (aceitar só apoio perto da formiga) piorou: as carregadoras
  ficaram paradas 71% do tempo na câmara e a viagem subiu para 406 ticks. O
  desvio é a saída que elas encontram, não a causa.
- Fazer as ociosas darem passagem a quem carrega terra (a carregadora deixa de
  enxergá-las como obstáculo) baixou a viagem com 200 operárias de 232 para 97
  ticks, igual à de 50, e a distância na câmara de 8,15 para 0,78.

Mesmo com essa contraprova, na comparação com Buhl (5 sementes, 20 dias) as
frentes continuam cavando menos com 200 do que com 100 operárias (feromônio:
0,82 / 1,26 / 0,46; projetos: 0,33 / 0,30 / 0,18), e o alargamento por
trânsito com 200 continua alto (1,4 a 1,5). A viagem lenta explica parte do
problema, não todo. O alargamento só é feito por operárias sem carga paradas
num túnel, então o próximo suspeito são as ociosas paradas nos túneis e perto
das frentes.

## Terceiro suspeito: ociosas nos túneis e perto das frentes

Medição (BUHL-2, grupo fixo, 8 dias):

- O alargamento por trânsito é feito 100% por operárias ociosas, nos túneis
  principais entre câmaras e poços, não nas frentes.
- Perto de cada frente (menos de 1 unidade) há de 2 a 4 ociosas com 50
  operárias e de 17 a 24 com 200.
- No modo por feromônio, cada frente tem equipe de cerca de 6, mas a fração
  realmente cavando cai de 0,15 para 0,05 por frente com 200 operárias, e a
  volta da escavadora até a frente sobe de 36 para 170 ticks (mediana).

Contraprova na cópia descartável, comparação com Buhl (5 sementes, 20 dias,
grupo fixo), volume final 50 / 100 / 200:

| Variante | Modo | Só frentes | Trânsito | Escala total |
| --- | --- | --- | --- | --- |
| Código atual | feromônio | 0,98 / 1,10 / 0,50 | 0 / 0 / 1,22 | 0,40 |
| Ociosas dão passagem a quem trabalha com solo | feromônio | 1,01 / 1,59 / 1,51 | 0 / 0,03 / 0,83 | 0,60 |
| Idem, e ociosas não alargam túneis | feromônio | 1,01 / 1,52 / 1,67 | 0 / 0 / 0 | 0,36 |
| Ociosas dão passagem a quem trabalha com solo | projetos | 0,47 / 0,52 / 0,44 | 0 / 0,10 / 1,16 | 0,89 |
| Idem, e ociosas não alargam túneis | projetos | 0,47 / 0,52 / 0,50 | 0 / 0 / 0 | 0,05 |

- **Confirmado.** Com as ociosas abrindo passagem, as frentes deixam de
  render menos com 200 operárias. No modo por feromônio, sem o alargamento das
  ociosas, o volume das frentes passa a crescer com o grupo (1,01, 1,52, 1,67).
- A inclinação só das frentes (0,36) ainda fica abaixo da de Buhl (0,64), e a
  curva ainda não desacelera como a dele (saturação falha nos três grupos).
- No modo projetos as frentes ficam iguais em qualquer grupo, como esperado
  pelos limites fixos de 2 frentes e 2 operárias por frente.
- A escala de 0,60 na segunda linha passa no critério, mas vem em parte do
  alargamento por trânsito, então não conta como reprodução.

Próximo passo possível: transformar "ociosas dão passagem a quem trabalha com
solo" em regra opcional e reajustar o modo por feromônio separando sementes de
ajuste e de teste.

## Regra opcional: ociosas dão passagem (`--ociosas cedem`)

`src/modules/navigation/idle-yield.ts`, ligada por `nest.traffic.idleYield`
(salva com o ninho; mundos sem o campo seguem as regras originais). Com ela:

- uma operária ociosa que sente outra trabalhando (com tarefa de solo ou
  carga) a menos de 0,52 se afasta por 8 a 14 ticks, usando o mecanismo de
  ceder passagem que já existia para quem carrega;
- quem trabalha sente menos a pressão das ociosas (peso 0,25) e pode passar
  espremida por uma ociosa que está se afastando ou descansando;
- só quem tem tarefa de solo alarga túnel congestionado.

O padrão não muda: as séries de escavação são idênticas com a regra desligada
e a suíte tem a mesma única falha antiga da `main`.

Resultado (feromônio, grupo fixo, 5 sementes, 20 dias), volume das frentes
50 / 100 / 200:

| Variante | Só frentes | Trânsito com 200 | Escala total | Saturação |
| --- | --- | --- | --- | --- |
| Regras originais | 0,98 / 1,10 / 0,50 | 1,22 | 0,40 | falha |
| `--ociosas cedem` | 1,08 / 1,35 / 0,80 | 0,07 | −0,16 | falha |
| Contraprova: quem trabalha atravessa qualquer ociosa | 1,18 / 1,38 / 1,22 | 0,01 | 0,03 | passa |
| Contraprova: quem trabalha nem enxerga ociosas | 1,01 / 1,59 / 1,51 | 0,83 | 0,60 | falha |

Com a regra, a viagem de quem carrega terra com 200 operárias cai de 232 para
174 ticks e a distância andada na câmara de 8,15 para 1,06 (BUHL-2). O
alargamento por ociosas some. Mas com 200 operárias as frentes ainda rendem
menos que com 100, então a regra **não foi adotada como padrão** e a versão
não foi publicada. A forma realista de "abrir caminho" recupera só parte do
que as contraprovas idealizadas recuperam.
