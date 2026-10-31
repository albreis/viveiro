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

## Loop

1. Aplicar intervenções ordenadas por tick e sequência.
2. Atualizar índices espaciais e regiões alteradas.
3. Atualizar campos químicos com estabilidade numérica.
4. Ler sensores, memória, estímulos e tarefas.
5. Integrar forças, resolver contatos e projetar no terreno.
6. Aplicar escavação, transporte, suporte e colapsos.
7. Atualizar alimentação, prole, idade e reprodução.
8. Atualizar água, gases e temperatura em frequências adequadas.
9. Registrar eventos, métricas e checkpoints.
10. Renderizar entre estados; a renderização não modifica o modelo.

Usar dt fixo. A velocidade de exibição muda a quantidade de passos, não sua
física. Definir a ordem dos sistemas e como resolver atualizações simultâneas.

## Campos e terreno

O terreno atual usa um campo implícito contínuo e malha arredondada.
Arrays por célula/chunk são planejados para concentração, água, temperatura e gases.
O renderer recebe regiões sujas; a malha visual não é a fonte da física.

Para difusão explícita em d dimensões, respeitar dt <= h²/(2 d D), ajustada
à discretização adotada. Considerar subpassos ou método implícito.

Na física granular, escolher uma resolução representativa: uma parcela
numérica pode representar muitos grãos reais.

## Banco de dados planejado

Hoje há armazenamento no navegador e exportação JSON. Para sessões longas,
usar IndexedDB localmente e backend opcional SQLite/PostgreSQL.

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
