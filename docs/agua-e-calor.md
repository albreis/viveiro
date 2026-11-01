# Água e calor no entorno do solo — etapa 7B1

Campo espacial exploratório, compartilhado pelo habitat. Não transforma a umidade relativa do ar em teor de água nem converte o slider de luz diretamente em temperatura medida. A temperatura do ar tem controle independente. A etapa não é um solver calibrado de Richards ou um modelo termodinâmico completo.

## Grade e estado

São 20 x 8 x 13 amostras sob o relevo procedural: 2.080 células, com profundidade total de 4,2 unidades do cenário. Cada coluna acompanha a altura superficial; y cresce em profundidade. Porosidade de referência é 0,4 e a capacidade de água por célula é volume geométrico x porosidade. Água/capacidade é a fração dos poros ocupada por água, não umidade relativa do ar e nem água/volume total do solo.

A grade representa o entorno poroso em escala maior que os detalhes das galerias. Células não são removidas conforme cada túnel é escavado; o valor dentro de uma galeria é uma amostra da matriz vizinha. Não desenha água líquida enchendo câmaras, pressão de poros ou inundação. Esse acoplamento geométrico e o modelo estrutural permanecem para 7C.

A inicialização tem RNG separado pela seed. Perfis iniciais ilustrativos: bosque 55%, pradaria 43%, vegetação árida 23%, com pequena heterogeneidade e acréscimo em profundidade. A opção de construção soilWaterInitial pode fornecer outro perfil inicial. Nenhum desses valores vem do slider de umidade do ar. A temperatura inicial usa a referência do ar com um gradiente exploratório de até dois graus em profundidade. Saves existentes ganham o campo na primeira atualização, sem reconstruir plantas, túneis ou agentes.

## Fluxos conservativos

Pares de células adjacentes trocam água. O fluxo reduzido combina diferença de saturação e desnível gravitacional:

q_ij = capacidade * dt * [0,0015*(s_i-s_j) + 0,00015*s_médio²*(altura_i-altura_j)/distância].

A direção define doadora/receptora; o valor é limitado pela água disponível e pelo espaço livre. Redistribuição pode umedecer uma camada seca acima de outra molhada, enquanto a gravidade favorece drenagem para baixo. Não há curva de retenção, sucção calibrada ou histerese: diferença de saturação aproxima uma tendência capilar, não reproduz a equação completa de Richards.

O calor difunde conforme diferença de temperatura, distância e um coeficiente que aumenta com o conteúdo de água. Cada célula tem capacidade térmica de referência constante. Fluxos térmicos são opostos e conservam um conteúdo proporcional à soma das temperaturas em um sistema fechado; não são joules medidos. Não há calor advectado pela água, calor latente de mudança de fase ou variação de capacidade térmica com a água.

O campo é integrado uma vez a cada dez ticks globais, com subpassos de no máximo dois ticks. As colônias filhas usam a mesma referência. Testes também pedem um passo grande e verificam finitude, limites e conservação. Os coeficientes usam unidades de espaço/tempo do motor; falta escala física calibrada.

## Fontes e saídas

- Chuva entra nas células superficiais a partir do pulso do ambiente e é contabilizada como entrada externa.
- Lagos cedem água a uma célula próxima: o mesmo valor sai do reservatório normalizado do lago. A conversão exploratória é dez unidades do campo por unidade do lago, sem pretensão de volume real.
- Evaporação superficial depende da umidade relativa do ar e da luz. A água perdida é registrada.
- Plantas retiram uma pequena quantidade do entorno das raízes; o orçamento registra captação/transpiração, sem um reservatório hídrico vegetal detalhado.
- A superfície troca calor gradualmente com a referência do ar e recebe uma contribuição solar periódica exploratória. Esta usa a fase do dia, luz e um ganho de até oito graus no alvo superficial, não uma conversão termométrica universal.
- Evaporação resfria levemente a célula por um coeficiente exploratório, também registrado.

Balanço de água: inicial + chuva + lago = presente + evaporada + retirada pelas plantas. Balanço térmico de referência: inicial + fronteira - resfriamento = presente. O modelo de lagos herdado ainda usa fontes atmosféricas simplificadas; o orçamento acima é do campo poroso e contabiliza a transferência recebida. Não é um balanço hídrico fechado de toda a atmosfera do terrário.

## Respostas e observação

Plantas usam água e temperatura próximas para hidratação, estresse, saúde, crescimento e rendimento. Madeira e pedras usam a água local para sua umidade. Preferências vegetais continuam exploratórias; a referência térmica de crescimento não é uma calibração por espécie. Água de raízes e temperatura são amostradas em profundidade representativa simples, sem raízes individuais.

A formiga selecionada mostra temperatura e água no entorno de sua posição. Essas leituras são do ambiente poroso vizinho; não afirmam medir a umidade do ar dentro da galeria. A IA de transporte da prole, a incubação por espécie, diapausa e a cronologia biológica recebida pelo usuário não foram recalibradas nesta etapa. Permanecem nas etapas futuras correspondentes.

O painel mostra mínimos e máximos espaciais, chuva infiltrada e evaporação acumuladas. O corte central alterna entre água e temperatura, com superfície acima e fundo abaixo. Cores têm escala fixa; temperaturas fora da faixa da legenda saturam na cor extrema. O controle do ar usa 5–45 °C nesta versão, sem congelamento. Alterar a referência não reescreve a temperatura já armazenada no solo.

## Arquitetura

microclimate separa tipos/estado, indexação e amostragem, inicialização, transporte fechado, fronteiras e atualização global. climate-map desenha o corte; climate-status integra controle e painel. O modelo não importa DOM ou Three.js. Snapshots guardam arrays e balanços; restore recompõe o compartilhamento entre colônias. A grade e seus pares em cache não viram conhecimento global dos agentes.

## Verificação e limitações

Testes cobrem seed sem consumo do RNG das formigas; independência inicial entre água e umidade do ar; conservação fechada de água/calor; estabilidade para passo grande; redistribuição para cima e drenagem; fontes/saídas; respostas vegetais locais; duas colônias com uma única atualização; intervenções e restore com futuro idêntico. Há verificação dos balanços acumulados na integração.

No navegador, a seed a foi mantida. O campo começou com 53,8–63,2% nos poros e 22,3–24 °C. Após mudar o ar para 35 °C, o solo continuou temporariamente em 22,6–24,6 °C. Chuva foi aplicada no dia 176,7. No dia 219,1, o campo mostrava 47,5–68,9%, 28–34,1 °C, cerca de 0,8 unidade infiltrada e 4,1 evaporadas. São resultados de uma execução do modelo, não medidas de laboratório.

Faltam calibração por solo/espécie, propriedades hidrotérmicas medidas, retenção e condutividade não saturada, fluxo de água em galerias, advecção térmica, mudanças de fase e clima sazonal validado. A erosão e a perda de estoques herdadas ainda usam heurísticas globais; o acoplamento local é pendência explícita de 7B2/7C. Gases e ventilação não estão nesta entrega.

## Referência primária

[Richards, 1931 — Capillary conduction of liquids through porous mediums](https://doi.org/10.1063/1.1745010) fundamenta o papel dos gradientes de potencial capilar e gravidade no meio não saturado. A fórmula reduzida desta etapa não é uma implementação completa desse trabalho. Dados de retenção, condutividade, escala e condições de fronteira são dependências reais antes de qualquer alegação de calibração.
