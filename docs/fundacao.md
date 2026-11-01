# Voo e fundação orgânica — 0.6.0

Terrários novos começam com uma rainha alada e um macho, sem galerias abertas e sem estoque coletivo. Saves anteriores mantêm o ninho e o fluxo de reprodução estabelecido, sem reiniciar um voo. O replay registra o tipo de início para não trocar um experimento antigo por uma fundação nova. A reprodução exata é garantida dentro da mesma versão do modelo; os algoritmos anteriores não são executores históricos congelados. A fundação é uma estratégia claustral exploratória; não representa todas as espécies.

## Estados e arquitetura

- `initialize.ts`: seleciona um sítio procedural livre de água/madeira e retém apenas a posição de um abrigo inicial raso; a geometria começa vazia.
- `flight.ts`: janela probabilística, voo limitado por passo, encontro no ar, pouso e perda das asas. O genoma paterno permanece no estado genético após o fim do macho.
- `excavation.ts`: abre a boca, avança um poço e alarga uma câmara por pequenas mordidas. Nenhuma outra sala nasce pronta.
- `travel.ts` e `motion.ts`: caminhada pelo apoio físico, borda e poço, incluindo viagens de terra à superfície. O depósito fica do lado oposto ao teto do poço.
- `types.ts` e `update.ts`: fase, reservas, gastos, acasalamento, asas descartadas, viagens e falha por falta de reservas.
- `colony/rooms.ts`: destinos sem índices fixos. Berçário e estoque compartilham a câmara inicial; resíduos vão para o acesso até existirem salas especializadas. Novas salas dependem das frentes das operárias.
- `colony/lifecycle.ts` e `hatching.ts`: primeira postura e larvas pagas pela mãe; quatro naníticas menores. Posturas seguintes exigem alimento coletado.

A janela de voo observa umidade, chuva recente e luz como proxy provisório de aquecimento. Condições iniciais com umidade >=45% incluem uma chuva antecedente na memória; em condições secas, é necessário chover e ajustar o ambiente. Não há ainda temperatura do solo nem sazonalidade calibrada. Luz baixa ou umidade extrema fecham a janela. O macho precisa estar presente no encontro aéreo.

## Balanços

A reserva materna inicial é finita (8 unidades abstratas):

`reserva_inicial = reserva_atual + manutenção + ovos + larvas + escavação`.

Não se transforma alimento de fora em reserva materna durante a fase sem operárias. A rainha não forrageia. A primeira postura custa 0,21 unidade por ovo e o consumo larval é debitado a cada tick. Se faltar energia, a prole não se desenvolve indefinidamente e a saúde da rainha cai. O restante da reserva ainda pode sustentar a rainha após nascerem operárias, sem reabastecimento artificial.

O solo usa o mesmo registro conservativo já existente:

`removido + erodido = carga + depósitos + material solto`.

Volumes de cápsulas/esferas são aproximações, inclusive nas interseções. Conservação contábil não significa uma discretização granular exata do volume geométrico. Essa limitação segue para a etapa 7.

## Verificação e limites

Há testes do solo intacto, condições de voo, acasalamento antes da prole, asas, viagens reais, recursos, naníticas, forrageamento e retorno pela única entrada, snapshots durante três fases e compatibilidade de ninhos antigos. Regressões antigas usam explicitamente uma fixture de ninho estabelecido, preservando os testes de gargalos e galerias; o fluxo novo é testado pelo construtor normal.

Os coeficientes e o tempo são acelerados e não calibrados. Asas são geometria leve; o voo não resolve aerodinâmica. O abrigo permanece aberto: selamento e reabertura por um tampão físico ainda dependem do solo granular. A fundação pode falhar e as primeiras operárias podem morrer por predação/fome. Não há garantia de crescimento.

Esta entrega implementa a fundação do casal inicial. A produção de novas princesas/zangões e fundações filhas simultâneas fica explicitamente na etapa 5C, junto da separação de recursos por colônia. Não declarar toda a etapa 5 concluída antes disso.

## Base biológica e dados necessários

A estratégia e o tamanho reduzido das primeiras operárias se apoiam em estudos de fundação claustral, sem importar parâmetros como se fossem universais:

- [Claustral colony founding is limited by body condition (2024)](https://academic.oup.com/biolinnean/article/142/4/397/7342048): experimento de alimentação de rainhas de Lasius niger; condição materna limita a prole.
- [Incipient nest characteristics across three species of harvester ant (2010)](https://pmc.ncbi.nlm.nih.gov/articles/PMC2803755/): diferenças de estratégia e arquitetura entre espécies.
- [Preston et al. (2007), USDA](https://www.ars.usda.gov/arsuserfiles/60360510/publications/Preston_et_al-2007%28M-4174%29.pdf): reservas corporais e primeira geração de Solenopsis invicta.

Calibrar exige uma espécie-alvo, séries ambientais, duração e consumo por estágio, distribuição de reservas, sobrevivência de rainhas e medidas de escavação. Esses dados externos não estão disponíveis no projeto; os resultados atuais são hipóteses do modelo.
