# Cronograma de entregas

Atualizado em 01/11/2026. Cada etapa tem branch própria, testes, publicação
no mesmo Site privado e registro de limitações. As próximas entregas dependem
dos testes e do feedback; não há datas artificiais de conclusão.

| Etapa | Entrega                                                              | Situação                                    |
| ----- | -------------------------------------------------------------------- | ------------------------------------------- |
| 0     | Terrário, reprodução, previsões, túneis e primeira pessoa            | Publicada: v0.2.1                           |
| 1     | Navegação social 3D, piso, colisões, recuo, TypeScript e Vite        | Versão 0.3.0                                |
| 2     | Escavação orgânica, transporte de terra, erosão, bloqueios e reparos | Protótipo implementado                      |
| 3     | Estoques, lixo, prole, trofalaxia, castas, personalidade e idade     | Protótipo implementado                      |
| 4     | Reação-difusão, ACO e limiares de estímulo                           | Protótipo implementado                      |
| 5     | Genética, voo nupcial e fundação de novas colônias                   | Protótipo implementado                      |
| 6     | Simbioses, odor, território e colônias vizinhas                      | Protótipo implementado                      |
| 7     | Solo granular, capilaridade, termodinâmica e gases                   | Protótipo implementado; calibração pendente |
| 8     | RL, persistência longa e avaliação das previsões                     | Protótipo implementado; publicada 0.17.0    |

## 1. Locomoção e estrutura do projeto

- Corpos e câmera apoiados no terreno, incluindo paredes.
- Terreno arredondado e consulta física por campo implícito contínuo.
- Deslocamento limitado, sem saltar diretamente entre apoios.
- Repulsão local, contato antenal e prioridade para alimento/prole.
- Recuo e reconsideração de rotas quando o contato persiste.
- Alargamento local experimental por congestionamento.
- Sensores, forças, contato, superfície e túneis em módulos.
- TypeScript estrito na navegação e Vite para gerar o bundle.
- Migração gradual de UI e renderização legadas para TypeScript.

Aceite: reprodução pela seed, ausência de NaN, prioridade de carga testada,
apoio correto, fluxo retomado em gargalos e verificação no navegador.

## 2. Túneis vivos

- Abrir o primeiro buraco durante a fundação (5B implementada).
- Escolher frentes de escavação por estímulos locais.
- Retirar porções de terra, carregá-las e depositá-las na superfície.
- Abrir ramificações e câmaras progressivamente.
- Desgaste, erosão, material solto, bloqueios e reparos.
- Resistência simplificada por umidade, profundidade e vão.

Aceite: conservação do material removido, passagem após abertura e recuperação
de um bloqueio reproduzível. O alargamento da etapa 1 não substitui esta etapa.

## 3. Organização e diferenças individuais

- Despensa, lixo e cemitérios afastados da prole.
- Transporte visível de ovos, larvas e pupas; nascimento.
- Trofalaxia conservativa via estômago social.
- Castas com corpos e tarefas diferentes.
- Idade, energia, coragem, atividade e exploração individuais.

Depende de rotas funcionais. Aceite: transferência conservativa, mudança de
tarefas observável e ausência de crescimento sem recursos.

## 4. Campos e tarefas probabilísticas

- Difusão-evaporação numericamente estável.
- Escolha ACO por amostragem e respostas por limiar de estímulo.
- Sensores limitados, memória local e ausência de informação global oculta.

Aceite: testes de dispersão, evaporação, estabilidade e distribuição de escolhas.

## 5. Genética e novas fundações

- Cromossomos, parentesco, cruzamento e mutações registradas.
- Efeitos em corpo, movimento, sensores e resistência.
- Alados, gatilhos ambientais, acasalamento e perda das asas.
- Reservas maternas e naníticas na fundação claustral quando adequada à espécie.

Aceite: parentesco persistido e reprodução consumindo reservas.

## 6. Ecologia e colônias vizinhas

- Pulgões, melaço e proteção; lagartas miméticas.
- Reconhecimento por distância química entre odores.
- Intimidação, fuga, conflito, camuflagem e território.

Aceite: encontros locais, balanço de recursos e resultados dependentes do contexto.

## 7. Física e validação

- Autômatos granulares com massa, atrito e ângulo de repouso.
- Umidade espacial, infiltração, capilaridade e mofo.
- Temperatura, O2, CO2 e ventilação dependente da geometria.
- Calibração por espécie e comparação com experimentos.

Depende de pesquisa e benchmarks. Não promete simular cada grão real nem
substituir uma análise geotécnica validada.

## 8. Aprendizado, persistência e previsões

- Políticas pequenas de RL, recompensas e comparação com baselines.
- Treino separado da renderização.
- Snapshots, checkpoints, migrações, eventos, métricas e replay.
- Previsões com observações parciais/completas e erro medido por horizonte.

RL depende de sensores, ações, recompensas e física estáveis.

### Progresso da etapa 2 — 31/10/2026

- Branch: codex/tuneis-vivos, incluindo a correção complementar da boca dos túneis.
- Frentes móveis, novas galerias, carga visível, depósitos e reparo por viagens.
- Erosão simplificada por umidade e vão; intervenção em uma galeria vazia.
- Balanço conservativo de material e snapshots reproduzíveis.
- Reconstrução da malha em Worker; arquivos de inicialização, migração e previsão separados.
- Fundação do primeiro buraco ligada à etapa de novas rainhas (5), ainda pendente.
- Solo por volumes aproximados, sem representar grãos reais.
- Ferramenta do navegador retomada; conferência visual das etapas na versão 0.4.0. Dev continua no G:.

### Progresso da etapa 3 — 31/10/2026

- Branch: codex/organizacao-colonia.
- Inglúvia, troca conservativa por contatos locais e consumo para energia.
- Transporte físico de crias e resíduos; estágios e cargas visíveis.
- Castas, diferenças individuais e papéis ligados à idade.
- Migração de snapshots e contador de trocas de alimento.
- Testes biológicos e regressões de movimento implementados.

### Progresso da etapa 4A — 31/10/2026

- Branch: codex/campos-e-tarefas.
- Fluxos químicos conservativos, difusão, evaporação e vento com subpassos estáveis.
- Escolha ACO amostrada e respostas por limiares individuais.
- Estímulos locais, memória de necessidades e contato sem atravessar solo.
- Roteamento interno ainda usa o grafo conhecido do ninho; a remoção dessa dependência é a próxima parte (4B).

### Progresso da etapa 4B — 31/10/2026

- Branch: codex/navegacao-local.
- Política com observações locais e memória limitada a arestas visitadas.
- Odores de referência no grafo físico com balanço de fontes e evaporação.
- Entrada de retorno conhecida ou percebida; sem busca global de rotas pelos agentes.
- Propostas de escavação iniciadas pelas operárias sob densidade local.
- Regressões locais e build aprovados; roteamento testado também com geometrias procedurais.

### Etapa adicional — terrário procedural (0.4.0)

- Branch: codex/terrario-procedural.
- Superfície inteira e ninho por seed; repetir uma seed mantém a reprodução.
- Bosque, pradaria e vegetação árida; oito tipos de plantas e três formatos de madeira.
- Água, crescimento, estresse, umidade de materiais e decomposição durante os ticks.
- Câmaras em lados variáveis, frentes 3D e curvas que preservam trechos anteriores.
- Aberturas no vidro surgem conforme a escavação alcança a parede, sem recortes decorativos.
- Alternância entre quatro lados e transparência opcional para observar o interior.
- Compatibilidade com saves antigos; crie outro terrário para usar a geração nova.
- Pontas dos troncos sem faces sobrepostas; aranhas interpolam a altura real do relevo.
- Aceite: seeds reproduzíveis, conectividade, direções 3D, conservação, apoio, ecologia
  e regressões de fluxo; testes completos e revisão visual antes da publicação.
- Próxima etapa principal: genética e fundação orgânica (5). A etapa 2 continua
  parcial enquanto o primeiro buraco e a fundação não forem implementados.

### Verificação da 0.4.0

- Suíte completa: 48 testes aprovados.
- Regressões dirigidas após ajustes: apoio, fluxo, obstáculos procedurais e malha aprovados.
- Otimização do campo: 12.000 amostras idênticas à referência anterior.
- Navegador: nova seed/paisagem, quatro lados, observação interna, primeira pessoa e retorno.
- Build de produção e TypeScript aprovados.
- Modelos continuam exploratórios; as etapas científicas restantes não são dadas como concluídas.

### PRs abertos para revisão, em ordem

| Ordem | PR                                                | Entrega                                             |
| ----- | ------------------------------------------------- | --------------------------------------------------- |
| 1     | [#1](https://github.com/albreis/viveiro/pull/1)   | Recuperação nas paredes e migração para G           |
| 2     | [#2](https://github.com/albreis/viveiro/pull/2)   | Túneis vivos, terra e reparos                       |
| 3     | [#3](https://github.com/albreis/viveiro/pull/3)   | Organização e alimentação da colônia                |
| 4     | [#4](https://github.com/albreis/viveiro/pull/4)   | Reação-difusão, ACO e tarefas                       |
| 5     | [#5](https://github.com/albreis/viveiro/pull/5)   | Sensores locais e memória                           |
| 6     | [#6](https://github.com/albreis/viveiro/pull/6)   | Terrário procedural e ecologia dinâmica             |
| 7     | [#7](https://github.com/albreis/viveiro/pull/7)   | Genética digital e fluxo com diferenças individuais |
| 8     | [#8](https://github.com/albreis/viveiro/pull/8)   | Voo e fundação física do casal inicial              |
| 9     | [#9](https://github.com/albreis/viveiro/pull/9)   | Colônias filhas no habitat comum                    |
| 10    | [#10](https://github.com/albreis/viveiro/pull/10) | Reconhecimento químico e território                 |
| 11    | [#11](https://github.com/albreis/viveiro/pull/11) | Planejamento biológico recebido (etapas 9–14)       |
| 12    | [#12](https://github.com/albreis/viveiro/pull/12) | Simbioses e mimetismo                               |
| 13    | [#13](https://github.com/albreis/viveiro/pull/13) | Agregados soltos com gravidade e atrito             |
| 14    | [#14](https://github.com/albreis/viveiro/pull/14) | Água e calor no entorno do solo                     |
| 15    | [#15](https://github.com/albreis/viveiro/pull/15) | Gases, ventilação e sensores locais                 |
| 16    | [#16](https://github.com/albreis/viveiro/pull/16) | Suporte local do teto e desprendimento conservativo |
| 17    | [#17](https://github.com/albreis/viveiro/pull/17) | Aprendizado individual e comparação com ACO         |

Os PRs usam a branch anterior como base. Após integrar cada predecessor, ajuste
a base do próximo para main. Branches antigas já incorporadas não recebem PRs
vazios. A genética digital foi implementada na entrega 5A e está no PR #7. Novas etapas seguem este fluxo
automaticamente.

### Publicação e recuperação

- 0.4.0 publicada em 31/10/2026 no mesmo Site privado.
- Fonte publicada: ec9815c20b81de46039b97172cb610287b4e994b.
- Tag de recuperação: v0.4.0, apontando exatamente para a fonte publicada.
- PRs #1 a #6 continuam abertos e encadeados para revisão.
- Dev mantido em G:\Projetos\viveiro, em http://127.0.0.1:4173/.

### Etapa 5A — genética e herança

- Branch codex/genetica-e-heranca, baseada na entrega procedural.
- Genomas, recombinação, mutações e parentesco persistentes ligados ao ciclo da prole.
- Efeitos limitados em corpo, velocidade, sentidos, metabolismo e limiares.
- Sete testes genéticos aprovados; regressões completas e revisão visual em andamento.
- Não conclui a etapa 5: voo nupcial e fundação orgânica continuam em 5B.
- Retomada horária nesta conversa configurada no app; checkpoint em docs/CONTINUAR.md.

### Regressões complementares da 5A

- Entrada no poço segue a borda real mesmo quando a velocidade projetada é pequena.
- Progresso físico detecta oscilação que a troca de células não revela.
- Uma escavadora retorna ao ponto físico de trabalho antes de declarar chegada.
- Mordidas e apoio são acoplados por limite de avanço por frente e tick.
- 20 casos dirigidos aprovados; suíte completa novamente em execução.

### Aceite da etapa 5A — 01/11/2026

- 57 testes aprovados na suíte completa, TypeScript e build aprovados.
- Conferência no navegador: ascendência, movimento, primeira pessoa e retorno.
- PR #7 sobre a etapa procedural; 0.5.0 publicada em 01/11/2026.
- A etapa 5B de voo e fundação orgânica é a próxima entrega.

### Publicação da 5A

- 0.5.0 publicada com sucesso no mesmo Site privado.
- Fonte publicada e tag v0.5.0: e149fe8944b315bbff078a4f1be7a471c3297145.
- PR #7 aberto: https://github.com/albreis/viveiro/pull/7.
- Continuação horária ativa. Próxima etapa: voo e fundação orgânica (5B).

### Etapa 5B — voo e fundação do casal inicial (0.6.0)

- Branch: codex/voo-e-fundacao, baseada na genética 5A.
- Novos terrários com alados e solo intacto; janela de voo local, encontro aéreo, pouso e asas descartadas.
- Boca, poço e primeira câmara escavados pela rainha, com viagens físicas e conservação da terra.
- Reservas maternas finitas, primeira postura claustral e naníticas menores; depois, alimento externo.
- Destinos por função, sem pressupor câmaras de índices fixos; ninhos e saves antigos preservados.
- Validação: 65 testes aprovados, TypeScript/build aprovados e navegador conferido com quatro naníticas, parentesco e primeira pessoa. Modelo exploratório: docs/fundacao.md.
- Pendente 5C: novas princesas/zangões e fundações filhas, recursos e genéticas por colônia.
- Selamento físico do acesso, espécie-alvo e calibração dependem da etapa 7 e de dados reais.

Publicação 0.6.0 confirmada em 01/11/2026, fonte 0aec356, tag v0.6.0, PR #8 aberto sobre a genética. Site continua privado. A próxima entrega é 5C.

### Etapa 5C — filhas e recursos por colônia (0.7.0)

- Branch codex/colonias-filhas, base codex/voo-e-fundacao.
- Alados pagos pelo estoque e por poupança reprodutiva conservativa; ploidia e parentesco da geração seguinte.
- Saída física dos alados, janela de chuva e fundação da filha sem reposicionar corpos.
- Habitat compartilhado, estoques/genéticas/prole independentes, sensores físicos comuns e apresentação de várias rainhas.
- Nascimento da geração 2 conferido no navegador; snapshots e balanços testados.
- Limites e dependências reais: docs/colonias-filhas.md. Pares da mesma coorte, sem calibração por espécie.
- Próxima etapa: 6 — simbioses, assinatura química, território e interação entre as colônias existentes.

Validação 5C: 76 testes completos aprovados, mais 19 verificações finais direcionadas após os últimos ajustes. TypeScript/build e navegador aprovados. Publicação 0.7.0 em preparação; conferir checkpoint e PR antes de repetir.

Publicação 0.7.0 concluída em 01/11/2026: fonte e6e4790, tag v0.7.0, PR #9 sobre a 5B. Site permanece privado. Próxima entrega: etapa 6.

### Progresso da etapa 6A — 01/11/2026

- Branch codex/odores-e-territorio, base codex/colonias-filhas; versão 0.8.0.
- Perfis químicos por colônia, máscara temporária e reconhecimento local pelo ar.
- Postura, recuo apoiado, dano persistente e prioridade dependente do contexto.
- Campo territorial conservativo, legenda, anéis de contato e tratamento de odor pelo usuário.
- Infiltração experimental com revestimento, percurso físico e transferência conservativa de estoque.
- Testes de química, recursos, apoio, ida/volta e snapshots; conferência no navegador com duas colônias.
- Evidência qualitativa, equações, limitações e dados externos em docs/odores-e-territorio.md.
- Próximo: 6B pulgões/melaço/proteção e lagartas miméticas; não repetir 6A.

### Progresso da etapa 6B — 01/11/2026

- Branch codex/simbioses-e-mimetismo; base codex/cronograma-biologia-fundacao para preservar o PR do planejamento novo.
- Pulgões por seed, seiva debitada da planta, melaço e coleta conservativos, proteção e predação locais.
- Lagartas cuco com reconhecimento químico, transporte físico, deposição no berçário e alimento debitado de doadoras próximas.
- Instâncias visuais, painel ecológico e câmera para observar as relações de perto.
- Suíte completa: 96 testes aprovados; 19 verificações químicas/ecológicas após ajustes finais e dez verificações de ecologia/mimetismo após impedir crescimento sem seiva. Um novo teste adiciona o caso da planta esgotada.
- Navegador: seed a, duas adoções e 1,51 u. cedidas às lagartas; 16,41 u. de melaço coletadas até o dia 171. Sem erros de console. São resultados do modelo.
- Referências, orçamento e limites em docs/simbioses.md: agregação de pulgões, população inicial de lagartas e ausência de ciclo adulto de borboleta/calibração.
- Próximo passo do cronograma original: 7 — granular, capilaridade e gases; depois 8 e as novas etapas 9–14.

### Etapa 7A — dinâmica de terra solta (0.10.0)

- Branch codex/solo-granular, base codex/simbioses-e-mimetismo.
- Agregados com volume, velocidade, gravidade, contato dissipativo e atrito limitado por Coulomb.
- Grade espacial para vizinhanças, subpassos e passos limitados; colisão com o campo real e vidro.
- Queda a partir do teto, acomodação, reparo e balanço conservativo; snapshots de velocidades.
- Controle experimental de repouso, diário/replay e instâncias móveis separadas da malha estática.
- Testes de plano inclinado, queda, contatos, massa e restore; revisão visual com queda e retirada pelas operárias. Suíte completa: 103 aprovados; TypeScript e Vite aprovados.
- Limites em docs/granular.md: porções agregadas, solo compacto implícito, depósitos visuais, sem cadeias de força ou soterramento.
- Pendente 7B: umidade espacial, capilaridade, temperatura, O2/CO2, ventilação e respostas biológicas.
- Pendente 7C: suporte estrutural local acoplado à escavação; calibração continua dependendo de dados externos.

### Etapa 7B1 — água e calor espaciais (0.11.0)

- Branch codex/agua-e-calor, base codex/solo-granular.
- Grade 3D sob o relevo, saturação dos poros separada da umidade relativa do ar.
- Redistribuição capilar reduzida, drenagem, infiltração, lagos, evaporação e captação vegetal com balanços.
- Condução térmica, fronteiras e referência de temperatura do ar independente da luz.
- Resposta local de plantas/materiais, leituras da formiga e mapas em corte de água/calor.
- Estado compartilhado por colônias e snapshots reproduzíveis; 111 testes completos aprovados e TypeScript/Vite aprovados.
- Modelo exploratório e limitações em docs/agua-e-calor.md; sem inundação, gelo ou solução completa de Richards.
- Pendente 7B2: gases, ventilação e respostas biológicas; 7C: acoplamento estrutural do solo. Etapas 9–14 preservadas ao final.

### Etapa 7B2 — gases e ventilação (0.12.0)

- Branch codex/gases-e-ventilacao; base codex/agua-e-calor.
- O₂/CO₂ por compartimentos, respiração, difusão e advecção com balanços.
- Pressão em grafo, entradas, vento, empuxo aproximado e resistência por entulho.
- Sensores locais, custo energético e viés ACO sem mapa global.
- Água/temperatura próximas para desgaste e deterioração do estoque; resíduos conservativos.
- Painel, diagrama e leitura na formiga; intervenções e restore determinísticos.
- 123/123 testes na execução completa limpa; TypeScript/Vite e navegador aprovados. Publicação privada 0.12.0 confirmada; fonte 0e385cc, tag v0.12.0, PR #15.
- Limites e dependências experimentais em docs/gases-e-ventilacao.md; modelo não calibrado.
- Próximo: 7C suporte estrutural, depois 8 e novas etapas biológicas 9–14.

### Etapa 7C — suporte estrutural local (0.13.0)

- Branch codex/suporte-estrutural; base codex/gases-e-ventilacao.
- Teto, vão, espessura e apoios consultados no mesmo campo da escavação.
- Carga/capacidade aproximadas por água, atrito e integridade; dano persistente.
- Corte sólido discretizado vira agregado que cai e pode ser recolhido.
- Fissuras e câmera de inspeção; snapshots conservam estado e futuro.
- 130/130 testes completos e sete estruturais finais aprovados; TypeScript/Vite e navegador aprovados. Publicação privada0.13.0 confirmada; fonte25dbe03, tagv0.13.0, PR#16.
- Limites e dados externos em docs/suporte-estrutural.md; sem DEM do solo compacto ou calibração.
- Depois do aceite: 8 (RL/persistência/previsões) e etapas 9–14.

### Etapa 8A — aprendizado local (0.14.0)

- Branch codex/aprendizado-local; base codex/suporte-estrutural.
- SARSA neural pequeno, observações locais e pesos próprios por formiga.
- Treino em Worker separado, 64 cenários reservados e comparação com ACO/rede sem treino.
- Aplicação validada, retorno a ACO, replay e restore com futuro idêntico.
- Leitura individual e comparação do modelo inicial persistente no painel.
- 139/139 testes completos, TypeScript/Vite e navegador aprovados; 0.14.0 publicada no Site privado. Fontefb20930, tagv0.14.0, PR#17.
- Limites em docs/aprendizado-local.md. 8B: IndexedDB/checkpoints; 8C: previsão/observação/erro/desempenho.

### Etapa 8B — checkpoints e recuperação (0.15.0)

- Branch codex/checkpoints-e-recuperacao; base codex/aprendizado-local. PR#18 em revisão.
- IndexedDB atômico, fila serial, cópia local e preservação do legado.
- Habitat compartilhado compactado; recursos, RNG, cérebros e replay preservados.
- Pontos nomeados, oito automáticos recentes e importação/recuperação em pausa.
- Estado anterior guardado antes de recuperar; dados inválidos não causam sobrescrita silenciosa.
- 153/153 testes completos, quatorze dirigidos e navegador aprovados. TypeScript/Vite aprovados; publicada no mesmo Site privado.
- Limites em docs/persistencia.md. Próximo: 8C previsões/observações/erro/desempenho; depois9–14.

### Etapa 8C1 — previsões canceláveis (0.16.0)

- Branch codex/previsoes-cancelaveis, base codex/checkpoints-e-recuperacao.
- Worker cooperativo, progresso, cancelamento, último pedido e descarte de resultados obsoletos.
- Horizonte/amostra/orçamento configuráveis; parada explícita e amostras incompletas rotuladas.
- Mesmo modelo completo, sem emulador oculto. Oito testes novos e dois de regressão aprovados.
- Navegador aprovado: cancelamento/intervenção e orçamento3/6 vs conclusão6/6. Publicada no mesmo Site privado, PR#19. Limites em docs/previsoes.md.
- Próximo8C2: observação parcial/completa, erro por horizonte, baselines e custo; depois9–14.

### Etapa 8C2 — observação e avaliação (0.17.0)

- Branch codex/observacao-e-validacao, base codex/previsoes-cancelaveis.
- Contrato parcial só com censos passados; extrapolação identificada, sem estado oculto.
- Avaliação pareada de completo/contagem/base constante em1/3/7dias e seeds reservadas.
- Métricas/custo, download e painel;16testes dirigidos aprovados. Ensaio18casos e QA aprovados; publicada no mesmo Site privado, PR#20.
- docs/avaliacao-previsoes.md distingue validação sintética e calibração externa. Depois9–14.

## Novas etapas 9–14 — biologia, clima e vida longa

Adicionadas ao final em 01/11/2026 a pedido do usuário, a partir do material de outra IA. O andamento atual está registrado abaixo; estas entregas não substituem as etapas anteriores. Faixas recebidas, correções, referências primárias e dados necessários estão em [Biologia planejada](biologia-planejada.md). Valores dependem da espécie e de calibração.

| Etapa | Nova entrega                                                          | Situação / dependências                   |
| ----- | --------------------------------------------------------------------- | ----------------------------------------- |
| 9     | Perfis biológicos por espécie e proveniência dos parâmetros           | Registro implementado; calibração externa |
| 10    | Fundação claustral com cronologia, tampão físico e reservas corporais | 10A/10B publicadas; calibração pendente   |
| 11    | Desenvolvimento térmico da prole, nutrição e diapausa                 | Planejada; 7 e 9                          |
| 12    | Clima espacial, umidade e seleção local da câmara                     | Planejada; 7 e 9                          |
| 13    | Espermateca, fertilidade, envelhecimento e longevidade da rainha      | Planejada; 5A/5C, 8 e 9                   |
| 14    | Escala de tempo biológico e experimentos de anos com recuperação      | Planejada; 8–13                           |

### 9. Espécie e parâmetros rastreáveis

- Escolher espécie/perfil de fundação e registrar unidades, fonte, amostra e incerteza.
- Investigar as faixas propostas: câmara 12–24 h; postura 1–7 d e 5–30 ovos; referência térmica 24–27 °C.
- Distinguir estratégias claustrais, semiclaustrais, sazonalidade e espécies sem casulo.
- Aceite: parâmetros versionados e distinção visível entre medição, hipótese e aproximação.

#### Progresso9 — catálogo (0.18.0)

- Branch codex/perfis-biologicos; base codex/observacao-e-validacao.
- Registros versionados com fonte, unidade, contexto, amostra e incerteza; quatro classes de evidência visíveis.
- Genérico preservado e preset opcional de ar de referência; consulta não muda o experimento.
- Perfil em snapshots/replay e herança por colônia; versão desconhecida protege os dados.
  - 21 testes dirigidos e 176/176 completos aprovados; QA/recarga/recuperação aprovadas; publicada no mesmo Site privado; PR#21. docs/perfis-biologicos.md.
- Espécies calibradas dependem de dados; mecanismos semiclaustrais/casulo/diapausa seguem nas etapas10/11.

### 10. Fundação, selamento e orçamento materno

Entrega dividida em 10A (reservas, custos e contabilidade) e 10B (tampão, isolamento e reabertura físicos), cada uma com branch e PR próprios. Perfis numéricos antigos permanecem preservados.

- 10A implementada na branch codex/reservas-maternas, versão 0.19.0: 183/183 testes completos, 14 dirigidos finais, TypeScript/Vite e QA no navegador aprovados. Publicada no mesmo Site privado; PR [#22](https://github.com/albreis/viveiro/pull/22). Ver docs/reservas-maternas.md.
- 10B publicada na versão 0.20.0, branch codex/selamento-fundacao e PR [#23](https://github.com/albreis/viveiro/pull/23): tampão físico conservativo, gases porosos, inspeção e reabertura pelas naníticas. Regressão 190/190 e 16 dirigidos finais aprovados. Ver docs/selamento.md.
- Cronologia real e fundação semiclaustral continuam pendentes; não há isolamento térmico ou de umidade do ar calibrado.
- 11A implementada na branch codex/maturacao-e-estacoes, versão 0.21.0: 199/199 testes, build e QA aprovados. Publicada no mesmo Site privado, PR [#24](https://github.com/albreis/viveiro/pull/24); ver docs/maturacao.md. Próximo item: 11B, diapausa e casulos.

- Estender a máquina de estados existente com tampão, isolamento e reabertura pelas naníticas.
- Cronologia dependente de esforço, geometria, temperatura, condição e reservas; término físico da obra.
- Reservas lipídicas/proteicas, histólise muscular quando apropriada, custos de postura e cuidado.
- Aceite: massa do tampão conservada, trocas ambientais alteradas e prole sem recursos gratuitos.

### 11. Maturação e estações

- 11A: mecanismo térmico demonstrativo, alimentação parcial, estresse, perdas e estado individual persistente implementados. Durações por espécie continuam sem calibração externa.
- 11B: diapausa, memória sazonal, retomada e casulos ainda pendentes.

- Investigar ovo–larva 10–14 d, larva–pupa 10–15 d e pupa–adulta 10–24 d.
- Conferir o total sugerido de 35–60 d: a soma das faixas individuais recebidas é 30–53 d.
- Curvas térmicas, alimentação, umidade da câmara, estresse e variabilidade individual.
- Diapausa por espécie/estação, pausa de postura e retomada gradual.
- Aceite: curvas e transições testadas; aquecimento excessivo não acelera indefinidamente a prole.

### 12. Cenários climáticos e engenharia da câmara

- Usar 52% de umidade e 68% de luz como cenário de investigação, sem deduzir temperatura ou estabilidade diretamente.
- Separar umidade do ar e água no solo, irradiância, temperatura, textura, compactação e suporte.
- Rainha procura umidade/temperatura por sensores locais; prole e sementes requerem condições diferentes.
- Validar as sugestões de 70–80% de umidade, postura em 3–5 d, conversão de luz em calor e aceleração de 25%; não hardcodar como leis.
- Aceite: gradientes físicos, custos e decisões locais observáveis; estabilidade não é garantida por um slider.

### 13. Fertilidade e longevidade

- Estoque/viabilidade de esperma, uso por ovo e possível contribuição de múltiplos machos.
- Perda de fertilização altera a prole em perfis apropriados, sem morte instantânea da rainha.
- Saúde, reservas, danos, idade, doença e risco de morte separados; custo da postura com hipótese explicitada.
- Investigar vida de 15–30 anos e a alegação histórica de 28 anos e 8 meses, sem tratá-las como universais ou confirmadas.
- Aceite: balanço espermático, parentesco, curvas de sobrevivência e desfechos emergentes testados.

### 14. Ritmo biológico e execução longa

- Oferecer perfil de 1 minuto real por dia simulado e outros ritmos; separar relógio biológico de estabilidade numérica.
- Exemplo: 365 dias = 6 h 5 min; 30 anos = 182,5 h nessa escala, sem obrigar o navegador a ficar aberto todo esse tempo.
- Checkpoints, migração, recuperação, avanço offline definido e comparação de execuções aceleradas.
- Execução contínua em servidor é requisito futuro com custo e limites explícitos; o Site atual avança no navegador.
- Aceite: continuidade entre sessões e resultados equivalentes sob aceleração para ações nos mesmos instantes biológicos.
