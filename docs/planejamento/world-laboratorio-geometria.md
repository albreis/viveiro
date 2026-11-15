# K1-A — Geometria do laboratório no World

15/11/2026. Branch `codex/world-laboratorio-geometria`, dependente de G2-A.
O mantenedor escolheu World como alvo exclusivo; não substituir por arena 2D.

## Entrega

Preparação de um **World real**, com perfil Narbonne v3 e seus agentes,
campo de solo/apoio compartilhado e substrato inicial sem galerias. A consulta
do solo aceita o disco cilíndrico e o apoio considera piso, placa superior
finita e contenção radial. O observador exclui o ar exterior do disco, para
não criar uma falsa galeria periférica. Não há vegetação, predadores ou lago.

Coortes de 50/100/200 operárias adultas usam a fábrica existente, preservam
morfologia/genética e são colocadas sem sobreposição num anel externo à areia.
A distribuição inicial é uma hipótese computacional; não uma medida do artigo.
A geometria é opt-in; saves e as regras biológicas do terrário não migram.
O preparo não entra no seletor da interface nem é um save comum: pode ser
reconstruído de seu plano, mas o importador do terrário o recusa explicitamente.

## Dimensões, fonte e condições ausentes

O [artigo, Métodos](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0109436)
e a [versão publicada no repositório da universidade](https://digital.library.adelaide.edu.au/server/api/core/bitstreams/5342290d-7644-4477-9e97-13ed473da23b/content)
informam: raio da areia 100 mm, altura 5 mm, cobertura 250×250 mm e arena
com diâmetro 500 mm. O volume geométrico inicial é 157,08 cm³; não é volume
escavado. A aplicação de 25 ml de água não fornece a umidade retida por 72 h.

O plano de preparação fixa 24 °C, umidade do ar 80% e espessura da cobertura
1 mm como **hipóteses**, não condições medidas do experimento. A umidade do
solo não foi configurada: o zero no campo legado `landscape.wetness` é um
placeholder inativo neste preparo, que não pode avançar. Não converter esse
zero ou os 25 ml em uma reconstrução do estado hídrico.

A escala usa o comprimento nominal de 5 mm do perfil e os 0,445 de geometria
corporal já usados pelo motor: 11,235955 mm/unidade. É uma convenção explícita
de representação. Não modifica a distribuição de tamanhos para ajustar redes.
Os limites antigos da caixa não comportam essa arena; o campo geométrico já
aceita a arena maior, mas os limites da navegação ainda precisam ser adaptados.
A parede de Fluon exige uma regra de não escalada, além da contenção radial.

## Relógio: preparação não é simulação física

O relógio legado tem 100 ticks por dia (864 segundos biológicos por tick).
A normalização de marcha do perfil usa uma referência de 0,05 segundo por
passo. A razão 17.280 entre essas referências evidencia que não se pode
renomear ticks como segundos. Não significa uma medida de lentidão real.

Foram acrescentadas conversões dimensionais e probabilidade de evento por
taxa e duração, mas **esses auxiliares ainda não integram o relógio do World**.
`World.step()` e `World.advance()` recusam o preparo antes de alterar RNG,
age/tempo ou posições. Só remover essa trava após integrar relógios, limites,
contato/escavação e material, com testes de conservação e passo temporal.

O artigo define o zero temporal na estimação dos parâmetros depois que a
soma dos comprimentos de galerias atinge 100 mm. A correspondência exata desse
alinhamento com os quadros de Data S1 precisa ser verificada; não mudar o
plano G1 nem relabelar seus quadros. G3 deve declarar essa emenda explicitamente
antes da avaliação. Um cenário sem galerias é o estado antes do alinhamento.

## Reprodução

[Plano de preparação](../validacoes/world-laboratorio-geometria-plano.json).

```powershell
node scripts/prepare-world-laboratory.ts --plan docs/validacoes/world-laboratorio-geometria-plano.json --output .runtime/world-laboratorio-geometria
node scripts/qa/world-laboratory.mjs
```

Fonte limpa e pasta nova são exigidas. O CLI prepara coortes e exporta relatório,
centros dos agentes e SVGs; não roda ticks, mede erro empírico ou abre reserva.
Cada resultado declara `physicalDynamicsIntegrated: false` e
`physicalProtocolCompatible: false`. O CLI não tem um modo que contorne a trava.

## Critérios ainda abertos

K1-A entrega a geometria e os controles iniciais. K1 permanece aberto para
relógios, limites locais/Fluon, taxas e filas de ações, volume removido real,
transporte/massa, retomada e convergência de passo. G2-B continua aberto para
segmentação convergida e convenção comum. G3 só congela predições elegíveis
depois desses requisitos; G4 permanece fechado. Não há nova tag ou depósito.
