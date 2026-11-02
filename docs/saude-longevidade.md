# Saúde, riscos e longevidade

Etapa13B, versão0.28.0. Perfil opcional generic-survival-demo@1/revisão11, com os mecanismos da13A. Perfis antigos mantêm a fisiologia anterior. Módulos pequenos em src/modules/survival; painel, marcação e estilos separados. Não é calibração de longevidade natural ou de um patógeno específico.

## Estados separados

Energia nutricional, integridade corporal, carga infecciosa, risco por idade e fertilidade não são a mesma variável. O campo legado queenHealth continua sendo energia nutricional da rainha; ant.health representa ferimentos. A espermateca conserva seu próprio balanço. Acabar o esperma não inflige dano ao corpo nem dispara uma morte.

No perfil novo, a rainha estabelecida pode consumir estoque acessível na câmara em que seu corpo realmente está. O débito usa o mesmo livro de estoques e o alimento entra na inglúvia antes da manutenção. Alimento em outra câmara continua exigindo transporte ou troca com outras formigas. Não há ingestão remota, criação de nutrientes ou busca global da rainha.

Ferimentos podem ser reparados até2 pontos corporais por dia do modelo, ao custo de0,005 crédito por ponto. Só o alimento efetivamente pago produz reparo. Usa a inglúvia e, para a rainha claustral, a manutenção materna finita. O consumo acumulado fica no estado individual. Sem recursos, o corpo não se cura gratuitamente.

## Riscos de morte

Para idade adulta a, a curva condicional é S(a) = exp(−(a/τ)²). A escala τ é2.000 dias para rainhas/princesas,120 para operárias e30 para machos, todos dias do modelo. Não são idades máximas nem expectativas medidas. O novo perfil substitui o limite rígido antigo da operária e a janela rígida de vida dos alados; o fim reprodutivo do macho após acasalamento continua sendo um evento separado.

Cada corpo recebe orçamentos latentes independentes de risco de idade e de doença, derivados de seed/ID, com E = −ln(1−U). O risco acumulado é comparado ao orçamento, sem sorteio extra a cada passo. Para idade, H(a) = (a/τ)². Para doença, acumula-se0,3 × integral da carga infecciosa, modulado pelos ferimentos. Se ambos cruzam no mesmo intervalo, usa-se a primeira fração estimada de cruzamento. Fome, conflito e predação continuam tendo seus próprios eventos.

A curva mostrada é teórica e condicionada a haver alimento e ausência de outros riscos. Não representa amostras de campo, nem promete a data de morte de uma habitante. A duração total da colônia também depende de alimento, reprodução, demografia e ambiente.

## Infecção local

A carga I varia entre0 e1. A equação reduzida é dI/dt = exposição × (1−I) − remoção × I. A solução e a integral da carga são analíticas para um intervalo de condições fixas; dividir esse intervalo não muda o resultado. Remoção plena0,08/dia é reduzida quando falta energia. Não representa um fungo ou sistema imune específico.

Exposição vem de resíduos próximos e de outras formigas infectadas, com alcance de0,45 u., contato pelo ar e uma modulação qualitativa pela água do solo. Os valores são lidos num único estado anterior ao movimento/atualização de carga, sem contágio em cascata pela ordem do loop. Resíduos carregados seguem a posição do carregador. O habitat compartilhado permite contato entre colônias, mas não há leitura de infecção distante. A checagem de contato usa a aproximação geométrica existente; não é transporte microscópico de esporos.

O botão de desafio adiciona0,5 ao índice da habitante selecionada e registra a intervenção para repetição. É uma perturbação experimental artificial, sem interpretação de dose natural. Corpos mortos ou perfis antigos não recebem o desafio. Contadores distinguem idade, doença, fome, conflito, predação, fim reprodutivo e causa desconhecida, uma vez por corpo.

## Persistência e colônias filhas

Carga, riscos latentes/acumulados, tempo da última atualização e custo de reparo ficam no save. Totais de mortalidade são verificados contra suas causas. Filhas mantêm a fisiologia dos corpos transferidos; mudar de colônia não renova o orçamento latente nem remove infecção. Os contadores da nova colônia são próprios. Saves antigos não são promovidos a este perfil automaticamente.

## Fontes e dependências reais

[Heinze e Schrempf (2012)](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0035201) acompanharam25 rainhas de Cardiocondyla obscurior e relataram mediana de25 semanas, com reprodução persistente até perto da morte. Isso ilustra por que décadas de vida e um custo universal de reprodução não podem ser impostos a todas as rainhas. O artigo foi lido no editor; seus dados não foram usados para ajustar esta curva.

A afirmação exata de28 anos e8 meses permanece sem verificação no registro primário. A faixa15–30 anos não foi instalada como lei, limite ou parâmetro. Para calibração faltam dados individuais por espécie, seguimento de sobrevivência/censura, causas de morte, dieta, temperatura, tamanho e fase da colônia, imunidade e condições de laboratório/campo. Também não há imunidade genética específica, fisiologia molecular ou organismo patogênico completo.

## Verificação

14 testes novos: coortes sintéticas de4.096 indivíduos por casta contra a curva analítica, integração de infecção, custos de reparo, pagamento materno, infertilidade sem morte automática, causas e idempotência, ingestão local/ausência de ingestão remota, alcance/transmissão através do ar, resíduos carregados, remoção do corte etário antigo, desafios, recuperação, rejeição de dados inconsistentes e fisiologia das filhas. Ensaio controlado sem novas posturas: rainha mantida por25 dias com estoque local finito e nenhuma cuidadora; débito alimentar conferido.

274/274 testes completos em230.169 ms, log local .runtime/survival-suite.log, sessão16698 encerrada. Depois apenas rótulos e apresentação; build final TypeScript/Vite de300 módulos aprovado. Sem dependências novas.

QA SAUDE-QA,25°C/68%: corpo e energia100%, carga50% após um desafio em D0,1; dois desafios levaram a carga1. Em D10, contadores mostraram uma morte por doença e uma por fim reprodutivo do macho, ainda com79,632 créditos espermáticos viáveis e nenhum ovo fecundado. É um desfecho demonstrativo desse seed, não uma taxa de mortalidade natural. Checkpoint de desfecho manual-81bd00bc-6ad3-4ba7-b84a-5cf824a1e766 recuperado com os mesmos contadores. Pontos anteriores manual-daa7ad68-55ac-4475-8c38-faab72e50a22 e manual-ad8e25ce-0e1c-4bdd-b756-7e805bc50739 preservados. Catálogo12 registros; troca imediata de curvas, console e largura do painel conferidos. Screenshot viveiro-0.28.0-saude.png preservado. SEMENTE-50088/D62,5/labv5 recuperado em pausa e confirmado; seletor, ritmo1× e perspectiva devolvidos.
