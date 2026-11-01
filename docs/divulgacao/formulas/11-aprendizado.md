# Um cérebro pequeno por formiga

Pilar técnico do [kit de divulgação](../kit-divulgacao.html) · código em `src/modules/learning/` · [índice das fórmulas](README.md)

## As fórmulas

$$
\delta = r + \gamma\,Q_\theta(s', a') - Q_\theta(s, a)
\qquad
\theta \leftarrow \theta + \alpha\cdot\text{clip}(\delta, -1, 1)\cdot\nabla_\theta Q_\theta(s, a)
$$

| Símbolo         | Significado                                           | Valor no Viveiro                                      |
| --------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| $s$             | situação atual, vista pelos sensores locais           | 6 entradas                                            |
| $a$             | ação: qual saída do túnel seguir                      | uma das saídas adjacentes                             |
| $Q_\theta(s,a)$ | quanto a formiga espera ganhar ao escolher $a$ em $s$ | saída da rede                                         |
| $\theta$        | pesos da rede                                         | 6 entradas → 8 neurônios tanh → 1 saída: 65 pesos     |
| $r$             | recompensa recebida                                   | treino: +1 achar comida, +3 entregar; custo por passo |
| $\gamma$        | quanto o futuro vale em relação ao presente           | 0,95                                                  |
| $\alpha$        | tamanho do passo de aprendizado                       | 0,015 no treino; 0,005 no terrário                    |
| $\delta$        | erro de previsão: surpresa                            | limitado entre −1 e 1                                 |
| exploração      | chance de escolher ao acaso ($\varepsilon$-greedy)    | 12% no treino; 2,5% na avaliação; 5% no terrário      |

As 6 entradas de cada saída candidata são: sinal químico local, visitas recentes, indicação de retorno, objetivo visível, conforto do ar próximo e presença de carga. Nenhuma posição global entra na rede.

## Em palavras

A formiga aprende com a própria surpresa. Antes de escolher uma saída, ela tem uma expectativa ($Q$). Depois de dar um passo, recebe uma recompensa e faz uma nova expectativa. A diferença entre o que esperava e o que obteve é o erro $\delta$. Se foi melhor que o esperado, ela reforça aquela escolha; se foi pior, enfraquece.

Esse método se chama SARSA, sigla em inglês para estado, ação, recompensa, novo estado e nova ação. Cada formiga tem a própria cópia dos pesos, e o que uma aprende não passa para as outras. Quando ela morre, o aprendizado dela vai junto.

## Exemplo resolvido

1. A formiga esperava $Q(s, a) = 0{,}5$ ao escolher uma saída.
2. O passo custou $r = -0{,}01$, e na nova situação a melhor expectativa é $Q(s', a') = 0{,}8$.
3. Erro: $\delta = -0{,}01 + 0{,}95 \times 0{,}8 - 0{,}5 = 0{,}25$. Foi melhor do que ela esperava.
4. Com $\alpha = 0{,}005$ no terrário, cada peso muda $0{,}005 \times 0{,}25 = 0{,}00125$ vezes o gradiente. Mudanças pequenas e acumuladas evitam que uma única experiência estrague o que já foi aprendido.
5. Numa entrega de comida no treino ($r = +3$, fim do episódio, $Q(s, a) = 2$): $\delta = 3 - 2 = 1$, já no limite do recorte.

## Na vida real

- **Neurociência.** Schultz, Dayan e Montague (1997) mostraram que neurônios de dopamina disparam de um jeito parecido com $\delta$: reagem à recompensa inesperada, não à recompensa em si.
- **Jogos.** O TD-Gammon, nos anos 1990, aprendeu gamão em nível de campeão com aprendizado por diferença temporal, a família do SARSA.
- **Robótica e controle.** Robôs aprendem a andar, e semáforos aprendem a reduzir filas, recebendo recompensas por bons resultados.
- **Dia a dia.** Qualquer pessoa que muda de caminho para o trabalho depois de pegar trânsito está atualizando uma expectativa com a própria surpresa.

## Atividade prática

1. Desenhe um labirinto simples no quadro com três bifurcações e uma "comida" no fim.
2. Cada aluno começa com expectativa 0 para cada saída e escolhe, com dado, quando houver empate.
3. Ao achar a comida, a recompensa é 3; cada passo custa 0,1. Atualize as expectativas com a fórmula, usando $\alpha = 0{,}5$ para ver o efeito rápido.
4. Repita 5 vezes e observe as expectativas convergirem para o caminho certo.
5. No Viveiro, treine a política neural, aplique a uma colônia e compare com o ACO no relatório.

## Limites

O treino acontece num ambiente abstrato, mais simples que o terrário 3D. Não há prova de convergência nem garantia de que a política treinada seja melhor no terrário. Não é um modelo do cérebro de formigas: a rede escolhe saídas, mas a física, a fome e o movimento continuam no motor.

## Referências

- Sutton, R. S.; Barto, A. G. _Reinforcement Learning: An Introduction_. 2ª ed. MIT Press, 2018. Disponível gratuitamente online.
- Schultz, W.; Dayan, P.; Montague, P. R. A neural substrate of prediction and reward. _Science_ 275, 1593–1599 (1997).
- Tesauro, G. Temporal difference learning and TD-Gammon. _Communications of the ACM_ 38, 58–68 (1995).
- Documentação do projeto: [aprendizado-local.md](../../aprendizado-local.md).
