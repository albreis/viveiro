# Feromônio por reação-difusão

Pilar técnico do [kit de divulgação](../kit-divulgacao.html) · código em `src/modules/chemistry/reaction-diffusion.ts` · [índice das fórmulas](README.md)

## A fórmula

$$
\frac{\partial C}{\partial t} = D\,\nabla^2 C - \lambda C
\qquad\text{com}\qquad
\frac{4 D \Delta t}{h^2} + \frac{(|v_x| + |v_z|)\,\Delta t}{h} \le 0{,}85
$$

| Símbolo    | Significado                                             | Valor no Viveiro                         |
| ---------- | ------------------------------------------------------- | ---------------------------------------- |
| $C$        | concentração de feromônio numa célula                   | até 5 por célula                         |
| $D$        | coeficiente de difusão: quão rápido o cheiro se espalha | $0{,}008 + 0{,}008\,h_{ar}$              |
| $\lambda$  | taxa de evaporação                                      | $0{,}012 + 0{,}012\,(1 - h_{ar})$        |
| $h_{ar}$   | umidade relativa do ar, de 0 a 1                        | controle do painel                       |
| $h$        | lado da célula da grade                                 | 0,5 unidade (grade de 40 × 26)           |
| $v_x, v_z$ | vento                                                   | controle do painel                       |
| $\Delta t$ | passo de tempo                                          | 1 tick, dividido em subpassos se preciso |

## Em palavras

Há dois processos ao mesmo tempo. A **difusão** ($D\,\nabla^2 C$) faz o cheiro escorrer de onde há mais para onde há menos, como tinta numa piscina. A **evaporação** ($-\lambda C$) faz o cheiro sumir aos poucos. O vento, quando existe, arrasta o cheiro numa direção.

A segunda expressão é uma **condição de estabilidade**. Se o passo de tempo for grande demais para a velocidade do espalhamento, o cálculo começa a oscilar e gera concentrações negativas ou explosivas. O Viveiro divide o passo em subpassos até a condição ser respeitada.

No código, a difusão é feita por **volumes finitos**: cada troca entre duas células vizinhas sai de uma e entra na outra. Assim, sem evaporação, a quantidade total de feromônio nunca muda.

## Exemplo resolvido

Com o ar a 60% de umidade ($h_{ar} = 0{,}6$):

1. **Difusão:** $D = 0{,}008 + 0{,}008 \times 0{,}6 = 0{,}0128$.
2. **Evaporação:** $\lambda = 0{,}012 + 0{,}012 \times 0{,}4 = 0{,}0168$ por tick.
3. **Meia-vida do rastro:** $\ln 2 / \lambda = 41$ ticks, cerca de 0,4 dia do modelo (100 ticks = 1 dia).
4. **Troca entre vizinhas:** a fração trocada por tick é $D\,\Delta t / h^2 = 0{,}0128 / 0{,}25 = 0{,}051$. Uma célula com 1,0 ao lado de uma vazia passa 0,051 para ela no primeiro tick.
5. **Estabilidade sem vento:** $4 \times 0{,}0128 / 0{,}25 = 0{,}20 \le 0{,}85$. Basta um passo.
6. **Com vento de 0,1:** $0{,}20 + 0{,}1 / 0{,}5 = 0{,}40 \le 0{,}85$. Ainda um passo.

Comparando umidades: com ar seco (20%) a meia-vida cai para 32 ticks; com ar úmido (90%) sobe para 53 ticks. Em tempo seco, as trilhas somem mais rápido.

## Na vida real

- **Poluição.** A mesma equação, com um termo de vento ou correnteza, descreve como um vazamento se espalha num rio ou como a fumaça de uma chaminé se dispersa.
- **Calor.** A equação do calor é a de difusão sem evaporação. É assim que se calcula como uma panela esquenta ou como o frio entra numa parede.
- **Remédios.** A liberação de um medicamento por um adesivo na pele é modelada por difusão.
- **Padrões na natureza.** Alan Turing (1952) mostrou que reação-difusão com duas substâncias pode criar manchas e listras, como as de zebras e peixes.
- **Previsão do tempo.** A condição de estabilidade é parente da condição de Courant–Friedrichs–Lewy, que todo modelo climático precisa respeitar.
- **Agricultura.** Armadilhas com feromônio sexual de pragas atraem insetos de longe porque o cheiro se espalha e é carregado pelo vento.

## Atividade prática

1. Encha dois pratos fundos com água, um morno e um frio. Pingue uma gota de corante no centro de cada.
2. Fotografe a cada 30 segundos e meça o diâmetro da mancha.
3. Compare: a temperatura muda $D$. Sopre levemente sobre um terceiro prato para ver o efeito do vento.
4. No Viveiro, altere a umidade e observe por quanto tempo a trilha até uma fonte de comida continua visível.

## Limites

As unidades são internas do modelo. $D$ e $\lambda$ não foram medidos para o feromônio de nenhuma espécie, e a dependência da umidade é uma escolha exploratória.

## Referências

- Crank, J. _The Mathematics of Diffusion_. 2ª ed. Oxford University Press, 1975.
- Turing, A. M. The chemical basis of morphogenesis. _Philosophical Transactions of the Royal Society B_ 237, 37–72 (1952).
- Documentação do projeto: [campos.md](../../campos.md).
