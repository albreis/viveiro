# O teto do túnel aguenta?

Pilar técnico do [kit de divulgação](../kit-divulgacao.html) · código em `src/modules/structure/` · [índice das fórmulas](README.md)

## As fórmulas

$$
\sigma = \rho\,g\,H
\qquad
\sigma' = \max(0,\ \sigma - u)
\qquad
c = \big[0{,}0003 + 0{,}0015 \cdot 4S(1-S)\big]\cdot \max(0{,}02,\ I)
$$

$$
\text{capacidade} = \underbrace{\frac{2\,(c + \sigma' \tan\varphi)\,t\,A}{L}}_{\text{cisalhamento}} + \underbrace{\frac{6\,c\,t^2}{L^2}}_{\text{flexão}}
\qquad
\text{carga} = \sigma\,(1 - 0{,}45\,A)
\qquad
\text{margem} = \frac{\text{capacidade}}{\text{carga}}
$$

| Símbolo   | Significado                                          | Valor no Viveiro                                  |
| --------- | ---------------------------------------------------- | ------------------------------------------------- |
| $S$       | saturação: fração dos poros do solo ocupada por água | lida no campo de água, perto do teto              |
| $\rho$    | densidade do solo, maior quando molhado              | $1 + 0{,}7\,S$                                    |
| $g$       | gravidade                                            | 0,0016                                            |
| $H$       | profundidade até a superfície                        | medida no campo do terreno                        |
| $u$       | pressão da água nos poros                            | $0{,}9\,g\,H \cdot \max(0,\ (S - 0{,}85)/0{,}15)$ |
| $\sigma'$ | tensão efetiva: o que realmente aperta os grãos      | —                                                 |
| $c$       | coesão: o quanto o solo "gruda"                      | máxima com solo meio úmido                        |
| $I$       | integridade: o que resta do material após desgaste   | de 0 a 1                                          |
| $\varphi$ | ângulo de atrito                                     | controle de repouso da terra                      |
| $L$       | vão do túnel                                         | medido                                            |
| $t$       | espessura de solo acima                              | até $0{,}65\,L + 0{,}08$                          |
| $A$       | fração de apoio lateral                              | de 0 a 1, de seis sondagens                       |

A cada 50 ticks, se a margem for menor que 1, o dano cresce $0{,}08 \times (1 - \text{margem})$. Com dano 1, um pedaço do teto se solta e vira terra solta.

## Em palavras

O peso da terra acima do túnel é a **carga**. O solo resiste de dois jeitos: por **atrito e coesão** nas laterais, como uma rolha presa num gargalo, e por **flexão**, como uma laje. Se a resistência for menor que a carga, o teto acumula dano até ceder.

A água faz duas coisas opostas. Um pouco de umidade aumenta a coesão: é por isso que castelo de areia só para em pé com areia úmida. Água demais aumenta o peso, enche os poros e empurra os grãos para longe uns dos outros, reduzindo o atrito. É a tensão efetiva de Terzaghi.

## Exemplo resolvido

Túnel a uma profundidade $H = 1$, vão $L = 0{,}5$, espessura $t = 0{,}4$, apoio $A = 0{,}6$, $\varphi = 30°$, material intacto ($I = 1$).

**Solo meio úmido ($S = 0{,}5$):**

1. $\rho = 1{,}35$; carga vertical $\sigma = 1{,}35 \times 0{,}0016 \times 1 = 0{,}00216$.
2. $S < 0{,}85$, então $u = 0$ e $\sigma' = 0{,}00216$.
3. Coesão $c = 0{,}0003 + 0{,}0015 \times 4 \times 0{,}25 = 0{,}0018$, o máximo possível.
4. Cisalhamento $= 2 \times (0{,}0018 + 0{,}00216 \times 0{,}577) \times 0{,}4 \times 0{,}6 / 0{,}5 = 0{,}00293$.
5. Flexão $= 6 \times 0{,}0018 \times 0{,}16 / 0{,}25 = 0{,}00691$.
6. Carga $= 0{,}00216 \times (1 - 0{,}27) = 0{,}00158$. **Margem = 6,2**: muito estável.

**O mesmo túnel com solo encharcado ($S = 0{,}95$):**

1. $\rho = 1{,}665$; $\sigma = 0{,}00266$.
2. $u = 0{,}9 \times 0{,}0016 \times (0{,}10 / 0{,}15) = 0{,}00096$; $\sigma' = 0{,}00170$.
3. $c = 0{,}0003 + 0{,}0015 \times 4 \times 0{,}95 \times 0{,}05 = 0{,}00059$.
4. Capacidade $= 0{,}00151 + 0{,}00225 = 0{,}00375$; carga $= 0{,}00194$. **Margem = 1,9**: caiu 69%.

**Encharcado e com vão maior ($L = 1{,}2$):** a capacidade cai para 0,00102 e a **margem para 0,52**. O dano cresce 0,038 a cada 50 ticks e chega a 1 em cerca de 1.300 ticks, uns 13 dias do modelo. Depois disso, o teto começa a soltar terra.

## Na vida real

- **Túneis e minas.** Engenheiros comparam carga e resistência do maciço para decidir escoramento. O termo $c + \sigma' \tan\varphi$ é o critério de Mohr–Coulomb, base da mecânica dos solos.
- **Deslizamentos depois de chuva forte.** A água nos poros reduz a tensão efetiva e o atrito, e encostas que estavam estáveis cedem. É o que acontece em muitas tragédias em áreas de morro.
- **Castelos de areia.** A coesão máxima com umidade intermediária é a mesma física do termo $4S(1-S)$.
- **Cavernas.** Tetos de cavernas desabam quando o vão cresce além do que a espessura de rocha suporta.

## Atividade prática

1. Monte três torres de areia com o mesmo copo: areia seca, úmida e encharcada.
2. Coloque pesos (moedas) em cima de cada uma até cair. Anote quantas moedas cada uma aguentou.
3. Relacione com a fórmula: a úmida tem mais coesão; a encharcada tem pressão de água e menos atrito.
4. No Viveiro, use a câmera de inspeção do teto, aumente a chuva e acompanhe o dano estrutural de um túnel largo.

## Limites

É uma comparação reduzida entre carga e capacidade, com unidades internas. Não resolve equilíbrio elástico ou plástico em 3D nem cadeias de força entre grãos. A margem não é um fator de segurança normativo e os valores não foram calibrados com ensaios de solo.

## Referências

- Terzaghi, K. _Theoretical Soil Mechanics_. Wiley, 1943.
- Das, B. M. _Principles of Geotechnical Engineering_. Cengage (várias edições).
- Hornbaker, D. J. et al. What keeps sandcastles standing? _Nature_ 387, 765 (1997).
- Documentação do projeto: [suporte-estrutural.md](../../suporte-estrutural.md).
