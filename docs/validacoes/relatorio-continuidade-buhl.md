# Relatório de continuidade: comparação da escavação com Buhl et al.

Este relatório é para quem for continuar o trabalho. Ele reúne o objetivo, os
dados do estudo, o estado do código, tudo o que já foi testado (com
resultados) e o ponto exato onde o trabalho parou. Leia antes de rodar qualquer
coisa, para não repetir testes que já foram feitos.

- Repositório: `albreis/viveiro`
- Branch: `claude/project-thread-kazijj`
- PR: #69 (aberto, CI verde no último commit `0eb9f89`)
- Versão do modelo: 0.41.0
- Data deste relatório: 2026-11-03

## 1. Objetivo e regras do dono do projeto

O objetivo é fazer o Viveiro, um modelo baseado em agentes de formigas em
TypeScript/JS, reproduzir os padrões de escavação medidos por Buhl et al. em
_Messor sancta_. Se a reprodução for aceitável, publica-se uma tag de versão,
e a tag atualiza o Zenodo.

O dono do projeto definiu estas regras:

1. **Não criar tag** enquanto o resultado não for uma reprodução aceitável.
   Até agora nenhuma tag foi criada, e nenhuma deve ser criada sem confirmar
   com ele.
2. **O modo padrão do simulador não pode mudar** sem validação. Tudo o que foi
   feito até aqui é opcional: modo por feromônio (`--mode estigmergia`), regra
   das ociosas (`--ociosas cedem`) e modo de tempo real (`--horas`). As séries
   do modo padrão (`projetos`) continuam idênticas.
3. **Ajuste e teste usam sementes separadas.** Os parâmetros são ajustados em
   algumas sementes e confirmados em outras, e tudo fica documentado, inclusive
   o que falhou. A preocupação dele é não invalidar o projeto científico com
   ajuste forçado.
4. **O determinismo é garantia central:** a mesma semente dá o mesmo
   resultado, e isso é protegido por testes de trajetória salva. Não
   paralelize uma rodada única nem mude a ordem de atualização das formigas.
5. Ele roda testes longos no notebook dele (Windows, PowerShell), num clone
   temporário em `%TEMP%\viveiro-bench`. Não mexa nos arquivos locais nem nas
   branches dele.

## 2. O estudo de referência

### Fontes

- **Artigo (pago):** Buhl, J.; Deneubourg, J.-L.; Grimal, A.; Theraulaz, G.
  (2005). Self-organized digging activity in ant colonies. _Behavioral Ecology
  and Sociobiology_ 58: 9–17. [doi:10.1007/s00265-004-0906-2](https://doi.org/10.1007/s00265-004-0906-2)
- **Relatório aberto do mesmo experimento (PDF, de onde vêm os números):**
  Buhl, Deneubourg, Grimal & Theraulaz (2001). Morphogenèse des réseaux de
  galeries chez la fourmi _Messor sancta_. _Actes des Colloques Insectes
  Sociaux_ 14: 52–105.
  [PDF](https://dictionnaire-amoureux-des-fourmis.fr/Noms%20propres/Publis/2001/ACTES-COLLOQUES-INSECTES-SOCIAUX-VOL14-Buhlf.pdf)
- **Segunda referência, de modelo para modelo:** versão em NetLogo do modelo de
  Buhl por Elske van der Vaart no CoMSES,
  [doi:10.25937/086z-1t29](https://doi.org/10.25937/086z-1t29). Ainda não foi
  usada.
- **Literatura de trânsito, usada no diagnóstico:**
  - Poissonnier et al. (2019), _eLife_ 8:e48945,
    [doi:10.7554/eLife.48945](https://doi.org/10.7554/eLife.48945). Formigas
    evitam engarrafamento, e o fluxo se estabiliza em vez de despencar.
  - Aguilar et al. (2018), _Science_ 361: 672. Ociosidade e recuos evitam
    entupimento em túneis, e poucas operárias fazem a maior parte da
    escavação.

### Parâmetros do experimento

- Espécie: _Messor sancta_, só operárias.
- Arena: disco de areia úmida com 20 cm de diâmetro e 5 mm de espessura, sob
  vidro (escavação praticamente 2D).
- Grupos de 50, 100 e 200 operárias.
- 5 réplicas de 3 dias (72 h) por tamanho de grupo.
- Sem rainha, sem cria e sem predadores. As operárias não morreriam de fome em
  3 dias.

### Dados (em `src/modules/benchmarks/buhl-2005-data.ts`)

Tabela 1 do relatório, transcrita:

| Operárias | Volume em 72 h (cm³) | Taxa de massa (mg/formiga/h) | Comprimento da rede (cm) | Galerias |
| --- | --- | --- | --- | --- |
| 50 | 25,25 | 10,4 | 79,8 | 23,6 |
| 100 | 37,49 | 7,7 | 115,6 | 40,2 |
| 200 | 60,9 | 6,4 | 199,3 | 85,4 |

Figura 2a, volume médio (cm³) em 0, 12, 24, 36, 48, 60 e 72 h. Os valores
foram lidos a olho na figura escaneada, então considere ±3 cm³:

| Operárias | 0 | 12 | 24 | 36 | 48 | 60 | 72 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 50 | 0 | 6 | 12 | 16,5 | 20,5 | 23 | 25 |
| 100 | 0 | 10 | 19 | 26 | 31 | 34 | 37 |
| 200 | 0 | 17 | 31 | 39 | 47 | 54 | 59 |

Grandezas derivadas, que são o que o modelo precisa reproduzir:

- Proporção do volume final entre os grupos: 1 : 1,48 : 2,41 em 72 h e cerca
  de 1 : 1,58 : 2,58 em 24 h (12 / 19 / 31 cm³).
- Inclinação log-log do volume final contra o número de operárias: **0,64**.
- Fração do volume final em 1/3 e 2/3 do tempo: 0,48 / 0,82 (50), 0,51 / 0,84
  (100) e 0,53 / 0,80 (200).
- **A forma da curva é uma saturação exponencial,** V(t) = Vmax·(1 − e^(−t/τ))
  com τ ≈ 50 h. Com x = e^(−24/τ), a fração em 24 h é 1/(1+x+x²) = 0,5, o que
  dá x = 0,618; a fração em 48 h fica então (1+x)/(1+x+x²) = 0,81, igual aos
  dados. Daí saem alvos para horizontes mais curtos, úteis para ajustar sem
  rodar 72 h:
  - horizonte de 24 h: 0,39 do volume em 8 h e 0,72 em 16 h;
  - horizonte de 12 h: 0,36 em 4 h e 0,69 em 8 h.
- A taxa por formiga cai com o tamanho do grupo (10,4, 7,7 e 6,4 mg/h).
- O mecanismo proposto por Buhl tem duas partes:
  - recrutamento por estímulo local, que se reforça (resposta X²/(X²+K²));
  - freio pela queda da densidade de operárias por área escavada.

### Critérios usados no código (`src/modules/benchmarks/digging-compare.ts`)

Só se comparam forma e escala. Unidades do modelo (u³) não são convertidas
para cm³.

1. **Atividade:** todos os grupos escavam algum volume.
2. **Saturação:** pelo menos 40% do volume final em 1/3 do horizonte e 70% em
   2/3. **Atenção:** o critério só tem limite mínimo. Uma curva que satura
   cedo demais (por exemplo 0,88 / 0,98) também passa, então "OK" aqui não
   quer dizer que a curva tem a forma da de Buhl. Compare sempre com os alvos
   acima.
3. **Escala:** inclinação log-log entre 0,4 e 1,0 (Buhl: 0,64).

A comparação também é feita separadamente para a terra que vem das frentes de
escavação e para a que vem do alargamento por trânsito (`porOrigem` no
`comparacao.json`).

## 3. Como rodar

```sh
npm ci
npm run benchmark:buhl -- --help
```

Comando completo da configuração mais avançada até agora:

```sh
node scripts/run-buhl.ts --out PASTA_NOVA --horas 72 --mode estigmergia \
  --protocol grupo-fixo --paralelo sim \
  [--semente-inicial 2] [--seeds 1] [--freio-expoente 1] [--freio-c 30]
```

| Opção | O que faz |
| --- | --- |
| `--mode estigmergia` | Escavação recrutada por feromônio (`src/modules/soil/stigmergy.ts`), opcional. O padrão é `projetos`. |
| `--protocol grupo-fixo` | Começa só com operárias, sem rainha, dentro das câmaras. |
| `--horas H` e `--segundos-por-tick S` | Tempo real: roda H·3600/S ticks e congela idade, doença, comida do estoque, **energia de cada operária** e predadores (`freezeDaily` e `noPredators`). Amostra a cada 600 ticks. |
| `--days D` | Tempo do modelo (100 ticks por dia). Não pode ser usado junto com `--horas`. |
| `--paralelo sim` | Cada combinação de semente e grupo roda numa thread (`scripts/lib/buhl-worker.ts`). Não muda o resultado. |
| `--seeds N` e `--semente-inicial K` | Usa as sementes BUHL-K até BUHL-(K+N−1). |
| `--freio-expoente` e `--freio-c` | Expoente (0,5 a 4) e meia-saturação (1 a 1000) do freio por densidade. O padrão é 2 e 100. |
| `--ociosas cedem` | Regra opcional em que as ociosas dão passagem (`src/modules/navigation/idle-yield.ts`). |

A saída é uma pasta nova com `serie.csv` (volume, volume de trânsito,
operárias, frentes ativas e nós do ninho ao longo do tempo, com a coluna
`horas_reais`) e `comparacao.json`. O progresso vai para o stderr.

Outros comandos:

- `npm run benchmark:fluxo` mede fluxo por densidade num túnel
  (`scripts/run-fluxo.ts` e `src/modules/benchmarks/tunnel-flow.ts`).
- `npm test` roda a suíte. Hoje são 433 testes passando e 1 falhando, e essa
  falha já existe na `main`: `portable-process`, "roteamento preserva a
  trajetória nativa…". Não é causada por este trabalho.
- `node --test tests/buhl-benchmark.test.mjs` roda os 15 testes desta
  comparação.

## 4. O modelo: equações da escavação no modo por feromônio (versão 2)

Valores padrão em `DEFAULT_STIGMERGY` (`src/modules/soil/stigmergy.ts`):

| Etapa | Equação ou regra | Parâmetros |
| --- | --- | --- |
| Abrir frente | Por tick, cada ociosa numa câmara abre uma frente com P = spontaneous × F. Há no máximo **uma frente por nó de origem**. | spontaneous 0,006; maxFronts 12; maxNodes 140 |
| Freio por densidade | F = ρⁿ/(ρⁿ + cⁿ), com ρ = operárias / volume escavado desde o início. F = 1 antes da primeira mordida. | crowding c = 100; crowdingExponent n = 2 |
| Feromônio da frente | X(t) = X₀·e^(−evap·Δt), mais deposit a cada mordida, mais trailDeposit a cada despejo de terra. | deposit 0,35; evaporation 0,0035 (meia-vida de cerca de 200 ticks); trailDeposit 0,35 |
| Entrar numa frente | P = (baseJoin + (1 − baseJoin)·X²/(X²+K²)) × F | baseJoin 0,01; K = 1; perFront 6 |
| Continuar após despejar | P = max(P de entrar, fidelity × F). É 0 se a frente terminou. | fidelity 0,9 |
| Recruta perdida | Uma recruta que volta e passa por qualquer frente aberta adota essa frente na hora. | (versão 2) |
| Mordida | Avanço de 0,02 × biteScale. O volume é π·0,28²·avanço ≈ 0,0197 u³. Uma mordida por frente por tick, e cada operária morde a cada 4 ticks. | biteScale 4 |
| Carga | Capacidade de 0,022, ou seja, 1 a 2 mordidas por viagem. | |
| Fim da frente | Segmentos de 0,65 a 0,95 u, mais 2 a 4 segmentos, e depois a frente vira câmara (cerca de 0,8 u³ por projeto). | `src/modules/soil/projects.ts` |
| Ir até a frente | Rota pelo odor genérico "frente". | `navigation/local-routing.ts` |
| Escolha de saída | Peso ∝ e^(1,4·60·sinal) × heurística², com 2,5% de exploração. | `navigation/local-route-policy.ts`, `chemistry/aco.ts` |
| Trânsito | Forças sociais (Helbing–Molnár adaptado: raio de segurança 0,52, repulsão 0,018), elipse de colisão (0,38 × 0,14) e alargamento do túnel depois de 65 ticks parada (largura até 0,64). | `navigation/social-forces.ts`, `collision.ts`, `contact.ts` |

A versão do estado é 2. Saves antigos sem `crowdingExponent` usam 2.

### Escala de tempo (inconsistência conhecida)

- Pelo relógio do modelo, `TICKS_PER_DAY = 100`, então 1 tick vale 14,4 min.
- Pelo movimento, não. A formiga tem cerca de 0,38 u de comprimento e anda
  cerca de 0,045 u por tick (nominal 0,087). Comparado com formigas reais,
  isso dá cerca de 0,1 a 0,2 s por tick.
- Por isso o "72 h" antigo, com 300 ticks, era só cerca de 1 minuto de
  caminhada. O modo de tempo real lê 1 tick como 1 s, um meio-termo que não é
  exato por nenhum dos dois critérios.
- As taxas de decisão (abrir frente, entrar, morder) foram escritas **por
  tick**. Convertê-las para tempo real a partir de medidas de formigas é uma
  pendência aberta.

## 5. Tudo o que já foi testado (não repetir)

Os resultados abaixo são volume final 50 / 100 / 200 em u³. Quando não está
indicado, são médias de 5 sementes (BUHL-1 a 5) com `--protocol grupo-fixo`.

### 5.1 Linha de base, modo projetos (padrão)

| Horizonte | Volume | Escala | Resultado |
| --- | --- | --- | --- |
| 3 dias do modelo | 0 / 0 / 0 | — | falha em tudo |
| 30 dias (BUHL-1) | 0,27 / 0,33 / 0,46 | 0,39 | falha na saturação e na escala |
| 60 dias (BUHL-1) | 0,59 / 1,51 / 6,69 | 1,75 | curva acelera em vez de saturar |

A causa são limites fixos:

- uma nova frente só a cada 450 ticks (`soil/worker.ts`);
- no máximo 2 frentes (`soil/projects.ts`);
- no máximo 2 operárias por frente;
- o ninho para em 46 a 48 nós;
- além disso, a população muda durante a rodada.

O modo projetos não reproduz Buhl por construção. **Não vale insistir nele.**

### 5.2 Modo por feromônio, versão 1

Ajustado em BUHL-1, 20 dias: escala 0,40; a saturação passa em 100 e 200 e
falha em 50. Nas sementes de teste, nenhuma passa nos três critérios.

### 5.3 Terra das frentes e do trânsito separadas (20 dias)

| Modo | Total | Só frentes | Só trânsito | Escala total / só frentes |
| --- | --- | --- | --- | --- |
| projetos | 0,42 / 0,30 / 1,40 | 0,36 / 0,29 / 0,13 | 0,05 / 0,01 / 1,28 | 0,87 / −0,76 |
| feromônio v1 | 0,98 / 1,10 / 1,71 | 0,98 / 1,10 / 0,50 | 0 / 0 / 1,22 | 0,40 / −0,49 |

Conclusões:

- O alargamento por trânsito só aparece com 200 operárias, como um limiar.
- As frentes cavam menos com 200 do que com 100.
- A escala "OK" vinha do trânsito, não das frentes.

### 5.4 Hipótese "a fórmula de trânsito é de humanos": descartada para túneis

Teste de fluxo por densidade num túnel (`benchmark:fluxo`):

- A velocidade fica em cerca de 0,045 de 2 a 200 operárias, e o fluxo cresce
  com a densidade. Não há engarrafamento de tipo humano dentro do túnel.
- O entupimento acontece **nas câmaras.** Com 200 operárias, 53% estão em
  câmaras e 19% estão paradas lá.

Detalhes em `docs/validacoes/fluxo-tunel.md`.

### 5.5 Suspeitos do entupimento (BUHL-2, modo projetos, 8 dias)

- **Rotas longas: descartado.** O caminho pelos nós já é o mais curto (3,12
  contra 3,82).
- **Câmara lotada: confirmado.**
  - A distância que quem carrega terra anda dentro das câmaras vai de 0,67
    (50 operárias) para 8,15 (200).
  - Em 90% dos casos, quem bloqueia é uma ociosa andando pela câmara.
  - Contraprova: com as ociosas dando passagem, a viagem cai de 232 para 97
    ticks.
- **Proibir o desvio pela superfície piorou:** a viagem subiu para 406 ticks.
  O desvio é a saída que elas encontram, não a causa.

### 5.6 Terceiro suspeito: ociosas nos túneis e perto das frentes

- O alargamento é feito 100% por ociosas.
- Há de 17 a 24 ociosas perto de cada frente com 200 operárias.

Contraprovas feitas numa cópia descartável do código (feromônio v1):

| Variante | Só frentes | Escala total |
| --- | --- | --- |
| ociosas dão passagem a quem trabalha com solo | 1,01 / 1,59 / 1,51 | 0,60 |
| idem, e ociosas não alargam túneis | 1,01 / 1,52 / 1,67 | 0,36 |

### 5.7 Regra realista das ociosas (`--ociosas cedem`): não adotada

| Variante | Só frentes | Trânsito com 200 | Escala total | Saturação |
| --- | --- | --- | --- | --- |
| regras originais | 0,98 / 1,10 / 0,50 | 1,22 | 0,40 | falha |
| `--ociosas cedem` | 1,08 / 1,35 / 0,80 | 0,07 | −0,16 | falha |

A regra melhora a viagem (232 para 174 ticks), mas com 200 operárias as
frentes ainda rendem menos que com 100. Ela continua opcional. Uma primeira
versão, e uma versão com "passagem pelas ociosas em descanso", também não
resolveram e foram descartadas. A variável de ambiente `VIVEIRO_IDLE_PASS`
foi removida.

### 5.8 Análise das equações (feromônio v1)

Detalhes em `docs/validacoes/analise-equacoes-escavacao.md`. As causas, da
mais forte para a mais fraca:

1. **O feromônio evaporava antes da próxima mordida.** A meia-vida era de 17
   ticks, mas cada frente recebia uma mordida a cada 100 a 400 ticks. Assim a
   chance de entrar ficava no piso (cerca de 0,02).
2. **98% das escavadoras largavam a tarefa depois de despejar.**
3. **Recrutas perdidas ocupavam as vagas** e não adotavam a frente onde
   chegavam, então as equipes ficavam 100% cheias.
4. **Teto de uma frente por nó de origem.**

As rotas por odor estão boas: a chance de escolher o túnel certo é 0,98.

### 5.9 Feromônio versão 2: corrige as causas 1 a 3 (adotada no modo opcional)

As correções foram: fidelidade de 0,9, trilha depositada por quem despeja
terra, evaporação de 0,0035 e adoção da frente onde a recruta chega.

| | Total | Só frentes | Escala total / só frentes | Saturação |
| --- | --- | --- | --- | --- |
| v1, 20 dias | 0,98 / 1,10 / 1,71 | 0,98 / 1,10 / 0,50 | 0,40 / negativa | falha |
| v2, 20 dias | 1,74 / 3,37 / 4,65 | 1,74 / 3,37 / 3,68 | 0,71 / 0,54 | falha (0,25 / 0,67 com 50) |

Com 200 operárias, o teto de 12 frentes é atingido.

### 5.10 Tempo real (1 s por tick), feromônio v2

| Rodada | Volume | Proporção | Escala | Saturação (1/3 e 2/3) | Operárias no fim |
| --- | --- | --- | --- | --- | --- |
| 24 h, BUHL-1, sem manter a energia | 6,97 / 11,79 / 13,37 | 1 : 1,69 : 1,92 | 0,47 | 0,63/0,89; 0,67/0,82; 0,83/0,93 | 50 / 100 / 146 |
| 72 h, BUHL-1, sem manter a energia (notebook) | 7,88 / 13,87 / 17,30 | 1 : 1,76 : 2,20 | 0,57 | 0,88/0,98; 0,85/0,99; 0,77/0,87 | 50 / 99 / 126 |
| **24 h, BUHL-1, com a energia mantida** | **5,63 / 8,35 / 14,46** | **1 : 1,48 : 2,57** | **0,68** | 0,62/0,92; 0,81/1,00; 0,92/1,00 | 50 / 100 / 200 |

Com 200 operárias, 45 morriam de fome na primeira hora. O estoque cheio não
chegava a todas a tempo. Isso foi corrigido no commit `6eb4bd0`
(`holdDaily` mantém a energia inicial de cada operária).

**Situação atual:** a escala bate com Buhl (0,68 contra 0,64, e proporção
1 : 1,48 : 2,57 contra 1 : 1,58 : 2,58 em 24 h). **A forma da curva não
bate.** Exemplo, grupo de 200 com a energia mantida (u³ por hora):

| Hora | 1 | 3 | 6 | 12 | 24 |
| --- | --- | --- | --- | --- | --- |
| 50 | 2,56 | 3,27 | 3,47 | 4,15 | 5,63 |
| 100 | 4,56 | 6,48 | 6,78 | 7,25 | 8,35 |
| 200 | 6,91 | 12,06 | 12,94 | 14,44 | 14,46 |

Quase tudo é escavado nas 3 primeiras horas e depois a escavação quase para.
O número de frentes ativas cai a 0. Em Buhl a desaceleração é gradual
(τ ≈ 50 h).

### 5.11 Outras coisas já avaliadas

- **GPU do notebook (Intel Iris Xe integrada):** não ajuda nesta simulação.
- **Multithread numa rodada única:** quebraria o determinismo por semente e
  exigiria reescrever com memória compartilhada, para ganhar 2 a 3×. O dono
  pediu para deixar quieto. O paralelismo entre grupos (`--paralelo sim`) já
  existe.
- **Otimizar os pontos quentes:** foi oferecido e ainda não foi feito. Pelo
  perfil, os pontos quentes são:
  - `sampleSoil`/cavidade do terreno, com cerca de 26%;
  - `modelMath.hypot`, 14%;
  - `neighborsOf`, 11%;
  - `positionClear`, 7%.

  A estimativa é de cerca de 2× de ganho com resultado idêntico, conferido
  pelos testes de trajetória.

## 6. Onde o trabalho parou

### Diagnóstico da escavação rápida demais (ainda não confirmado)

1. **O freio por densidade age cedo e forte demais.** Com n = 2 e c = 100, F
   cai à metade com só 2 u³ escavados (200 operárias) ou 0,5 u³ (50
   operárias). Com 7 u³, que o grupo de 200 atinge em cerca de 1 h, F ≈ 0,07.
2. **No início não há freio, e as taxas são por tick.** F = 1 antes da
   primeira mordida, e há uma chance de 0,006 por tick para cada ociosa abrir
   uma frente. Com 200 operárias, as 12 frentes abrem em segundos.
3. **As frentes têm tamanho fixo e viram câmara.** Para continuar escavando é
   preciso abrir uma frente nova, mas a essa altura F já está em 5 a 10%.

### O que foi feito para testar

- O expoente do freio virou parâmetro (`crowdingExponent`), com padrão 2,
  idêntico ao anterior. Quando n ≠ 2, o cálculo usa `modelMath.pow` (o teste
  `math-routing` proíbe `**` nativo no núcleo).
- O comando ganhou `--freio-expoente`, `--freio-c` e `--semente-inicial`
  (commit `0eb9f89`).

### Varredura parcial, interrompida a pedido do dono (ajuste em BUHL-1, 12 h, 1 s/tick)

Volume acumulado (u³) a cada hora:

| Configuração | Grupo | Horas rodadas | Volume por hora | Fração em 4 h / 8 h |
| --- | --- | --- | --- | --- |
| n = 1, c = 100 | 50 | 12 | 3,26 5,51 6,50 7,70 7,85 8,28 8,36 8,85 8,97 8,99 8,99 8,99 | 0,86 / 0,98 |
| n = 1, c = 30 | 50 | 12 | 3,80 5,38 6,31 7,25 7,83 8,58 9,10 9,12 9,45 10,59 11,35 12,67 | 0,57 / 0,72 |
| n = 1, c = 100 | 200 | 2 | 6,43 10,14 | — |
| n = 1, c = 30 | 200 | 6 | 6,94 10,70 13,52 16,05 18,22 20,41 | — |

Alvo de Buhl para 12 h: 0,36 / 0,69. A configuração n = 1, c = 30 é a mais
promissora: a curva de 50 deixa de parar, e a de 200 cresce de forma gradual.
Ainda falta:

- a fração em 1/3 continua alta (0,57);
- o surto da primeira hora continua (causa 2);
- não há resultado de escala para essa configuração.

### Próximo teste, já preparado mas ainda não rodado

Este é o comando para o notebook, com uma semente de teste fora do ajuste:

```powershell
cd $env:TEMP\viveiro-bench; git pull; node scripts/run-buhl.ts --out buhl-72h-freio --horas 72 --mode estigmergia --protocol grupo-fixo --paralelo sim --semente-inicial 2 --freio-expoente 1 --freio-c 30
```

Deve levar 3 h ou mais no notebook, porque com o freio suave o ninho cresce e
cada tick fica mais pesado.

## 7. Próximos passos recomendados, em ordem

1. **Rodar o teste acima** (n = 1, c = 30, BUHL-2, 72 h) e comparar com os
   alvos: escala de cerca de 0,64 e frações de cerca de 0,5 / 0,82.
2. **Se o surto inicial continuar,** atacar a causa 2. São duas opções, a
   testar em separado:
   - limitar a abertura de frentes no início, por exemplo com uma taxa de
     abertura em tempo real ou um período refratário por frente;
   - fazer o freio já valer no começo, contando o volume do ninho inicial ou
     usando um volume mínimo.
   Documente a justificativa biológica de cada mudança.
3. **Testar o teto de frentes** (uma por nó de origem e no máximo 12). Ele
   limita o grupo de 200 e pode distorcer a escala quando o freio fica suave.
4. **Converter as taxas de "por tick" para "por segundo"** a partir de medidas
   de formigas (velocidade de caminhada, tempo de mordida e transporte de
   pelotas em _Messor_). Isso resolveria a inconsistência da seção 4 em vez de
   contorná-la.
5. **Confirmar com 5 sementes de teste** (por exemplo `--semente-inicial 2
   --seeds 5`), sem ter ajustado nelas, e só então discutir tag com o dono.
6. **Opcional:** comparar com o modelo NetLogo de van der Vaart (CoMSES) e
   otimizar os pontos quentes (cerca de 2×, resultado idêntico).

## 8. Cuidados práticos (para não perder tempo)

- **Desempenho medido em ticks/s,** feromônio v2 e ninho pequeno:

  | Máquina | 50 operárias | 200 operárias |
  | --- | --- | --- |
  | nuvem | 125 | 22 |
  | notebook (i5-1135G7, 4 núcleos, Node 24, na tomada) | 248 | 32 |

  Com o freio suave o grupo de 200 fica bem mais lento, porque o ninho cresce:
  cerca de 11 ticks/s na nuvem com 4 processos ao mesmo tempo. Uma rodada de
  72 h de 200 operárias leva várias horas.
- **Nuvem:**
  - Processos em segundo plano monitorados têm limite de 2 h e são
    interrompidos ao atingi-lo. Uma varredura de 12 rodadas de 24 h foi
    perdida assim.
  - Processos soltos (`nohup`/`setsid`) morrem quando o contêiner reinicia,
    o que aconteceu duas vezes.
  - Salve resultados parciais ao longo da rodada. Há um exemplo de script
    em que `holdDaily` é exportado e chamado a cada tick, gravando a cada
    3.600 ticks.
  - Há 4 núcleos.
- **Prettier:** rodar com `--write` na pasta toda reformata
  `tests/fixtures/sweep-041/plan.json`. Formate só os arquivos alterados, ou
  reverta com `git checkout tests/fixtures`.
- **Teste `math-routing`:** o núcleo não pode usar `**` nem `Math.*` direto.
  Use `modelMath` (`src/libs/model-math.ts`).
- **Remote Control no notebook:** o modo automático do notebook bloqueou
  comandos ("Code from External"). O dono roda os comandos ele mesmo.
- **Ordenação no teste de fluxo:** `flowShape` ordena por número de
  operárias, não por densidade, porque o entupimento derruba a densidade e
  esconderia o colapso.

## 9. Mapa dos arquivos

| Arquivo | O que tem |
| --- | --- |
| `src/modules/benchmarks/buhl-2005-data.ts` | Dados de Buhl e fontes |
| `src/modules/benchmarks/digging-run.ts` | Preparação do grupo, `runDigging`, `holdDaily` (congelamento), contagem do trânsito |
| `src/modules/benchmarks/digging-compare.ts` | Critérios, `curveShape`, `bySource` |
| `src/modules/benchmarks/tunnel-flow.ts` | Teste de fluxo por densidade |
| `src/modules/soil/stigmergy.ts` | Parâmetros e equações do modo por feromônio (freio, recrutamento, trilha) |
| `src/modules/soil/worker.ts` | Abertura de frente, continuar e adotar frente |
| `src/modules/soil/projects.ts` | Mordida, tamanho e fim das frentes |
| `src/modules/navigation/idle-yield.ts` | Regra opcional das ociosas |
| `scripts/run-buhl.ts`, `scripts/lib/buhl-args.ts`, `scripts/lib/buhl-worker.ts` | Linha de comando e threads |
| `scripts/run-fluxo.ts` | Linha de comando do fluxo |
| `tests/buhl-benchmark.test.mjs` | 15 testes desta comparação |
| `docs/validacoes/buhl-2005.md` | Primeira comparação e separação frentes/trânsito |
| `docs/validacoes/fluxo-tunel.md` | Trânsito, suspeitos e regra das ociosas |
| `docs/validacoes/analise-equacoes-escavacao.md` | Equações, versão 2, tempo real, pilotos |
| `docs/validacoes/anexos-buhl/` | Resultados brutos de todas as rodadas, scripts de diagnóstico e o patch das contraprovas (veja o README da pasta) |

## 10. Branches

- O trabalho todo está em `claude/project-thread-kazijj` (PR #69), criada a
  partir da `main`. Não há outra branch deste trabalho, e a `main` local é
  igual à `origin/main`.
- As contraprovas foram feitas numa cópia descartável sobre o commit
  `2a4c97e`. A diferença está em `anexos-buhl/contraprova/cf.patch`.

## 11. Lugar no cronograma e motivo da pausa

No `docs/cronograma.md`, este trabalho corresponde a três itens:

- **P3.2, calibração orientada a padrões:** ajustar o modelo contra 3 ou
  mais padrões observados. Aqui os padrões são atividade, saturação e escala
  de Buhl.
- **Seção 7, "Calibração por espécie e comparação com experimentos".**
- A separação de sementes de ajuste e de teste já adianta a **P3.3**,
  validação com dados reservados.

Ele foi feito antes da ordem planejada. O cronograma prevê antes:

- **P2.3:** varredura de parâmetros e réplicas em paralelo, com retomada.
  Foi a falta dela que fez a varredura do freio se perder no limite de 2 h.
- **P2.4:** análise de sensibilidade (Morris), que deve indicar quais
  parâmetros a P3.2 pode ajustar. O freio por densidade foi escolhido pelo
  diagnóstico das equações, não por análise de sensibilidade.

**Esta branch está pausada por decisão do dono do projeto** até os itens P2,
que outro agente está fazendo, terminarem. Eles podem afetar os resultados
encontrados aqui. Ao retomar:

1. Traga as mudanças da `main` para esta branch e rode
   `node --test tests/buhl-benchmark.test.mjs` e `npm test`.
2. Repita uma rodada de referência já conhecida para ver se os números
   mudaram. Use `rt24b`: v2, 24 h, BUHL-1, energia mantida, resultado esperado
   de 5,63 / 8,35 / 14,46 u³. Se os números mudarem, os resultados da seção
   5 precisam ser refeitos antes de seguir.
3. Use a P2.3 para a varredura do freio e a P2.4 para escolher os
   parâmetros. Depois siga a seção 7 deste relatório.
