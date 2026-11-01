# Cronograma de entregas

Atualizado em 31/10/2026. Cada etapa tem branch própria, testes, publicação
no mesmo Site privado e registro de limitações. As próximas entregas dependem
dos testes e do feedback; não há datas artificiais de conclusão.

| Etapa | Entrega                                                              | Situação               |
| ----- | -------------------------------------------------------------------- | ---------------------- |
| 0     | Terrário, reprodução, previsões, túneis e primeira pessoa            | Publicada: v0.2.1      |
| 1     | Navegação social 3D, piso, colisões, recuo, TypeScript e Vite        | Versão 0.3.0           |
| 2     | Escavação orgânica, transporte de terra, erosão, bloqueios e reparos | Em desenvolvimento     |
| 3     | Estoques, lixo, prole, trofalaxia, castas, personalidade e idade     | Protótipo implementado |
| 4     | Reação-difusão, ACO e limiares de estímulo                           | Protótipo implementado |
| 5     | Genética, voo nupcial e fundação de novas colônias                   | Planejada              |
| 6     | Simbioses, odor, território e colônias vizinhas                      | Planejada              |
| 7     | Solo granular, capilaridade, termodinâmica e gases                   | Pesquisa e calibração  |
| 8     | RL, persistência longa e avaliação das previsões                     | Planejada              |

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

- Abrir o primeiro buraco durante a fundação.
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

| Ordem | PR                                              | Entrega                                   |
| ----- | ----------------------------------------------- | ----------------------------------------- |
| 1     | [#1](https://github.com/albreis/viveiro/pull/1) | Recuperação nas paredes e migração para G |
| 2     | [#2](https://github.com/albreis/viveiro/pull/2) | Túneis vivos, terra e reparos             |
| 3     | [#3](https://github.com/albreis/viveiro/pull/3) | Organização e alimentação da colônia      |
| 4     | [#4](https://github.com/albreis/viveiro/pull/4) | Reação-difusão, ACO e tarefas             |
| 5     | [#5](https://github.com/albreis/viveiro/pull/5) | Sensores locais e memória                 |
| 6     | [#6](https://github.com/albreis/viveiro/pull/6) | Terrário procedural e ecologia dinâmica   |

Os PRs usam a branch anterior como base. Após integrar cada predecessor, ajuste
a base do próximo para main. Branches antigas já incorporadas não recebem PRs
vazios. A branch de genética ainda não tem mudanças próprias e terá PR quando
a implementação da etapa 5 estiver concluída. Novas etapas seguem este fluxo
automaticamente.

### Publicação e recuperação

- 0.4.0 publicada em 31/10/2026 no mesmo Site privado.
- Fonte publicada: ec9815c20b81de46039b97172cb610287b4e994b.
- Tag de recuperação: v0.4.0, apontando exatamente para a fonte publicada.
- PRs #1 a #6 continuam abertos e encadeados para revisão.
- Dev mantido em G:\Projetos\viveiro, em http://127.0.0.1:4173/.
