# Versões

## 0.29.0 — Ritmo e continuidade

- Ritmos persistidos de10 s,1 min,5 min e1 h por dia, sem alterar os passos biológicos.
- Dívida de processamento conservada e indicada quando o navegador fica atrás do ritmo nominal.
- Avanço explícito em Worker, com checkpoint anterior, orçamento, cancelamento e retomada do destino salvo.
- Replay e cenários A/B usam os mesmos passos nos modos visível e sem renderização.
- Não há avanço automático com a página fechada ou servidor contínuo. Ver docs/ritmo-e-continuidade.md.

## 0.28.0 — Saúde, riscos e longevidade

- Perfil opcional separa energia, ferimentos, carga infecciosa, riscos por idade/doença e fertilidade.
- Rainha consome estoque fisicamente acessível; reparo corporal paga nutrientes.
- Exposição local por contato e resíduos, memória fisiológica e mortalidade por causa persistentes.
- Curvas condicionais explícitas, desafio experimental e catálogo de parâmetros demonstrativos.
- Sem limite universal de vida da rainha; calibração por espécie permanece aberta.

## 0.27.0 — Espermateca finita e parentesco

- Perfil opcional com lotes reprodutivos por macho, perdas de viabilidade e débito por ovo fecundado.
- Pai efetivo no genoma e registro do ovo; esgotamento produz machos haploides sem matar instantaneamente a rainha.
- Reservatórios independentes das filhas e guardas de recuperação; sem recarga após o pouso.
- Créditos e taxas demonstrativos; geração de parceiros ainda limitada a um par por coorte. Ver docs/espermateca.md.
- Incorpora as correções publicadas de bordas e aranhas.

## 0.26.2 — Aranhas saem da vegetação

- Aproximação aos pulgões com distância de trabalho e desistência temporária, corrigindo a oscilação infinita no centro de árvores e arbustos.
- Desvio de caules acompanha a biomassa; copas e folhagem não viram paredes.
- Recuperação por progresso líquido, saída gradual de sobreposições e de entradas surgidas sob o predador.
- Memória de caça persistente, validação de saves e testes de continuidade.

## 0.26.1 — Bordas reais das entradas

- Removida a argola decorativa que não acompanhava o relevo nem a escavação. A borda passa a ser a própria malha do solo.
- Amostragem alinhada aos centros das entradas, às faces do vidro e à camada superficial; detalhamento extra limitado para bocas estreitas.
- Regressão por raycast de abertura pequena entre células e entradas nos quatro lados. Sem alterar física, escavação, seed ou saves.

## 0.26.0 — Composição e compactação do solo

- Perfil opcional com índices relativos de argila e compactação para transporte de água, calor e suporte do teto.
- Referência neutra preserva o modelo anterior; fluxos conservativos e controles registrados no replay.
- Catálogo, parâmetros compartilhados e validação de saves; perfis climáticos separados em módulo próprio.
- Volume de poros fixo e coeficientes sem calibração geotécnica. Ver docs/solo-material.md.

## 0.25.0 — Estoques por câmara

- Perfil opcional com lotes alimentares, entradas e retiradas conservativos por colônia.
- Preferência por câmaras secas conhecidas e deterioração no ponto do lote.
- Depósitos e refeições diretas exigem presença física; guarda contra energia gratuita e transferências através do solo.
- Marcadores agregados, painel, catálogo e recuperação do habitat compartilhado.
- Etapa 12B; materiais/textura/compactação continuam na 12C.

## 0.24.0 — Sondagem e memória local de câmaras

- Perfil opcional com exploração física da rainha antes da escavação.
- Sensores rasos, memória de pontos visitados e custos explícitos.
- Cuidadoras comparam somente câmaras conhecidas; transporte mantém o destino climático.
- Catálogo e persistência próprios, sem atualizar os perfis anteriores.
- Primeira parte da etapa 12; estoque espacial e materiais ainda pendentes.

## 0.23.0 — Fundação semiclaustral

- Perfil separado com entrada aberta e rainha coletora por sensores locais.
- Viagens físicas, carga finita, risco de predadores e primeira postura paga com alimento entregue.
- Despensa externa separada dos tecidos iniciais, transferência conservativa e save em viagem.
- Catálogo específico e contadores; genéricos anteriores preservados.
- Modelo e limites em docs/fundacao-semiclaustral.md.

## 0.22.0 — Memória sazonal e casulos

- Perfis sazonais com preparação, diapausa reprodutiva, frio acumulado e retomada gradual.
- Fotoperíodo de referência, repouso no abrigo e demanda reduzida de recursos e oxigênio.
- Casulos pagos antes da pupação, resíduos após emergência e variante de pupa nua.
- Contadores e inspeção da prole; memória e pagamentos persistentes, com perfis antigos preservados.
- Coeficientes demonstrativos e limites em docs/sazonalidade.md.

## 0.21.0 — Maturação térmica local

- Revisão biológica 4: crescimento por estágio com temperatura local e água no solo como proxy explícito.
- Larvas avançam conforme a fração de alimento paga; estresse persistente, recuperação e perdas sem reembolso.
- Variação individual/genética determinística, sensores na portadora e saves versionados.
- Painel, cores de estresse e parâmetros demonstrativos no catálogo; perfis antigos preservados.
- Métodos e limites em docs/maturacao.md; diapausa/casulos seguem para 11B.

## 0.20.0 — Selamento físico da fundação

- Revisão biológica 3: rainha recolhe terra, fecha a entrada por dentro e nanítica reabre transportando o material para fora.
- Tampão no campo de colisão, na navegação e na circulação porosa de gases.
- Balanço global da terra, validação de recuperação e peça analítica arredondada no renderer.
- Inspeção da entrada pela câmera; perfis antigos preservados.
- Coeficientes exploratórios e limites em docs/selamento.md.

## 0.19.0 — Reservas maternas

- Revisão biológica 2 com reservas separadas de lipídio, proteína e músculo.
- Histólise após perda das asas, custos proteicos da prole e escavação autorizada antes da geometria.
- Balanços por componente, validação de saves e versões anteriores preservadas.
- Catálogo com cinco coeficientes explícitos e registro da fundação na interface.
- Modelo demonstrativo e limites em docs/reservas-maternas.md.

## 0.18.0 — Perfis e proveniência biológica

- Catálogo versionado de aproximações, hipóteses, condições de laboratório e medidas.
- Seleção para novos terrários e preset opcional limitado ao clima de referência.
- Identidade do perfil em snapshots/replay e cópia independente nas colônias filhas.
- Saves legados preservados; versão de perfil desconhecida protege a gravação.
- Dados não calibrados e dependências em docs/perfis-biologicos.md.

## 0.17.0 — Observação e avaliação das previsões

- Modo por contagem e histórico, com transporte que exclui o estado interno.
- Extrapolação identificada e fallback de persistência quando faltam censos.
- Ensaio reservado com estado completo, contagem e base constante em1/3/7dias.
- Erro absoluto, RMSE, viés, cobertura, largura e custo registrados em JSON.
- Painel de métricas e protocolo reproduzível; limites em docs/avaliacao-previsoes.md.

## 0.16.0 — Previsões canceláveis

- Cálculo em fatias com progresso e pausas no Worker.
- Cancelamento e descarte de resultados obsoletos após intervenções/recuperação.
- Horizonte, número de futuros e limite de trabalho configuráveis.
- Encerramento explícito por orçamento; intervalos incompletos rotulados como provisórios.
- Mesmo modelo completo e ensemble anterior; limites em docs/previsoes.md.

## 0.15.0 — Checkpoints e recuperação

- Save assíncrono em IndexedDB, confirmação atômica e cópia local de emergência.
- Checkpoints nomeados, oito automáticos recentes e recuperação em pausa.
- Importação validada de JSON antigo/v2 com cópia do estado anterior.
- Habitat compartilhado compactado sem perder recursos e cérebros individuais.
- Save legado intocado; limites de armazenamento e recuperação em docs/persistencia.md.

## 0.14.0 — Aprendizado individual opcional

- Rede pequena com observações locais e ajustes separados por formiga.
- Treino em Worker, avaliação reservada e comparação com ACO/rede sem treino.
- Política aplicável por intervenção validada; retorno a ACO e replay.
- Pesos, transições e contadores persistidos; leitura na formiga e relatório após recarga.
- Limites de transferência e calibração em docs/aprendizado-local.md.

## 0.13.0 — Suporte local dos túneis

- Geometria de teto, vão, espessura e apoio ligados ao campo físico da escavação.
- Carga/capacidade por água, atrito e integridade; dano e desprendimento de agregados.
- Volume sólido discretizado conservado, queda granular e reparo pelas operárias.
- Fissuras, estado estrutural, câmera de inspeção e persistência.
- Aproximação exploratória com dependências reais em docs/suporte-estrutural.md.

## 0.12.0 — Gases e ventilação

- O₂/CO₂ por câmara, difusão/advecção conservativas, vento e empuxo térmico.
- Geometria, entulho e escavação alteram volumes e resistências com balanços.
- Custos e decisões por sensores de ar locais; água do solo no desgaste e estoque.
- Painel, diagrama e leitura de ar da formiga; saves e duas colônias preservados.
- Modelo exploratório e dependências experimentais em docs/gases-e-ventilacao.md.

## 0.11.0 — Água e calor no solo

- Campo 3D procedural com água nos poros e temperatura, independente da umidade do ar.
- Fluxos locais conservativos, infiltração, drenagem, evaporação, lagos e plantas com balanços.
- Referência de temperatura do ar e propagação gradual do calor solar.
- Plantas/materiais leem condições próximas; formiga acompanhada mostra o entorno.
- Mapas em corte, snapshots e campo global compartilhado entre colônias.
- Modelo reduzido exploratório; gases e suporte estrutural continuam pendentes.

## 0.10.0 — Terra solta dinâmica

- Agregados com gravidade, velocidade, contato dissipativo e atrito de Coulomb.
- Controle experimental do ângulo de repouso, persistência e replay.
- Queda a partir do teto, apoio no mesmo campo físico e reparo conservativo pelas operárias.
- Instâncias móveis fora da malha estática; depósitos visuais acompanham a altura real.
- Testes de inclinação, queda, momento, estabilidade e restauração.
- Etapa 7 parcial: capilaridade/gases e suporte estrutural continuam em 7B/7C.

## 0.9.0 — Simbioses e mimetismo

- Pulgões associados a plantas, com custo de seiva, melaço, coleta e perdas contabilizadas.
- Defesa contextual das hospedeiras e predação local.
- Lagartas de odor compatível podem ser levadas fisicamente ao berçário e receber alimento existente.
- Reserva metabólica, recusas, morte da transportadora, snapshots e prioridade de carga.
- Painel ecológico, corpos/gotas visíveis e aproximação da câmera para observar as relações.
- Novas etapas 9–14 de biologia, clima, longevidade e tempo longo documentadas sem alterar timers atuais.

## 0.8.0 — Odores e território

- Perfis químicos por colônia e máscaras temporárias no corpo.
- Encontros locais com intimidação, recuo apoiado, ferimentos e defesa contextual.
- Campo territorial com difusão/evaporação conservativas e cores por colônia.
- Camuflagem exploratória e infiltração com transporte físico de alimento existente.
- Tratamento de odor pelo usuário, diário, anéis de contato e persistência.
- Módulos TypeScript pequenos, testes de recursos/apoio/restore e referências com limites explícitos.

## 0.5.0 — etapa genética 5A

- Genomas digitais persistentes, duas cópias nas fêmeas e uma nos machos.
- Recombinação, mutações reproduzíveis e parentesco preservado do ovo ao adulto.
- Efeitos limitados em corpo, locomoção, sensores, metabolismo e tarefas.
- Indicador de geração, pais e mutações na seleção da formiga.
- Migração de saves sem alterar atributos existentes ou inventar ascendência.
- Voo nupcial e novas fundações permanecem na etapa 5B.

## 0.4.0

- Paisagem e ninho procedurais por seed, com conectividade e lados variáveis.
- Oito tipos de plantas, lagoas, relevo suave, pedras e três formatos de tronco.
- Respostas de vegetação, água e materiais à umidade, luz e chuva.
- Escavação em 3D com curvas, novas frentes e aberturas físicas junto aos vidros.
- Vistas dos quatro lados e modo de observação dos túneis internos.
- Correção de faces sobrepostas nas pontas da madeira e interpolação das aranhas.
- Túneis vivos, transporte de terra, depósitos, erosão exploratória e reparos.
- Prole, lixo, castas, personalidade, idade e trofalaxia conservativa.
- Reação-difusão, ACO, tarefas por limiares e navegação por sensores e memória locais.
- Recuperação em gargalos e inibição de ciclos curtos entre frentes próximas.
- Projeto no disco G, módulos pequenos e malha do solo em Worker.
- Novas seeds usam a geração; saves antigos preservam sua geometria.
- Genética, novas fundações, simbioses, física granular e RL seguem no cronograma.

## 0.3.0

- Terreno arredondado por campo implícito e malha ajustada à mesma superfície.
- Movimento tangente, apoio contínuo e limite de deslocamento por passo.
- Regressões para saltos, afastamento do solo e limites do vidro.
- Forças sociais locais, contato antenal, carga, recuo e alargamento experimental.
- Apoio no piso/parede e câmera orientada pela superfície.
- TypeScript estrito na navegação e controles de câmera; módulos legados isolados.
- Bundle Vite e CSS/renderer separados por responsabilidade.
- Cronograma, especificações e arquitetura registrados.

## 0.2.1

- Duplo clique em uma formiga visível entra em primeira pessoa; Esc retorna à câmera externa.
- Seleção considera a oclusão pelo solo e uma tolerância para organismos pequenos.
- Pernas acompanham a distância percorrida; a pausa congela o movimento.
- Operárias e aranhas contornam a água em vez de insistir na direção bloqueada.
- Estado de pausa preservado ao recarregar e indicação explícita para retomar.

## 0.2.0

- Cavidades reais no solo, entradas, túneis e câmaras junto ao vidro.
- Operárias percorrem o subsolo para entregar alimento e sair do ninho.
- Vista lateral e câmera em primeira pessoa pela lista de formigas.

## 0.1.0

- Primeiro terrário 3D autônomo e previsão por cenários.
