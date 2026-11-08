# Ordem dos processos

Parte3 do [ODD](../odd.md), conferida em colonies/update.ts e
simulation/environment-step.js. Atualizações são sequenciais; trocar sua ordem
muda o modelo, mesmo com a mesma seed. Operações locais podem usar buffers
simultâneos, sem tornar simultâneo o tick inteiro.

## Antes do tick

stepSession reaplica, na ordem do registro, todas as intervenções cujo tick é
menor ou igual ao tick corrente de A. Aplica a mesma intervenção em B quando
existe. Em seguida executa exatamente um passo de A e um de B. Intervir no tick t
ocorre depois do fechamento já registrado em t e antes de avançar para t+1.
Uma leitura atual separada pode, por isso, diferir do fechamento do mesmo tick.

## Um avanço da família

1. updateEnvironment incrementa o tick. Atualiza água/calor do solo quando devido,
   calcula adequação pela umidade, atualiza paisagem e transporta/evapora o
   feromônio superficial. Depósitos de operárias ocorrerão mais tarde no tick.
2. Captura a lista atual de colônias; recompõe referências de habitat/vizinhança.
3. Prepara química social; atualiza ecologia, território e encontros químicos.
4. Atualiza os odores de referência no grafo; depois erosão, agregados granulares
   e ventilação. Gases são compartilhados; calcula exposição a doença.
5. Para cada colônia, na ordem da raiz seguida das filhas: sincroniza IDs/limites,
   atualiza fertilidade e sazonalidade, depois ciclo da prole e adultos.
6. Predadores atuam sobre a lista conjunta. Mortes por predação e outras causas
   são registradas; cargas são largadas, resíduos gerados e mortos removidos.
7. Recompõe vizinhança. Para cada colônia atualiza nutrição/trofalaxia,
   deterioração de estoques e avisos, sem redistribuição gratuita de reservas.
8. Coordena encontros reprodutivos e alocação de novas colônias. Uma filha criada
   aqui não recebeu o bloco de atualização por colônia já encerrado neste tick.
9. Registra o fechamento diário quando tick é múltiplo de100. Se passaram25 ticks
   desde o censo anterior, registra o ponto do gráfico. A leitura é observacional.

## Ordem dos adultos dentro da colônia

Primeiro são guardadas poses anteriores para a interpolação, depois atualiza-se
fundação. Os adultos são visitados na ordem do array, sem embaralhamento global.
Idade, saúde/mortalidade e ramo sexual precedem o trabalho da operária.

Para operárias vivas: aprendizado/custo energético; encontros, infiltração,
abrigo sazonal, tampão, recuperação de travamento, mimetismo/pulgões, tarefa de
solo já assumida, organização da colônia e nova tarefa de solo. Um ramo que
consome a ação encerra o processamento daquele indivíduo no tick.

Sem tarefa prioritária, a operária considera rota interna e depois movimento
superficial. Sensores de perigo, retorno/coleta e ACO precedem deslocamento.
Quando se move na superfície carregando alimento, deposita0,25 unidade química
na célula final, limitada pela capacidade de depósito. Esse depósito será
transportado no próximo updateEnvironment. Não há retroação antecipada.

## Frequências e relógio

O ambiente/decisões principais avançam por tick. Água/calor e gases integram em
janelas de10 ticks com seus próprios subpassos; granular/escavação e efeitos de
perfil têm rotinas específicas. A reação-difusão superficial usa dt=1 por tick.
O gráfico é amostragem de25 ticks; CSV diário usa100.

O relógio visível acumula crédito de tempo real e drena ticks inteiros. Página
oculta pausa o avanço normal; o Worker de avanço usa stepSession até atingir
orçamento/destino, sem saltar ticks. Cancelamento não aplica um mundo parcial
incompleto. Simular enquanto a página está fechada não está implementado.

Previsões executam cópias, com sementes de réplica próprias. Render, câmera,
exportação e leitura do ODD não devem consumir o RNG da execução observada.
