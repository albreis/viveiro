# Arquitetura e persistência

## Organização

| Pasta                  | Responsabilidade                                  |
| ---------------------- | ------------------------------------------------- |
| src/app                | Orquestração e apresentação da interface          |
| src/modules/simulation | World e passo biológico fixo                      |
| src/modules/navigation | Tipos, sensores, forças, contato e locomoção      |
| src/modules/terrain    | Consultas de apoio e geometria compartilhadas     |
| src/modules/renderer   | Cena, ambiente, corpos, plantas, câmera e seleção |
| src/services           | Persistência e serviços externos                  |
| src/workers            | Previsões e tarefas fora da renderização          |
| src/styles             | CSS por componente e breakpoint                   |
| public                 | Recursos e licenças                               |
| tests                  | Invariantes e cenários reproduzíveis              |
| dist                   | Bundle gerado; sem edição manual                  |

A navegação usa TypeScript estrito. UI, biologia e renderização legadas ficam
temporariamente em JavaScript durante a migração incremental. allowJs não
aplica checagem estrita a esses arquivos. Não usar ts-nocheck para mascarar
uma migração incompleta.

## Componentes planejados

| Componente         | Função                                     |
| ------------------ | ------------------------------------------ |
| SimulationEngine   | Relógio, ordem dos sistemas e seeds        |
| WorldState         | Dados serializáveis; sem objetos Three.js  |
| ColonyState        | Rainha, odor, reservas e parentesco        |
| AgentState         | Corpo, idade, energia, genes e memória     |
| SensorSystem       | Percepção local limitada                   |
| DecisionPolicy     | ACO, limiares e escolha estocástica        |
| SocialNavigation   | Desejo, repulsão, contato, carga e recuo   |
| SurfaceConstraint  | Apoio e não penetração                     |
| PheromoneField     | Deposição, difusão e evaporação            |
| SoilSystem         | Escavar, transportar, sustentar e colapsar |
| MoistureSystem     | Infiltração, umidade e capilaridade        |
| AtmosphereSystem   | Temperatura, O2, CO2 e ventilação          |
| BroodSystem        | Transporte, alimentação e desenvolvimento  |
| NutritionNetwork   | Estômago social e trofalaxia               |
| GeneticsSystem     | Herança, mutação e fenótipo                |
| EcologySystem      | Presas, predadores, plantas e simbioses    |
| ExperimentRunner   | Réplicas, observações, previsão e erro     |
| SnapshotRepository | Checkpoints, integridade e migrações       |
| ScenePresenter     | Three.js e interpolação visual             |

Políticas podem ser compartilhadas; estados e sensores permanecem individuais.
Não criar uma rede neural pesada separada para cada formiga.

## Loop implementado

O passo fixo e a ordem atual de colonies/update.ts estão descritos na [revisão do núcleo](revisao-nucleo-2026-11.md). Cada dia tem100 passos; a sequência dos sistemas é parte do modelo versionado. A ordem inclui atualizações sequenciais e não deve ser interpretada como física simultânea.

O relógio de sessão e o avanço em Worker usam a mesma função stepSession, que aplica intervenções antes do passo e avança os cenários A/B juntos. [Ritmo e continuidade](ritmo-e-continuidade.md) registra fórmulas, dívida de processamento, limites e recuperação. A renderização interpola estados e não define o tamanho do passo biológico.

## Campos e terreno

O terreno atual usa um campo implícito contínuo e malha arredondada.
Já existem campos discretos de feromônio na superfície, água/calor no solo e gases nas câmaras. Chunks e refinamentos de resolução continuam possibilidades futuras, não implementações concluídas.
O renderer recebe regiões sujas; a malha visual não é a fonte da física.

Para difusão explícita em d dimensões, respeitar dt <= h²/(2 d D), ajustada
à discretização adotada. Considerar subpassos ou método implícito.

Na física granular, escolher uma resolução representativa: uma parcela
numérica pode representar muitos grãos reais.

## Persistência atual e banco planejado

Hoje há IndexedDB com checkpoints atômicos, oito automáticos recentes, pontos nomeados preservados, integridade e fallback local; também existe exportação/importação JSON. Relógio e destino parcial do avanço integram a sessão. Não existe backend SQLite/PostgreSQL. A tabela abaixo é uma proposta para essa expansão.

| Tabela          | Campos principais                                      |
| --------------- | ------------------------------------------------------ |
| experiments     | id, seed, model_version, dt, configuração              |
| runs            | id, experiment_id, parent_run_id, cenário, estado      |
| snapshots       | run_id, tick, schema_version, URI/blob, checksum       |
| interventions   | run_id, tick, sequence, tipo, payload                  |
| events          | run_id, tick, sequence, agente/colônia, tipo, payload  |
| metrics         | run_id, tick, população, reservas, mortalidade, campos |
| colonies        | run_id, colony_id, queen_id, assinatura, reservas      |
| genotypes       | id, mãe, pai, geração, genes, mutações                 |
| policies        | id, versão, arquitetura, pesos, seed de treino         |
| forecasts       | run_id, origin_tick, horizonte, intervalo, observações |
| forecast_scores | forecast_id, realização, erro, cobertura               |

Indexar eventos, métricas e snapshots por (run_id,tick). A sequência desempata
eventos no mesmo tick. Guardar snapshots comprimidos, eventos relevantes e
métricas agregadas; não criar uma linha por formiga por frame.

Salvar checkpoint e metadados atomicamente. Manter checksums, migrações e
versionamento de regras. Reconstruir caches e malhas, sem persistir esses
objetos como fonte da verdade.

## Avaliação

- Conservação de alimento, água e solo.
- Sensores sem acesso fora do alcance.
- Replay por seed, configuração, intervenções e versão.
- Ausência de NaN, penetração e apoio inválido.
- Gargalos com sentidos, cargas e densidades diferentes.
- RL comparado com políticas base em seeds não vistas.
- Tempo por passo, memória e custo da malha.
- Previsões avaliadas por horizonte, cobertura e dados observados.
