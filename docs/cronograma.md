# Cronograma de entregas

Atualizado em 02/11/2026. Cada etapa tem branch própria, testes, publicação
no mesmo Site privado e registro de limitações. As próximas entregas dependem
dos testes e do feedback; não há datas artificiais de conclusão.

## Situação atual

✅ significa mecanismo implementado, testado e entregue como modelo exploratório. Não significa calibração científica por espécie, nem que os PRs já foram integrados à main. Última publicação privada: **0.30.1**, PR [#41](https://github.com/albreis/viveiro/pull/41), pipeline de releases por tag. P0.3 concluída: [Site público separado](https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/) com URLs por versão. A0.29.1/PR #40 entregou revisão e licenças. A0.29.0/PR #39 entregou a etapa14 de ritmo e continuidade. A0.26.2/PR #36 corrigiu as aranhas junto à vegetação. A 0.26.1/PR #35 corrigiu as bordas das entradas. A 0.23.0 e o PR #26 já estão integrados à main.

| Etapa | Entrega                                                            | Situação                                                         |
| ----- | ------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 0     | Terrário, túneis e primeira pessoa                                 | ✅ Entregue                                                      |
| 1     | Navegação social 3D, apoio e TypeScript/Vite                       | ✅ Entregue; migração dos módulos legados continua gradual       |
| 2     | Escavação, transporte, erosão, bloqueios e reparos                 | ✅ Entregue; primeiro abrigo incluído em 5B                      |
| 3     | Estoques, lixo, prole, trofalaxia, castas e diferenças individuais | ✅ Entregue                                                      |
| 4     | Reação-difusão, ACO, sensores locais e limiares de tarefas         | ✅ Entregue                                                      |
| 5A–5C | Genética, voo nupcial, fundação física e colônias filhas           | ✅ Entregues · 0.5–0.7                                           |
| 6A–6B | Odor, território, simbioses e mimetismo                            | ✅ Entregues · 0.8–0.9                                           |
| 7A–7C | Granulares, água, calor, gases e suporte do teto                   | ✅ Protótipos entregues · 0.10–0.13; calibração externa pendente |
| 8A–8C | RL, checkpoints e avaliação das previsões                          | ✅ Entregues · 0.14–0.17; avaliação sintética                    |
| 9     | Perfis versionados e proveniência dos parâmetros                   | ✅ Entregue · 0.18; dados calibrados por espécie pendentes       |
| 10A   | Reservas maternas e custos conservativos                           | ✅ Entregue · 0.19 · PR #22                                      |
| 10B   | Tampão físico e reabertura pelas naníticas                         | ✅ Entregue · 0.20 · PR #23                                      |
| 10C   | Fundação semiclaustral com coleta externa da rainha                | ✅ Entregue · 0.23 · PR #26 integrado                            |
| 11A   | Maturação térmica, alimentação e estresse da prole                 | ✅ Entregue · 0.21 · PR #24                                      |
| 11B   | Memória de diapausa, retomada e casulos por perfil                 | ✅ Entregue · 0.22 · PR #25                                      |
| 12    | Seleção local do microclima e da câmara                            | ✅ Protótipos 12A–12C publicados · 0.24–0.26                     |
| 13    | Espermateca, fertilidade e longevidade                             | ✅ Protótipos 13A–13B publicados · 0.27–0.28                    |
| 14    | Ritmo biológico e execução longa entre sessões                     | ✅ Protótipo publicado · 0.29 · PR #39                      |

**Ordem restante:** P0–P5 adicionados pelo usuário. Calibração por espécie depende de dados externos reais e permanece explicitamente aberta.

## 1. Locomoção e estrutura do projeto

- [x] Corpos e câmera apoiados no terreno, incluindo paredes.
- [x] Terreno arredondado e consulta física por campo implícito contínuo.
- [x] Deslocamento limitado, sem saltar diretamente entre apoios.
- [x] Repulsão local, contato antenal e prioridade para alimento/prole.
- [x] Recuo e reconsideração de rotas quando o contato persiste.
- [x] Alargamento local experimental por congestionamento.
- [x] Sensores, forças, contato, superfície e túneis em módulos.
- [x] TypeScript estrito na navegação e Vite para gerar o bundle.
- [ ] Migração gradual de UI e renderização legadas para TypeScript.

Aceite: reprodução pela seed, ausência de NaN, prioridade de carga testada,
apoio correto, fluxo retomado em gargalos e verificação no navegador.

## 2. Túneis vivos

- [x] Abrir o primeiro buraco durante a fundação (5B implementada).
- [x] Escolher frentes de escavação por estímulos locais.
- [x] Retirar porções de terra, carregá-las e depositá-las na superfície.
- [x] Abrir ramificações e câmaras progressivamente.
- [x] Desgaste, erosão, material solto, bloqueios e reparos.
- [x] Resistência simplificada por umidade, profundidade e vão.

Aceite: conservação do material removido, passagem após abertura e recuperação
de um bloqueio reproduzível. O alargamento da etapa 1 não substitui esta etapa.

## 3. Organização e diferenças individuais

- [x] Despensa, lixo e cemitérios afastados da prole.
- [x] Transporte visível de ovos, larvas e pupas; nascimento.
- [x] Trofalaxia conservativa via estômago social.
- [x] Castas com corpos e tarefas diferentes.
- [x] Idade, energia, coragem, atividade e exploração individuais.

Depende de rotas funcionais. Aceite: transferência conservativa, mudança de
tarefas observável e ausência de crescimento sem recursos.

## 4. Campos e tarefas probabilísticas

- [x] Difusão-evaporação numericamente estável.
- [x] Escolha ACO por amostragem e respostas por limiar de estímulo.
- [x] Sensores limitados, memória local e ausência de informação global oculta.

Aceite: testes de dispersão, evaporação, estabilidade e distribuição de escolhas.

## 5. Genética e novas fundações

- [x] Cromossomos, parentesco, cruzamento e mutações registradas.
- [x] Efeitos em corpo, movimento, sensores e resistência.
- [x] Alados, gatilhos ambientais, acasalamento e perda das asas.
- [x] Reservas maternas e naníticas na fundação claustral quando adequada à espécie.

Aceite: parentesco persistido e reprodução consumindo reservas.

## 6. Ecologia e colônias vizinhas

- [x] Pulgões, melaço e proteção; lagartas miméticas.
- [x] Reconhecimento por distância química entre odores.
- [x] Intimidação, fuga, conflito, camuflagem e território.

Aceite: encontros locais, balanço de recursos e resultados dependentes do contexto.

## 7. Física e validação

- [x] Autômatos granulares com massa, atrito e ângulo de repouso.
- [x] Umidade espacial, infiltração, capilaridade e mofo.
- [x] Temperatura, O2, CO2 e ventilação dependente da geometria.
- [ ] Calibração por espécie e comparação com experimentos.

Depende de pesquisa e benchmarks. Não promete simular cada grão real nem
substituir uma análise geotécnica validada.

## 8. Aprendizado, persistência e previsões

- [x] Políticas pequenas de RL, recompensas e comparação com baselines.
- [x] Treino separado da renderização.
- [x] Snapshots, checkpoints, migrações, eventos, métricas e replay.
- [x] Previsões com observações parciais/completas e erro medido por horizonte.

RL depende de sensores, ações, recompensas e física estáveis.

## Histórico das entregas

Os registros abaixo descrevem cada momento do desenvolvimento. Menções antigas a “próximo” ou “pendente” são históricas; a tabela acima e o andamento das etapas 9–14 representam a situação atual.

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

### PRs das entregas, em ordem

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
| 18    | [#18](https://github.com/albreis/viveiro/pull/18) | Checkpoints e recuperação                           |
| 19    | [#19](https://github.com/albreis/viveiro/pull/19) | Previsões canceláveis                               |
| 20    | [#20](https://github.com/albreis/viveiro/pull/20) | Observações e avaliação das previsões               |
| 21    | [#21](https://github.com/albreis/viveiro/pull/21) | Perfis biológicos e parâmetros                      |
| 22    | [#22](https://github.com/albreis/viveiro/pull/22) | Reservas maternas                                   |
| 23    | [#23](https://github.com/albreis/viveiro/pull/23) | Selamento físico da fundação                        |
| 24    | [#24](https://github.com/albreis/viveiro/pull/24) | Maturação térmica da prole                          |
| 25    | [#25](https://github.com/albreis/viveiro/pull/25) | Memória sazonal e casulos                           |

Os PRs #1–#26 desta tabela já foram integrados pelo usuário. Novas entregas continuam com branches próprias. PRs encadeados usam a branch anterior como base. Após integrar cada predecessor, ajuste
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

| Etapa | Nova entrega                                                     | Situação / dependências                   |
| ----- | ---------------------------------------------------------------- | ----------------------------------------- |
| 9     | Perfis biológicos por espécie e proveniência dos parâmetros      | Registro implementado; calibração externa |
| 10    | Fundação, reservas, tampão e estratégia semiclaustral            | ✅ 10A/10B/10C entregues                  |
| 11    | Desenvolvimento térmico da prole, nutrição e diapausa            | 11A/11B publicadas; calibração pendente   |
| 12    | Clima espacial, umidade e seleção local da câmara                | Planejada; 7 e 9                          |
| 13    | Espermateca, fertilidade, envelhecimento e longevidade da rainha | Planejada; 5A/5C, 8 e 9                   |
| 14    | Escala de tempo biológico e experimentos de anos com recuperação | Planejada; 8–13                           |

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
- Espécies calibradas dependem de dados; casulos e diapausa implementados em 11B; fundação semiclaustral segue em 10C.

### 10. Fundação, selamento e orçamento materno

Entrega dividida em 10A (reservas, custos e contabilidade), 10B (tampão e reabertura físicos) e 10C (coleta semiclaustral), cada uma com branch e PR próprios. Perfis numéricos antigos permanecem preservados.

- [x] 10A implementada na branch codex/reservas-maternas, versão 0.19.0: 183/183 testes completos, 14 dirigidos finais, TypeScript/Vite e QA no navegador aprovados. Publicada no mesmo Site privado; PR [#22](https://github.com/albreis/viveiro/pull/22). Ver docs/reservas-maternas.md.
- [x] 10B publicada na versão 0.20.0, branch codex/selamento-fundacao e PR [#23](https://github.com/albreis/viveiro/pull/23): tampão físico conservativo, gases porosos, inspeção e reabertura pelas naníticas. Regressão 190/190 e 16 dirigidos finais aprovados. Ver docs/selamento.md.
- [x] 10C entregue em 0.23.0, PR [#26](https://github.com/albreis/viveiro/pull/26) integrado à main: variante semiclaustral com coleta externa e orçamento conservativo. Cronologia real continua dependente de calibração; não há isolamento térmico ou de umidade do ar calibrado.
- [x] 11A implementada na branch codex/maturacao-e-estacoes, versão 0.21.0: 199/199 testes, build e QA aprovados. Publicada no mesmo Site privado, PR [#24](https://github.com/albreis/viveiro/pull/24); ver docs/maturacao.md. Próximo item: 11B, diapausa e casulos.

- Estender a máquina de estados existente com tampão, isolamento e reabertura pelas naníticas.
- Cronologia dependente de esforço, geometria, temperatura, condição e reservas; término físico da obra.
- Reservas lipídicas/proteicas, histólise muscular quando apropriada, custos de postura e cuidado.
- Aceite: massa do tampão conservada, trocas ambientais alteradas e prole sem recursos gratuitos.

### 11. Maturação e estações

- [x] 11A: mecanismo térmico demonstrativo, alimentação parcial, estresse, perdas e estado individual persistente implementados. Durações por espécie continuam sem calibração externa.
- [x] 11B implementada na branch codex/diapausa-e-casulos, versão 0.22.0: memória endógena, frio acumulado, retomada, abrigo e casulos pagos por perfil. 210/210 testes, build e QA completos aprovados. Publicada no mesmo Site privado; PR [#25](https://github.com/albreis/viveiro/pull/25), fonte 5af4191, tag v0.22.0. Ver docs/sazonalidade.md.

- Investigar ovo–larva 10–14 d, larva–pupa 10–15 d e pupa–adulta 10–24 d.
- Conferir o total sugerido de 35–60 d: a soma das faixas individuais recebidas é 30–53 d.
- Curvas térmicas, alimentação, umidade da câmara, estresse e variabilidade individual.
- Diapausa por espécie/estação, pausa de postura e retomada gradual.
- Aceite: curvas e transições testadas; aquecimento excessivo não acelera indefinidamente a prole.

### 12. Cenários climáticos e engenharia da câmara

- [x] 12A publicada em 0.24.0, PR [#32](https://github.com/albreis/viveiro/pull/32), branch codex/escolha-local-da-camara: sondagem física da rainha, memória de câmaras das cuidadoras e roteiro de aula. Ver [mecanismo e limites](escolha-local.md).
- [x] 12B publicada em 0.25.0, PR [#33](https://github.com/albreis/viveiro/pull/33): estoque por câmara, preferência seca, deterioração local, fluxos e aproximação física para depositar/comer. Ver [estoques por câmara](estoques-por-camara.md).
- [x] 12C publicada em 0.26.0, PR [#34](https://github.com/albreis/viveiro/pull/34), fonte609c26a, tag v0.26.0: índices relativos de argila/compactação para água, calor e suporte. 240/240 testes, build e navegador aprovados. Porosidade fixa e coeficientes demonstrativos, sem calibração geotécnica. Ver [material e limites](solo-material.md).
- [ ] Dependências externas da etapa 12: calibração por material/espécie e revisão docente do roteiro de aula. Não confundir aceite do protótipo com validação científica.

- Usar 52% de umidade e 68% de luz como cenário de investigação, sem deduzir temperatura ou estabilidade diretamente.
- Separar umidade do ar e água no solo, irradiância, temperatura, textura, compactação e suporte.
- Rainha procura umidade/temperatura por sensores locais; prole e sementes requerem condições diferentes.
- Validar as sugestões de 70–80% de umidade, postura em 3–5 d, conversão de luz em calor e aceleração de 25%; não hardcodar como leis.
- Aceite: gradientes físicos, custos e decisões locais observáveis; estabilidade não é garantida por um slider.

### 13. Fertilidade e longevidade

- [x] 13A publicada em0.27.0, PR [#37](https://github.com/albreis/viveiro/pull/37), fonte996d26a/tag v0.27.0: espermateca finita, viabilidade, parentesco, prole haploide após esgotamento e reservatórios independentes de filhas.260 testes completos, build288 módulos e QA/restore aprovados. Múltiplos lotes são suportados, mas o gerador ainda oferece um par por coorte. Ver [modelo e limites](espermateca.md).
- [x] 13B publicada em0.28.0, PR [#38](https://github.com/albreis/viveiro/pull/38), fonte84cad2e/tag v0.28.0: saúde/energia separados, reparo pago, ingestão local da rainha, exposição local, curvas condicionais e mortalidade por causa.274 testes completos,15 dirigidos finais, build301 módulos e QA/restore aprovados. Ver [mecanismos e limites](saude-longevidade.md).
- [ ] Dependências externas13: calibração de sobrevivência/doença por espécie e verificação primária do relato28a8m. Os protótipos não comprovam a faixa15–30 anos.

- Estoque/viabilidade de esperma, uso por ovo e possível contribuição de múltiplos machos.
- Perda de fertilização altera a prole em perfis apropriados, sem morte instantânea da rainha.
- Saúde, reservas, danos, idade, doença e risco de morte separados; custo da postura com hipótese explicitada.
- Investigar vida de 15–30 anos e a alegação histórica de 28 anos e 8 meses, sem tratá-las como universais ou confirmadas.
- Aceite: balanço espermático, parentesco, curvas de sobrevivência e desfechos emergentes testados.

### 14. Ritmo biológico e execução longa

- [x] Mecanismos publicados em0.29.0, PR [#39](https://github.com/albreis/viveiro/pull/39), fonte df92cc3/tag v0.29.0: relógio persistido, avanço cooperativo, cancelamento, orçamento e destino recuperável.284 testes completos,18 dirigidos finais, build308 módulos e QA/restore aprovados. Ver [ritmo e limites](ritmo-e-continuidade.md).

- Oferecer perfil de 1 minuto real por dia simulado e outros ritmos; separar relógio biológico de estabilidade numérica.
- Exemplo: 365 dias = 6 h 5 min; 30 anos = 182,5 h nessa escala, sem obrigar o navegador a ficar aberto todo esse tempo.
- Checkpoints, migração, recuperação, avanço offline definido e comparação de execuções aceleradas.
- Execução contínua em servidor é requisito futuro com custo e limites explícitos; o Site atual avança no navegador.
- Aceite: continuidade entre sessões e resultados equivalentes sob aceleração para ações nos mesmos instantes biológicos.

## Passos futuros para ultrapassar concorrentes

🔧 FaseP0 iniciada após entregar12–14 e revisar o núcleo. P0.2 já estava concluído no lote anterior; P0.1 foi publicada em0.29.1/PR #40. P0.3 também foi entregue; os demais itens continuam pendentes. Ver [revisão do núcleo](revisao-nucleo-2026-11.md). A ordem abaixo é proposta para levar o Viveiro ao primeiro lugar em uso educacional, em escolas e universidades, frente a NetLogo, GAMA, Mesa, PhET, Avida-ED e simuladores comerciais. As notas são avaliações editoriais, não medições; servem para priorizar trabalho, não como afirmação pública de superioridade.

### Situação do ranking

| Contexto      | Líder atual  | Viveiro hoje | Só etapas 10C–14 | Etapas 10C–14 e P0–P2 | Após P3   |
| ------------- | ------------ | ------------ | ---------------- | --------------------- | --------- |
| Universidades | NetLogo 8,50 | 6,05 (6º)    | 6,40 (5º)        | 8,30 (2º)             | 8,90 (1º) |
| Escolas       | PhET 8,70    | 6,70 (2º)    | 6,85 (2º)        | 9,10 (1º)             | 9,25 (1º) |

Pesos em universidades: rigor e transparência 20%, reprodutibilidade 15%, validação e literatura 15%, aluno estende o modelo 15%, acesso e custo 10%, engajamento visual 10%, material didático e comunidade 15%. Pesos em escolas: engajamento visual 20%, facilidade de uso 20%, material didático 20%, acesso e hardware 15%, rigor conceitual 15%, português 10%.

As etapas 10C–14 aprofundam o modelo, que já é o ponto forte. As maiores lacunas são validação, extensibilidade e material didático. Conforme a orientação mais recente do usuário, P0–P4 serão executados depois das pendências anteriores 12–14 e da revisão do núcleo. As dependências técnicas entre os novos itens continuam registradas abaixo.

### Ordem

1. ✅ Etapas12–14 entregues como protótipos; revisão do núcleo concluída e documentada. A10C está integrada. Calibração científica permanece pendente.
2. P0 — projeto reutilizável, com P0.2 já concluído.
3. P1 — modo escola.
4. P2 — ferramenta de pesquisa.
5. P3 — validação científica, com dados e revisões externas.
6. P4 — comunidade, após o início da fase educacional.
7. P5 — clima real da localização do usuário, por último.

Esta ordem substitui a proposta anterior de executar P0/P1 em paralelo às etapas 12–14. Rankings continuam sendo projeções editoriais; a entrega de itens não comprova superioridade sobre concorrentes.

Cada passo segue as regras do projeto: branch própria com prefixo codex/, PR em ordem de dependência, testes do modelo, verificação no navegador, tag e publicação.

### P0. Projeto público e reutilizável

- [x] P0.1 publicada em0.29.1, PR [#40](https://github.com/albreis/viveiro/pull/40), fonte fc31dd5/tag v0.29.1: MIT para código original, CC BY4.0 para documentação/imagens originais, campo license e página de avisos. Third-party integral preservado, exceções explícitas, README e recursos de terceiros documentados. Página/avisos e build308 módulos conferidos no navegador; README e licença estão no PR. Nenhuma alteração na audiência privada.
- [x] P0.2 Integrar os PRs encadeados na main, em ordem, ajustando a base do seguinte a cada integração. Concluído em 01/11/2026: PRs #1 a #27 integrados com commits de merge, branches preservadas, main na 0.23.0 com 217/217 testes. Tag v0.23.0 preserva a fonte publicada ee34b75. Merges #28/#29 e kit de divulgação recebidos na sincronização da main 93e28d1.
- [x] P0.3 entregue em0.30.1/PR [#41](https://github.com/albreis/viveiro/pull/41): [Site público separado](https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/), com URLs /releases/v0.30.0/ e /releases/v0.30.1/. Acesso sem login, versão real e QA3D/Workers/arquivos conferidos. O Site original segue privado. Ver [processo e limites](publicacao-por-tag.md).
- [ ] P0.4 CITATION.cff e DOI por release via Zenodo. Aceite: "Cite this repository" e DOI da release atual.
  - [x] P0.4A: CFF 1.2.0 válido, autoria coletiva da licença, fonte/tag 0.31.0 exata (atualizada após a entrega deP1.1A); rascunho de metadados e gerador de ZIP selecionado, com manifesto/hashes e testes de integridade/reprodução. Ver [citação e depósito](citacao-e-deposito.md).
  - [ ] P0.4B: conta autenticada responsável, revisão e depósito de produção no Zenodo; conferir DOI resolvendo e incorporá-lo aos metadados. Nenhum DOI emitido.
  - [ ] P0.4C: após o PR chegar à branch padrão, conferir o botão do GitHub. Não concluído só por abrir PR.
  - A dependência externa de P0.4B não impede avançar P1; repo original e Site original continuam privados.

### P1. Modo escola

- [ ] P1.1 Perfil de desempenho leve: menos agentes e instâncias, malha mais grossa, previsão parcial por padrão. Aceite: 30 quadros/s ou mais em Chromebook ou notebook de entrada, medido e documentado, com o mesmo modelo e seed.
  - [x] P1.1A publicada em0.31.0, PR [#43](https://github.com/albreis/viveiro/pull/43): seletor leve/completo, limite apenas visual de80 operárias com prioridade de câmera/seleção, malha reduzida no mesmo campo, sombras opcionais, previsão por contagem e medidor local. Seed, população e modelo preservados. Ver [implementação e medição local](perfil-leve.md).
  - [ ] P1.1B: ensaio em equipamento escolar identificado, em movimento e sob carga maior. A medição local com14 adultos pausados não certifica esse aceite.
- [ ] P1.2 Tour de primeira visita em módulo próprio de src/app. Aceite: aluno novo entra em primeira pessoa em menos de 2 minutos sem ajuda.
  - [x] P1.2A: guia com teclado/mouse, pular/reabrir, oferta inicial sem interromper saves existentes, controle destacado e confirmação real da primeira pessoa. Módulos pequenos em TS,22 testes dirigidos e QA em origem de primeira visita. Ver [tour](tour-primeira-visita.md).
  - [ ] P1.2B: ensaio com participante novo em até2min; não realizado nesta entrega.
- [ ] P1.3 Experimentos de um clique (seed, parâmetros, câmera e pergunta): feromônio com e sem vento; ângulo de repouso 15° × 55°; uma × duas entradas e ventilação; prole em solo frio × quente; claustral × semiclaustral; mesma seed com uma intervenção diferente; herança. Aceite: abre em menos de 10 s e tem teste do estado inicial.
- [ ] P1.4 Guia do professor em docs/ensino/: objetivo, tempo, passos, perguntas, gabarito e "o que o modelo não representa", associado à BNCC de Ciências da Natureza. Aceite: 6 roteiros revisados por professores de biologia e física.
- [ ] P1.5 PWA com cache offline, aproveitando o IndexedDB existente. Aceite: abre e salva checkpoint sem rede.
- [ ] P1.6 Exportação CSV diária (população, prole, alimento, temperatura, gases) e acessibilidade WCAG 2.1 AA. Aceite: CSV abre em planilha; Lighthouse de acessibilidade acima de 90.
- [ ] P1.7 Piloto com 2 ou 3 turmas, questionário SUS e pré/pós-teste curto. Aceite: SUS médio acima de 70 e relatório em docs/ensino/.

### Etapas do cronograma que entram no plano

- [x] 10C: PR #26 integrado; 0.23.0 publicada no Site privado, tag e situação atualizadas.
- [x] 12: mecanismos12A–12C publicados, com roteiro de aula em docs/ensino/microclima-local.md. Revisão docente e calibração continuam abertas.
- [x] 13: protótipos13A–13B publicados em0.27–0.28. Calibração científica exigida porP3.2 ainda pendente.
- [x] 14: ritmo persistido e avanço headless no navegador publicados em0.29. A CLI deP2.2 continua pendente; não existe servidor contínuo.

### P2. Ferramenta de pesquisa

- [ ] P2.1 docs/odd.md no protocolo ODD (Overview, Design concepts, Details), reunindo equações, ordem do loop, escalas e variáveis de estado. Aceite: um submodelo reimplementável só pelo ODD.
- [ ] P2.2 Linha de comando sem interface: seed, dias, parâmetros e saída em CSV com manifesto. Aceite: arquivos idênticos byte a byte entre navegador e Node para a mesma seed.
- [ ] P2.3 Varredura de parâmetros e réplicas em paralelo com retomada, equivalente ao BehaviorSpace. Aceite: 5 valores × 10 réplicas em um comando.
- [ ] P2.4 Análise de sensibilidade (Morris) em docs/sensibilidade.md com dados brutos. Aceite: os 10 parâmetros mais influentes, que orientam P3.2.
- [ ] P2.5 API tipada de extensões para políticas de decisão, sensores e submodelos (DecisionPolicy, SensorSystem). Aceite: política nova em um arquivo, testada e comparada com ACO na linha de comando.
- [ ] P2.6 Editor de parâmetros com unidade, faixa e fonte do catálogo, salvo como perfil versionado. Aceite: exportar, reimportar e reproduzir por seed.
- [ ] P2.7 Interface e documentação em inglês, mantendo português como padrão. Aceite: nenhuma tela com texto fixo no código.
- [ ] P2.8 Instruções em português para uma formiga. Depende de P2.5. Detalhes abaixo.

#### P2.8 Instruções em português para uma formiga

O usuário escreve um pedido para uma formiga; um modelo de linguagem propõe uma regra numa linguagem de fórmulas fechada; o simulador valida, mostra, salva e aplica só àquela formiga. A IA nunca escreve código executável.

- Entradas: somente sensores locais existentes (cheiro, CO₂, O₂, temperatura e água do solo, carga, energia, contato).
- Saídas: somente parâmetros de decisão (peso das saídas, limiares de tarefa, preferência de câmara, exploração). Nunca posição, recursos ou mapa global.
- Limites com nome definidos pelo modelo e registrados no catálogo (co2_alto, temperatura_alta, solo_encharcado...), em vez de números escolhidos pela IA.
- Interpretador próprio em TypeScript, sem eval; rejeita sensores inexistentes, fórmulas grandes, valores fora da faixa, divisão por zero e NaN.
- Teste de efeito: a fórmula é avaliada em situações típicas e na borda da faixa normal; cada sensor declarado precisa alterar o resultado. Falha gera uma nova tentativa com a mensagem do validador.
- A explicação mostrada ao usuário é gerada pelo código a partir da fórmula, não pela IA.
- O save guarda fórmula, pedido, modelo, versão e tick, como intervenção. O replay nunca chama a IA.
- A regra entra no catálogo como hipótese gerada por IA, não como comportamento biológico.
- Nenhuma credencial no repositório ou no bundle; o modelo fica atrás de um endpoint com token, fila, limite por usuário e cache de pedidos repetidos.

Ordem: linguagem e validador; regras escritas à mão com save e replay; endpoint do modelo; painel na primeira pessoa com comparação pela mesma seed; testes de conservação, ausência de leitura global e replay idêntico.

Modelo local avaliado em novembro de 2026, num VPS de 8 vCPUs AMD EPYC (AVX-512) com 3 núcleos reservados, Ollama, quantização de 4 bits e temperatura zero. Com esquema JSON, padrões de fórmula e exemplos, Qwen3 4B (sem modo de raciocínio) usou o padrão correto e explicação coerente; Qwen2.5 3B gerou fórmulas válidas mas com comportamento errado. Geração entre 8 e 17 tokens/s conforme a carga do servidor; carregamento de 7 a 25 s quando o modelo não está em memória. Foram poucas instruções: antes de escolher, executar um conjunto de 30 a 50 instruções com situações esperadas, várias repetições, taxa de acerto, tempo médio e pior tempo.

### P3. Validação científica

- [ ] P3.1 Espécie com dados de laboratório compatível com os mecanismos existentes (por exemplo Lasius niger: claustral, diapausa, casulo) e parceria com laboratório de mirmecologia. Aceite: acordo e conjuntos de dados com licença de uso.
- [ ] P3.2 Calibração orientada a padrões (POM) com 3 ou mais padrões observados, ajustando só os parâmetros apontados em P2.4. Depende das etapas 13 e 14. Aceite: perfil calibrado no catálogo com fonte, amostra e incerteza.
- [ ] P3.3 Validação com dados reservados antes da calibração, pelo protocolo de avaliação de previsões existente. Aceite: MAE e cobertura contra dados reais em docs/validacao.md, publicados mesmo se desfavoráveis.
- [ ] P3.4 Publicação: Journal of Open Source Software, preprint do modelo calibrado e relato do piloto escolar. Aceite: JOSS aceito e preprint disponível.

### P4. Comunidade

- [ ] P4.1 GitHub Discussions, CONTRIBUTING.md com as regras deste projeto, modelos de issue e rótulo de primeira tarefa. Aceite: primeira contribuição externa integrada.
- [ ] P4.2 Galeria pública de experimentos reproduzíveis por seed. Aceite: 20 experimentos, metade de fora da equipe.
- [ ] P4.3 Oficinas para professores e minicursos em congressos. Aceite: uma por semestre, com gravação publicada.

### Prioridade com pouco tempo

Concluir primeiro 12–14, conforme orientação atual do usuário. Depois priorizar P0.1–P0.3, P1.1, P1.3 e P1.4. A 10C está entregue; P3 depende de dados externos e das ferramentas de pesquisa.

### P5. Clima real da localização do usuário — por último

⬜ Planejado para depois de todos os passos anteriores, inclusive P3 e P4. Depende da etapa 14 para a série diária.

Usar o clima de um lugar e de uma data reais como cenário do terrário. O ganho é didático (estação, hemisfério, fotoperíodo e diapausa) e de engajamento. Não torna a biologia mais realista: os parâmetros das formigas continuam genéricos e devem ser apresentados como "terrário ao ar livre na sua cidade", não como simulação das formigas daquele lugar.

| Parâmetro do modelo | Dado do serviço de clima      | Conversão                                 |
| ------------------- | ----------------------------- | ----------------------------------------- |
| humidity            | umidade relativa              | direta                                    |
| temperatureC        | temperatura do ar a 2 m       | direta                                    |
| windX, windZ        | velocidade e direção do vento | decomposição nos eixos e escala do modelo |
| light               | radiação solar (W/m²)         | aproximação registrada no catálogo        |
| photoperiodHours    | duração do dia                | direta                                    |
| pulso de chuva      | precipitação                  | escala do modelo, registrada no catálogo  |

Serviço sugerido: Open-Meteo, sem chave e com arquivo histórico; conferir os termos de uso antes de qualquer uso comercial.

- [ ] P5.1 Clima inicial: ao criar o terrário, escolher "minha localização", "escolher cidade" ou "padrão"; os valores do dia viram condições iniciais, como o perfil de ar de referência. Aceite: valores brutos, convertidos, fonte, data e localização arredondada gravados no experimento.
- [ ] P5.2 Reprodutibilidade: buscar uma vez e guardar o dado, nunca o pedido; o replay usa os valores gravados e não consulta o serviço. Aceite: mesma seed e mesmos dados gravados produzem o mesmo futuro, sem rede.
- [ ] P5.3 Privacidade e acesso: permissão explícita de localização, coordenadas arredondadas ao nível de cidade, escolha manual obrigatória (navegadores escolares bloqueiam localização) e queda para o padrão sem internet, com aviso. Aceite: nenhuma coordenada exata salva ou exportada.
- [ ] P5.4 Conversões no catálogo de parâmetros como aproximações, com unidade, fonte e limites. Aceite: cada conversão visível no catálogo.
- [ ] P5.5 Série diária com dados históricos de um período fixo, seguindo o clima dia a dia. Depende da etapa 14. Aceite: série gravada no experimento e replay idêntico.
- [ ] P5.6 Temperatura e umidade do solo do serviço para inicializar a grade de água e calor. Aceite: inicialização conservativa e documentada.
- [ ] P5.7 Experimento de aula pronto: mesma seed em cidades e hemisférios diferentes na mesma data. Aceite: roteiro no guia do professor (P1.4).
