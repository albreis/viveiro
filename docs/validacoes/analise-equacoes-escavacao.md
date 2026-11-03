# Análise das equações da escavação (comparação com Buhl)

Revisão termo a termo da cadeia que transforma operárias em volume escavado,
com medições do modo por feromônio (`--mode estigmergia --protocol
grupo-fixo`, sementes BUHL-1 e BUHL-3). Objetivo: achar por que o volume das
frentes não cresce com o grupo como em Buhl et al. (inclinação 0,64).

## A cadeia e suas equações

| Etapa | Equação ou regra | Onde |
| --- | --- | --- |
| Abrir frente | por tick, cada ociosa numa câmara: P = 0,006 × F; no máximo **uma frente por nó de origem**, 12 frentes, 140 nós | `soil/worker.ts`, `soil/projects.ts` |
| Freio por densidade | F = ρ² / (ρ² + c²), ρ = operárias / volume escavado, c = 100 | `soil/stigmergy.ts` |
| Feromônio da frente | X(t) = X₀·e^(−0,04·Δt) + 0,35 por mordida | `soil/stigmergy.ts` |
| Entrar numa frente | P = (0,01 + 0,99·X²/(X²+1)) × F; equipe de no máximo 6 | `soil/stigmergy.ts` |
| Continuar após despejar | continua com a mesma P; senão larga a tarefa | `soil/worker.ts` |
| Mordida | avanço 0,02 × 4 = 0,08; volume π·0,28²·avanço ≈ 0,0197; uma mordida por frente por tick; cada operária morde a cada 4 ticks | `soil/projects.ts` |
| Carga | capacidade 0,022: 1 a 2 mordidas por viagem | `soil/worker.ts` |
| Fim da frente | segmentos de 0,65 a 0,95, mais 2 a 4 segmentos, depois vira câmara (cerca de 0,8 u³ por projeto) | `soil/projects.ts` |
| Ir até a frente | rota pelo odor genérico "frente", com destino a uma frente específica | `navigation/local-routing.ts` |
| Escolha de saída | peso ∝ e^(1,4·60·sinal) × heurística², exploração 2,5% | `navigation/local-route-policy.ts`, `chemistry/aco.ts` |
| Trânsito | forças sociais, colisão, recuo, alargamento após 65 ticks parada | `navigation/` |

## O que as medições mostram (20 dias)

| | 50 | 100 | 200 |
| --- | --- | --- | --- |
| Mordidas da colônia por dia | 1,8 a 2,9 | 1,6 a 2,7 | 0,9 a 1,1 |
| Frentes abertas | 3,0 a 3,3 | 3,8 a 4,4 | 3,9 |
| Nós de origem sem frente | 2,1 a 2,5 | 1,3 a 1,6 | 0,1 |
| Equipes cheias (6 de 6) | 84% a 96% | 98% | 100% |
| Operárias cavando ao mesmo tempo | 0,15 a 0,29 | 0,12 a 0,30 | 0,17 |
| Operárias em "indo para a frente" | 15 a 16 | 20 a 22 | 21 |
| Probabilidade média de entrar | 0,024 | 0,03 | 0,016 a 0,021 |

Rotas de odor estão boas: saindo de uma câmara vizinha a uma frente, a chance
de escolher o túnel certo é 0,98.

## Causas, da mais forte para a mais fraca

1. **O feromônio evapora antes da próxima mordida.** Com evaporação de 0,04
   por tick, metade some em 17 ticks. Mas cada frente recebe uma mordida a
   cada 1 a 4 dias (100 a 400 ticks). Então X fica perto de zero, a resposta
   de Hill fica perto de zero e a chance de entrar fica no piso (0,01 × F). O
   reforço positivo, que é o mecanismo central de Buhl, nunca chega a operar.
2. **Quase toda escavadora larga a tarefa depois de uma viagem.** A decisão
   de continuar usa a mesma probabilidade de entrar (cerca de 0,02), então 98%
   desistem após despejar. Em 10 dias, todos os 29 a 30 inícios de "indo
   para a frente" foram de recrutas novas; nenhuma voltou após despejar.
3. **Recrutas se perdem e ocupam a vaga.** A recruta escolhe a frente mais
   marcada do ninho inteiro, mas segue o odor genérico de "frente", que leva
   à frente mais próxima. Ao chegar numa frente que não é a dela, não adota
   essa frente (a troca só acontece quando ela fica sem rota) e continua
   andando. Ficam em média de 3,4 a 4,2 dias (p90 de 8 dias) nesse estado. Das
   que ainda estavam perdidas no fim, 13 de 16 (50 operárias) e 21 de 23 (200)
   tinham passado por outra frente. Como contam na equipe, as equipes ficam
   cheias e ninguém mais é recrutado.
4. **Teto estrutural de frentes.** Só pode haver uma frente por nó de origem.
   Com 200 operárias todas as origens já têm frente (0,1 livre), então o
   número de escavadoras possíveis fica em cerca de 6 × origens, igual para
   100 e 200.
5. **Trânsito nas câmaras.** Já documentado em `fluxo-tunel.md`: com 200, as
   ociosas atrapalham quem carrega terra e alargam túneis. Isso amplifica as
   causas 1 a 4, mas sozinho não as explica: mesmo com 50 operárias a colônia
   dá só cerca de 2 mordidas por dia.

## Comparação com o mecanismo de Buhl

No experimento, a escavação começa rápida porque as operárias que cavam
reforçam o local e recrutam outras, e desacelera quando a densidade de
operárias por área escavada cai. No Viveiro, o reforço (1) não acontece, a
persistência (2) é quase nula e a ocupação das equipes (3) trava o
recrutamento. Por isso o volume é pequeno, quase linear no tempo e não cresce
com o grupo.

## O que testar a seguir (só no modo por feromônio, que é opcional)

- Evaporação na escala do intervalo entre mordidas, ou depósito também pelas
  carregadoras na trilha entre frente e saída (o comentário do código já
  descreve essa trilha, mas ela não é depositada).
- Fidelidade à tarefa: depois de despejar, continuar com alta probabilidade
  enquanto a frente estiver aberta.
- Recruta que chega a uma frente aberta adota essa frente na hora, ou a rota
  usa "qualquer frente" como destino.
- Avaliar mais de uma frente por origem.

Ajustar com sementes separadas para ajuste e para teste, e só então comparar
com Buhl.
