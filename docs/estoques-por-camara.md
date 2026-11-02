# Estoques por câmara

## Etapa 12B — 0.25.0

O perfil opcional generic-microclimate-demo@2 acrescenta lotes alimentares por câmara à escolha local da revisão anterior. A revisão1 continua sem esses lotes e mantém seu futuro. O padrão genérico permanece v5. São créditos alimentares abstratos, sem dieta, fungo ou biomassa calibrados.

## Balanço e fluxos

Cada colônia guarda um registro inicial, entradas, retiradas, fluxos assinados e lotes com nó, ponto e quantidade. Duas identidades são verificadas:

- Alimento atual = inicial + entradas − retiradas.
- Alimento atual = soma dos lotes nas câmaras.

Entregas de forrageadoras, devolução de reserva reprodutiva e transferência da despensa fundadora creditam o estoque. Prole, casulos, alimentação social, investimento em alados, deterioração e furto retiram créditos por funções explícitas. O estoque reprodutivo reservado e a carga ainda transportada continuam separados; não são contados duas vezes no estoque disponível. O habitat e os recursos das colônias permanecem independentes.

Entregas e refeições diretas exigem que o corpo esteja dentro da câmara, além de possuir o nó lógico correto. Uma chegada adiantada aciona aproximação apoiada antes de depositar. Uma operária em câmara vazia não retira comida de outra câmara para encher a inglúvia. Uma escavadora não recebe energia sem pagar o alimento acessível.

A distribuição coletiva para prole e custos reprodutivos ainda usa o orçamento alimentar da colônia, debitando lotes disponíveis. Não há transporte físico de cada crédito metabólico até cada larva. A rainha adulta continua dependendo de alimentação social e das regras prévias de reserva pessoal; esta etapa não acrescenta ingestão autônoma do estoque pela rainha.

## Escolha e deterioração

Forrageadoras preferem câmaras mais secas entre as leituras que guardaram de visitas recentes. A referência demonstrativa é 30% de água nos poros; não é umidade relativa do ar nem ótimo natural para sementes. Sem memória climática válida, o comportamento legado de procurar estoques pelo objetivo/odor continua como fallback, sem consultar temperaturas ou umidades remotas.

A cada100 passos, cada lote usa a temperatura e a água no seu próprio ponto. O excesso acima de65% dos poros multiplica uma taxa de0,005, modulada pela temperatura. Perda de alimento vira resíduo contado no local. Referências, taxas e limites estão no catálogo como aproximações. Não é um modelo de crescimento real de fungos.

Marcadores volumétricos e o painel mostram quantidades, câmaras, água local, entradas, retiradas e fechamento do balanço. Os marcadores representam lotes agregados; não possuem física individual de grãos ou participação na colisão das formigas.

## Persistência e verificação

Saves guardam lotes, pontos, fluxos e destino de entrega. São rejeitados saldos inválidos, duplicatas, câmaras inexistentes ou de outra colônia, posições incompatíveis e balanços abertos. O teste de habitat compartilhado confere também os dados após religar as referências das colônias filhas.

A primeira suíte completa passou228/228 em240.733 ms. Depois foram adicionadas guardas de posição e propriedade e três testes novos; os15 dirigidos finais de estoque/codec passaram. A execução completa final está em andamento e deve ser coletada antes da publicação. O build final passou com270 módulos, sem dependências novas.

QA parcial ESTOQUES-QA, ar21°C/80%: fundação com quatro naníticas, estoque positivo de0,339 crédito na primeira câmara da rainha e balanço fechado. Checkpoint Estoque por câmara · QA emD215,8, rainha ainda viva e cerca de21,8% de água nos poros no lote. Não é um ensaio de longevidade calibrada. Conferir painel atualizado, representação, recarga, console e retorno ao terrário do usuário antes de publicar.

## Restante da etapa12

Materiais, textura/compactação e ligação explícita ao transporte de água e suporte ficam na12C. Esta divisão preserva os critérios restantes; não declara a etapa12 inteira concluída. Calibração por espécie, contaminação e dieta continuam dependendo de dados externos reais. Depois seguem13,14 e as novas fasesP0–P5 na ordem do usuário.
