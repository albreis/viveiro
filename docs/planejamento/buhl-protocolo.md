# Buhl: bases para um protocolo físico separado

Protocolo físico de B3. A execução rt24b verifica reprodutibilidade do cenário
histórico do Viveiro. A comparação com formigas observadas exige um segundo
protocolo, com relógio, geometria e medições próprios.

## Referência de laboratório

O artigo de 2005 descreve areia úmida em disco de 20 cm de diâmetro e 5 mm
de espessura, sob vidro. As operárias começam dispersas ao redor do disco.
A série coletiva dura 72 horas e foi medida em intervalos de 20 minutos.
Na condição de densidade crescente, a Tabela 1 apresenta:

| Operárias | Média final (cm³) | Desvio padrão (cm³) | Réplicas |
| --- | ---: | ---: | ---: |
| 50 | 25,35 | 11,0 | 5 |
| 100 | 37,15 | 9,2 | 5 |
| 200 | 65,27 | 22,4 | 10 |

O runner histórico usa médias e curvas transcritas do relatório preliminar de
2001. Os valores de 2005 formam uma referência separada. A curva digitalizada
de 2001 tem erro de leitura estimado em aproximadamente ±3 cm³. Desvio padrão
entre réplicas, erro de leitura e intervalo de confiança são grandezas
diferentes. As trajetórias individuais continuam indisponíveis no repositório.
O expoente 0,820 do artigo agrupa as duas condições de densidade e não é o
expoente calculado apenas com os três grupos de disco fixo.

Fontes: [artigo de 2005](https://link.springer.com/article/10.1007/s00265-004-0906-2),
[métodos e tabelas na cópia disponibilizada por um dos autores](https://www.researchgate.net/publication/226870738_Self-organized_digging_activity_in_ant_colonies)
e [registro do conjunto de 2001](../validacoes/buhl-2005.md).

## Fixar as unidades antes de ajustar a escavação

- **Comprimento e geometria.** Declarar a escala em mm por unidade do modelo
  antes da rodada. Usar a geometria medida da arena, com espessura explícita e
  condições iniciais na superfície, para criar um cenário de laboratório
  separado do terrário 3D que já começa com galerias. Em uma representação
  plana, converter a área nova em volume pela espessura de 5 mm. Em uma
  representação volumétrica da mesma arena, medir o vazio novo e aplicar a
  escala ao cubo. Conferir conservação de material e separar o volume retirado
  por frentes daquele removido pelo trânsito.
- **Tempo.** Manter o relógio do laboratório separado da convenção do terrário
  de 100 ticks por dia. Estimar segundos por tick pela velocidade em
  deslocamento livre, depois de fixar a escala geométrica. Se o modelo medir
  velocidade em unidades por tick, multiplicar por mm/unidade e dividir pela
  velocidade observada em mm/s. O segundo por tick do rt24b é uma convenção
  legada. O ciclo de 0,05 s descrito no artigo vale para a grade dos autores.
- **Âncoras individuais.** O artigo reporta 15,05 mm/s em movimento livre
  (DP 4,38; N=100) e 42,04 s para escavar uma pelota (DP 24,79; N=65). A
  segunda medida só pode ser comparada depois de instrumentar um evento
  equivalente no Viveiro. Uma mordida ou um trecho de túnel não representa
  automaticamente uma pelota. Taxas por segundo e por contato também precisam
  de conversões diferentes. Os parâmetros de feromônio da Tabela 2 incluem
  estimativas do modelo publicado; tratá-los como hipóteses quando usados.
- **Aceite.** Gravar a geometria, as condições de início, a escala, o relógio
  e as sementes no plano. Confrontar séries em tempos físicos iguais.
  Comparar 24 h apenas com 24 h, e reservar a comparação de volume final
  do artigo para 72 h. Reportar MAE, incerteza e discrepâncias antes de ajustar
  parâmetros. Acordo entre duas execuções do Viveiro mede reprodutibilidade.

B4 deve fixar limites antes de usar a curva coletiva para ajuste. Dados brutos
por réplica e replicação externa seguem como dependências de validação.

## Ensaio de caminhada livre do Viveiro

Na raiz do repositório, rode:

```sh
node scripts/measure-buhl-motion.ts
```

O ensaio chama o movimento de superfície usado no Viveiro. Cria 64 operárias
da seed `BUHL-FREE-1`, mede cada uma isoladamente em piso plano, sem carga,
vizinhas ou obstáculos, e mantém a direção fixa. Descarta oito ticks de
aceleração e mede o caminho percorrido nos 24 seguintes. A
[saída de referência](../validacoes/buhl-deslocamento-livre.json) guarda as
velocidades individuais em unidades do modelo por tick, o resumo e a
identidade da fonte. As 64 operárias são geradas pelo simulador; o N = 100
do artigo pertence à observação real, que foi feita fora do disco.

A opção `--mm-por-unidade N` calcula um **intervalo candidato** em segundos
por tick, usando a escala geométrica fornecida e a velocidade média real.
Sem uma escala fornecida, o campo de segundos por tick fica vazio. Esse
ensaio não escolhe o tamanho físico da arena nem verifica como uma operária
se move em contato com areia, paredes, outras operárias ou carga. Também não
estabelece equivalência entre mordida, pelota e volume de vazio. Esses
passos são tratados pelo runner experimental da arena.

## Geometria inicial da arena

O módulo da arena representa o círculo externo de 500 mm, o disco intacto
de 200 mm e a espessura de 5 mm. A grade usa células de 0,8 mm por padrão,
a resolução numérica do modelo dos autores, não uma granulometria observada.
Uma célula aberta adiciona sua área vezes a espessura ao volume novo.
Somente uma célula sólida vizinha por lado do piso ou da galeria pode abrir.
A contagem de células preserva o saldo de areia sólida e vazio medido.

O dispersor inicial usa a seed no anel externo e verifica uma separação
mínima informada em mm. Ele usa um fluxo aleatório separado para preservar
a sequência das futuras decisões dos agentes. A separação precisa ser
justificada pelo perfil físico escolhido; o valor de teste não é um dado
de campo. A geometria foi testada sem plantas, ninho pronto ou rainha.

O runner usa essa geometria para medir a abertura de células e o transporte
de pelotas, conforme o plano abaixo.

## Rodar a arena com operárias

O relógio da arena avança em segundos físicos. A malha padrão usa passo de
0,8 mm e tick de 50 ms. Em espaço livre, a chance de andar uma célula por
tick dá a velocidade média alvo de 15,05 mm/s. A direção persiste, com
desvios e bloqueios de ocupação. A decisão de escavar depende da areia na
célula frontal. A taxa por segundo vira probabilidade por tick pela
expressão `1 - exp(-taxa × segundosPorTick)`. A coleta de depósitos usa
a probabilidade por contato ao entrar numa célula com solo depositado.

Para reproduzir um ensaio de 20 minutos, salve o plano em um arquivo JSON:

```json
{
  "seed": "ARENA-BASE-1",
  "workers": 50,
  "durationSeconds": 1200,
  "separationMm": 5,
  "dryDensityMgPerMm3": 1.5
}
```

```sh
node scripts/run-buhl-arena.ts plano.json > serie.json
```

A densidade e a separação inicial são hipóteses explícitas do plano. A
massa de uma célula vem da densidade seca e da geometria. Uma operação
completa retira 1,69 mg em 42,04 s, arredondados para o próximo tick.
Quando resta menos massa na célula, o tempo é proporcional e a carga
conta como fragmento. A célula abre só após perder toda a massa. A série
registra vazio aberto, massa removida, massa em trânsito e em depósito,
pelotas, fragmentos e número de coletas e descargas. A soma transportada
e depositada conserva a massa retirada. O alargamento por trânsito
aparece separado com zero, pois esta versão atribui abertura à escavação.

A versão inicial usa quatro direções, uma duração fixa por unidade de
massa e movimento local sem feromônio. Serve de controle exploratório
para medir onde o protocolo diverge das curvas observadas. O manifesto registra o identificador da regra, os tempos e as unidades. O diagnóstico
B4 exige cinco seeds por grupo, até a amostra final de 72 horas.
