# Trânsito por forças sociais

Pilar técnico do [kit de divulgação](../kit-divulgacao.html) · código em `src/modules/navigation/social-forces.ts` · [índice das fórmulas](README.md)

## A fórmula

$$
\vec F = \underbrace{\frac{\vec v_{desejada} - \vec v}{\tau}}_{\text{vontade de ir}} + \underbrace{\sum_j w_j\,A\,\max\!\left(0,\ \frac{1}{d_j+\varepsilon} - \frac{1}{R+\varepsilon}\right)\vec n_j}_{\text{empurrão das vizinhas}} + \vec F_{lateral}
$$

| Símbolo             | Significado                                                        | Valor no Viveiro             |
| ------------------- | ------------------------------------------------------------------ | ---------------------------- |
| $\vec v$            | velocidade atual da formiga                                        | —                            |
| $\vec v_{desejada}$ | direção do objetivo × velocidade própria                           | velocidade depende dos genes |
| $\tau$              | tempo para corrigir o rumo                                         | 2,8 ticks                    |
| $A$                 | intensidade da repulsão                                            | 0,018                        |
| $R$                 | raio de segurança: além dele, a vizinha não empurra                | 0,52 unidade                 |
| $\varepsilon$       | evita divisão por zero quando os corpos se tocam                   | 0,08                         |
| $d_j$, $\vec n_j$   | distância até a vizinha $j$ e direção que aponta para longe dela   | medidos a cada passo         |
| $w_j$               | prioridade: 2 se a vizinha carrega algo e esta está vazia; senão 1 | 1 ou 2                       |
| $\vec F_{lateral}$  | desvio para o lado quando há alguém de frente                      | 0,028 × pressão frontal      |

A força de cada vizinha é limitada a 0,1, e a velocidade final a 1,15 vez a velocidade própria.

## Em palavras

Cada formiga quer ir para algum lugar, e cada vizinha próxima a empurra para longe. O empurrão cresce muito quando a vizinha está perto e some quando ela passa do raio de segurança. Quem carrega comida ou cria empurra com o dobro de força, e por isso ganha passagem. Se alguém bloqueia a frente, surge um desvio para o lado, em vez de as duas ficarem paradas cara a cara.

## Exemplo resolvido

Uma operária vazia quer andar a 0,02 unidade por tick e está parada.

1. **Vontade de ir:** $(0{,}02 - 0)/2{,}8 = 0{,}0071$.
2. **Vizinha carregando larva a 0,2 unidade** ($w = 2$):
   $0{,}018 \times 2 \times \left(\frac{1}{0{,}28} - \frac{1}{0{,}60}\right) = 0{,}018 \times 2 \times 1{,}905 = 0{,}0686$.
3. **A mesma vizinha, mas vazia** ($w = 1$): $0{,}0343$.
4. **Vizinha vazia a 0,4 unidade:** $0{,}0075$, quase igual à vontade de ir.
5. **Vizinha a 0,6 unidade:** está além de $R = 0{,}52$, então o empurrão é zero.

Conclusão: a vizinha carregada perto empurra quase dez vezes mais do que a vontade de seguir em frente. A operária vazia cede, e quem leva a larva passa.

## Na vida real

- **Evacuação de multidões.** Este é o modelo de Helbing e Molnár (1995), criado para pedestres. Ele é usado para projetar saídas de estádios, estações e casas de show. Uma versão estendida mostrou o efeito "mais rápido é mais lento": pressa demais numa porta estreita forma arcos de pessoas que travam a saída.
- **Robôs e drones em grupo.** Repulsão suave entre vizinhos é uma das formas mais simples de evitar colisões em enxames de robôs.
- **Personagens de jogos e filmes.** Multidões animadas usam regras parecidas para que ninguém atravesse ninguém.
- **Formigas de verdade.** Estudos de tráfego em trilhas (Poissonnier et al., 2019) mostram que formigas mantêm o fluxo mesmo em densidades altas, o que inspira a regra de ceder passagem.

## Atividade prática

1. Marque no chão um corredor de 1 metro de largura com uma "porta" de 50 cm.
2. Peça que 10 alunos atravessem a porta andando e cronometre. Repita pedindo pressa.
3. Compare os tempos. Discuta por que a pressa pode piorar o resultado e onde aparecem os termos da fórmula: vontade de ir (pressa) e empurrão (contato).
4. No Viveiro, observe um túnel congestionado em primeira pessoa e identifique quem cede passagem.

## Limites

A fórmula foi criada para pessoas. A adaptação para formigas, os valores dos parâmetros e o contato antenal não foram validados com dados de formigas. As unidades são internas do modelo (unidade de cenário e tick), não newtons.

## Referências

- Helbing, D.; Molnár, P. Social force model for pedestrian dynamics. _Physical Review E_ 51, 4282 (1995). https://doi.org/10.1103/PhysRevE.51.4282
- Helbing, D.; Farkas, I.; Vicsek, T. Simulating dynamical features of escape panic. _Nature_ 407, 487–490 (2000).
- Poissonnier, L.-A. et al. Experimental investigation of ant traffic under crowded conditions. _eLife_ 8, e48945 (2019). https://elifesciences.org/articles/48945
- Documentação do projeto: [navegacao.md](../../navegacao.md).
