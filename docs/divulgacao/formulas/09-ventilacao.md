# O ninho respira

Pilar técnico do [kit de divulgação](../kit-divulgacao.html) · código em `src/modules/ventilation/` · [índice das fórmulas](README.md)

## As fórmulas

$$
Q_{ab} = G_{ab}\,(p_a - p_b + H_{ab})
\qquad
G_{ab} = 0{,}02\,\frac{r^4}{\ell}\,\text{abertura}^4
\qquad
H_{ab} = 0{,}02\,\frac{T_{solo} - T_{ar}}{T_{ar} + 273{,}15}\,(y_b - y_a)
$$

$$
\sum_b Q_{ab} = 0 \ \text{em cada câmara interna}
\quad\Rightarrow\quad \text{resolvido por gradiente conjugado}
$$

| Símbolo     | Significado                                   | Valor no Viveiro     |
| ----------- | --------------------------------------------- | -------------------- |
| $Q_{ab}$    | fluxo de ar de $a$ para $b$                   | —                    |
| $p_a$       | pressão na câmara $a$                         | incógnita do sistema |
| $G_{ab}$    | condutância do túnel: facilidade de passar ar | —                    |
| $r$, $\ell$ | raio e comprimento do túnel                   | medidos na geometria |
| abertura    | fração livre da seção, reduzida por entulho   | de 0 a 1             |
| $H_{ab}$    | empurrão térmico (efeito chaminé)             | —                    |
| $T$         | temperaturas do solo e do ar, em °C           | —                    |
| $y$         | altura                                        | —                    |

Entradas têm pressão definida pelo vento. A difusão de gases entre câmaras usa $J = 0{,}0005 \cdot \frac{\text{área}}{\ell} \cdot \text{abertura}^2 \cdot (C_a - C_b)$. A atmosfera de referência tem 20,9% de O₂ e 0,042% de CO₂.

## Em palavras

O ninho é tratado como uma rede de canos. As câmaras são os nós, os túneis são os canos, e o ar flui da pressão maior para a menor. O que entra numa câmara precisa sair dela. Escrevendo isso para todas as câmaras, surge um sistema de equações, resolvido pelo método do gradiente conjugado.

Duas coisas movem o ar. O **vento** cria pressões diferentes nas entradas. O **calor** faz o ar quente subir. E o tamanho do túnel importa muito: a condutância depende da quarta potência do raio.

As formigas respiram: consomem O₂ e liberam CO₂. Se o ar não circula, o CO₂ se acumula, e as operárias sentem isso nos sensores de ar.

## Exemplo resolvido

**O poder da quarta potência.** Um túnel com raio 0,15 e comprimento 1, totalmente aberto: $G = 0{,}02 \times 0{,}15^4 / 1 = 0{,}0000101$.

| Mudança                     | Fator na condutância | Fluxo restante |
| --------------------------- | -------------------- | -------------- |
| Entulho deixa metade aberta | $0{,}5^4 = 0{,}0625$ | 6%             |
| Raio cai pela metade        | $0{,}5^4 = 0{,}0625$ | 6%             |
| Raio cai 20%                | $0{,}8^4 = 0{,}41$   | 41%            |

Um pouco de terra no túnel quase sufoca a ventilação. Limpar o entulho tem efeito enorme.

**Efeito chaminé.** Solo a 25 °C e ar a 15 °C: $H = 0{,}02 \times 10 / 288{,}15 = 0{,}00069$ por unidade de altura. Uma galeria vertical cria uma corrente de ar sem nenhum vento.

**Uma entrada ou duas.** Com uma entrada só, o ninho é um beco sem saída: o vento não tem por onde atravessar. Com duas entradas sob pressões diferentes, surge uma corrente de passagem.

## Na vida real

- **Medicina.** O fluxo de sangue segue a lei de Hagen–Poiseuille, com a mesma dependência $r^4$. Um estreitamento de 20% numa artéria corta o fluxo para cerca de 41% se a pressão não mudar, o que explica a gravidade das placas de gordura.
- **Engenharia.** Redes de água, gás e ventilação de minas são calculadas como redes de condutâncias, com a mesma lógica das leis de Kirchhoff para circuitos elétricos.
- **Arquitetura.** Ventilação natural de prédios usa o efeito chaminé: aberturas baixas e altas fazem o ar quente sair por cima.
- **Cupinzeiros.** Montes de cupins têm galerias que trocam gases com o ambiente usando vento e diferenças de temperatura; inspiraram projetos de edifícios ventilados.

## Atividade prática

1. Encha uma seringa sem agulha com água e empurre o êmbolo com força constante, contando o tempo para esvaziar. Repita com um canudo fino na ponta.
2. Compare os tempos e relacione com $r^4$.
3. Acenda um incenso perto de uma janela aberta em cima e outra embaixo, e observe para onde vai a fumaça.
4. No Viveiro, abra o diagrama de ventilação, mude o vento e compare um ninho com uma e com duas entradas.

## Limites

É uma rede isotérmica por compartimento, com analogia de escoamento laminar. Não é dinâmica dos fluidos computacional (CFD), não tem pressões em pascais nem metabolismo medido de uma espécie. Serve para comparar arquiteturas e obstruções.

## Referências

- Sutera, S. P.; Skalak, R. The history of Poiseuille's law. _Annual Review of Fluid Mechanics_ 25, 1–19 (1993).
- King, H.; Ocko, S.; Mahadevan, L. Termite mounds harness diurnal temperature oscillations for ventilation. _PNAS_ 112, 11589–11593 (2015).
- Hestenes, M. R.; Stiefel, E. Methods of conjugate gradients for solving linear systems. _Journal of Research of the NBS_ 49, 409–436 (1952).
- Documentação do projeto: [gases-e-ventilacao.md](../../gases-e-ventilacao.md).
