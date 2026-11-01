# Escolha probabilística e divisão de tarefas

Pilar técnico do [kit de divulgação](../kit-divulgacao.html) · código em `src/modules/chemistry/aco.ts` e `src/modules/colony/response.ts` · [índice das fórmulas](README.md)

## As fórmulas

**Escolha do caminho (otimização por colônia de formigas, ACO):**

$$
P(i) = (1 - \epsilon)\,\frac{\tau_i^{\alpha}\,\eta_i^{\beta}}{\sum_k \tau_k^{\alpha}\,\eta_k^{\beta}} + \frac{\epsilon}{N}
$$

**Resposta a uma tarefa (limiar de resposta):**

$$
P(\text{aceitar}) = \frac{S^2}{S^2 + \theta^2}
$$

| Símbolo    | Significado                                                       | Valor no Viveiro                                                                                                    |
| ---------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| $\tau_i$   | feromônio sentido na saída $i$                                    | amostrado a 0,7 unidade da formiga                                                                                  |
| $\eta_i$   | atratividade local da saída (direção do objetivo, alimento visto) | calculada pelos sensores                                                                                            |
| $\alpha$   | peso do feromônio                                                 | 1,4 nos túneis; na superfície, de 0,8 a 1,2 conforme o gene das antenas                                             |
| $\beta$    | peso da atratividade local                                        | 2                                                                                                                   |
| $\epsilon$ | chance de explorar ao acaso                                       | 2,5% nos túneis; na superfície, a partir de 3%, maior com o controle de aleatoriedade e a personalidade exploradora |
| $N$        | número de saídas                                                  | —                                                                                                                   |
| $S$        | intensidade do estímulo percebido (sujeira, prole com fome...)    | sentido num raio local                                                                                              |
| $\theta$   | limiar individual da formiga para aquela tarefa                   | entre 0,15 e 0,90, fixo pela seed                                                                                   |

O limiar muda com a idade e a casta: para cuidar da prole, ele é multiplicado por 0,55 em operárias com menos de 1,5 dia e por 1,8 nas mais velhas. Para defesa, por 0,4 em soldados e por 2 nas demais.

## Em palavras

**ACO:** cada saída do túnel recebe um peso que combina o cheiro deixado pelas outras ($\tau$) e o que a formiga percebe ali ($\eta$). A escolha é sorteada com esses pesos: o melhor caminho é o mais provável, mas não o único. A pequena chance de exploração garante que caminhos novos continuem sendo testados.

**Limiares:** cada formiga tem uma sensibilidade diferente para cada tarefa. Com estímulo fraco, só as mais sensíveis respondem. Se o estímulo cresce, por exemplo muita sujeira acumulada, as menos sensíveis também entram. Assim, a colônia divide o trabalho sem ninguém dar ordens.

## Exemplos resolvidos

**ACO com duas saídas.**

1. Saída A tem o dobro de feromônio ($\tau = 2$ contra 1), atratividade igual. Pesos: $2^{1{,}4} = 2{,}64$ contra 1. Probabilidades nos túneis: 72% para A e 28% para B, já com os 2,5% de exploração.
2. Agora a saída A tem atratividade 0,5 (por exemplo, leva para longe do objetivo). Peso de A: $2{,}64 \times 0{,}5^2 = 0{,}66$. As chances se invertem: 40% para A e 60% para B.
3. Com $\tau = 4$ contra 1, A sobe para 86%. Esse reforço é o que transforma um caminho levemente melhor numa trilha dominante.

**Limiar de resposta.**

| Formiga                  | Limiar $\theta$    | Estímulo $S$ | Chance de aceitar |
| ------------------------ | ------------------ | ------------ | ----------------- |
| Sensível                 | 0,3                | 0,3          | 50%               |
| Sensível                 | 0,3                | 0,6          | 80%               |
| Pouco sensível           | 0,9                | 0,6          | 31%               |
| Jovem, cuidando da prole | 0,9 × 0,55 = 0,495 | 0,6          | 60%               |
| Velha, cuidando da prole | 0,9 × 1,8 = 1,62   | 0,6          | 12%               |

A mesma formiga tem chances muito diferentes conforme a idade. É o polietismo etário: jovens cuidam da prole, mais velhas saem para buscar comida.

## Na vida real

- **Logística.** Algoritmos ACO, criados por Marco Dorigo nos anos 1990, são usados para planejar rotas de entrega, roteamento em redes de telecomunicação e escalas de produção.
- **O experimento da ponte dupla.** Deneubourg e colegas (1990) deram a formigas reais duas pontes até a comida. Elas passaram a usar quase só a mais curta, pelo mesmo reforço de feromônio que a fórmula descreve.
- **Robôs em enxame.** Limiares de resposta dividem tarefas entre robôs sem coordenador central, por exemplo, quem vai recarregar e quem continua trabalhando.
- **Equipes humanas.** A ideia ajuda a pensar em plantões e voluntariado: quando o problema cresce, mais gente se dispõe a ajudar.

## Atividade prática

1. Monte duas "pontes" com fitas no chão até uma caixa de "comida": uma de 3 metros e outra de 6.
2. Cada aluno lança uma moeda na primeira viagem para escolher a ponte. Ao voltar, deixa um clipe na ponte usada.
3. Nas viagens seguintes, a chance de escolher cada ponte é proporcional ao número de clipes. Quem usa a ponte curta volta antes e deposita clipes mais rápido.
4. Depois de 10 rodadas, conte os clipes. Compare com a fórmula do ACO.
5. No Viveiro, abra uma formiga em primeira pessoa e veja a tarefa atual dela mudar quando a colônia acumula sujeira ou prole.

## Limites

Os estímulos são abstratos e só existem dentro de um raio local. Os pesos $\alpha$ e $\beta$, os limiares e os multiplicadores por idade não foram calibrados para uma espécie.

## Referências

- Dorigo, M.; Stützle, T. _Ant Colony Optimization_. MIT Press, 2004.
- Deneubourg, J.-L. et al. The self-organizing exploratory pattern of the Argentine ant. _Journal of Insect Behavior_ 3, 159–168 (1990).
- Bonabeau, E.; Theraulaz, G.; Deneubourg, J.-L. Quantitative study of the fixed threshold model for the regulation of division of labour in insect societies. _Proceedings of the Royal Society B_ 263, 1565–1569 (1996).
- Documentação do projeto: [campos.md](../../campos.md) e [colonia.md](../../colonia.md).
