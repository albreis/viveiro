# Versões

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
