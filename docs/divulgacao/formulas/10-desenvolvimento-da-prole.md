# Prole que depende da temperatura local

Pilar técnico do [kit de divulgação](../kit-divulgacao.html) · código em `src/modules/development/` e `src/modules/seasons/` · [índice das fórmulas](README.md)

## As fórmulas

$$
r(T) = \max\!\left(0,\ \min\!\left(1,\ \frac{T - 10}{15},\ \frac{38 - T}{13}\right)\right)
$$

$$
\Delta\text{progresso} = \frac{s}{100\,d}\cdot r(T)\cdot r(\text{água})\cdot\text{alimento}\cdot\text{variação}\cdot(1 - 0{,}5\,\text{estresse})
$$

| Símbolo          | Significado                                                    | Valor no Viveiro                                     |
| ---------------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| $T$              | temperatura medida na própria cria ou em quem a carrega        | °C                                                   |
| $r(T)$           | resposta térmica: 0 a 1                                        | zero abaixo de 10 °C e acima de 38 °C, pico em 25 °C |
| $r(\text{água})$ | resposta à água do solo                                        | zero em 12%, platô entre 37% e 80%, zero em 98%      |
| $s$              | tamanho do estágio no indicador de progresso                   | ovo 0,35; larva 0,55; pupa 0,40                      |
| $d$              | duração de referência do estágio                               | ovo 0,5; larva 0,8; pupa 0,6 dia do modelo           |
| alimento         | fração do custo da larva efetivamente paga                     | de 0 a 1                                             |
| variação         | diferença individual e genética                                | entre 0,855 e 1,155                                  |
| estresse         | carga acumulada por fome, seca ou temperatura fora dos limites | de 0 a 1                                             |

**Diapausa:** a colônia entra em repouso depois de 40 dias ativos ou após dois dias seguidos de frio ou dias curtos. Para sair, precisa acumular **5 dias entre 5 e 12 °C**, ficar pelo menos 5 dias em repouso e ter um dia seguido acima de 18 °C. Só aquecer não basta.

## Em palavras

Ovos, larvas e pupas crescem mais rápido no calor, mas só até certo ponto. Acima do ideal, o crescimento cai, e acima do limite para. Essa curva em forma de telhado, com temperaturas mínima, ótima e máxima, chama-se resposta de temperaturas cardinais.

O crescimento também depende de umidade adequada e, para larvas, de comida: se a colônia paga só metade do alimento, a larva cresce na metade do ritmo. Condições ruins acumulam estresse, que reduz o crescimento e pode matar a cria.

A diapausa funciona como um relógio sazonal com memória: a colônia só retoma a postura depois de ter passado frio suficiente.

## Exemplo resolvido

**Resposta térmica:**

| Temperatura | $(T-10)/15$ | $(38-T)/13$ | $r(T)$ |
| ----------- | ----------- | ----------- | ------ |
| 8 °C        | negativo    | —           | 0      |
| 15 °C       | 0,33        | 1,77        | 0,33   |
| 20 °C       | 0,67        | 1,38        | 0,67   |
| 25 °C       | 1,00        | 1,00        | 1,00   |
| 30 °C       | 1,33        | 0,62        | 0,62   |
| 32 °C       | 1,47        | 0,46        | 0,46   |
| 38 °C       | 1,87        | 0           | 0      |

**Duração da fase de larva**, com água adequada, sem estresse e variação 1:

1. A 25 °C e bem alimentada: avanço por tick $= 0{,}55 / (100 \times 0{,}8) = 0{,}0069$. O estágio dura 80 ticks, ou 0,8 dia do modelo.
2. A 20 °C: $r = 0{,}67$, então 1,2 dia.
3. A 20 °C e com só metade do alimento pago: 2,4 dias.
4. A 32 °C: $r = 0{,}46$, então 1,7 dia. Calor demais atrasa tanto quanto frio.

## Na vida real

- **Agricultura e pragas.** Técnicos calculam "graus-dia" para prever quando uma praga vai eclodir e qual é o melhor momento de controle. É a mesma ideia de somar desenvolvimento proporcional à temperatura.
- **Germinação de sementes.** Cada cultura tem temperaturas mínima, ótima e máxima de germinação, a mesma curva de três pontos.
- **Entomologia forense.** O tamanho de larvas de moscas num corpo, combinado com a temperatura do local, ajuda a estimar há quanto tempo ocorreu a morte.
- **Frutas de clima temperado.** Macieiras e pessegueiros precisam acumular "horas de frio" no inverno para florescer bem, como a memória de frio da diapausa.
- **Fermentação.** Leveduras de pão e cerveja têm temperatura ótima, e calor demais mata a fermentação.

## Atividade prática

1. Coloque sementes de feijão em algodão úmido em três locais: geladeira (cerca de 5 °C), sala (cerca de 25 °C) e perto de uma fonte de calor (cerca de 35 °C).
2. Anote todos os dias quantas germinaram e o tamanho da raiz.
3. Monte o gráfico de velocidade de germinação por temperatura e compare com a curva $r(T)$.
4. No Viveiro, acompanhe as cores de estresse da prole ao esfriar ou aquecer o ar e veja quanto tempo o solo leva para mudar de temperatura.

## Limites

O pico em 25 °C, os limites de 10 e 38 °C e as durações são escolhas demonstrativas em dias acelerados do modelo, não valores de uma espécie. Faixas naturais recebidas como hipóteses, como 10 a 14 dias para ovos, estão registradas no catálogo, mas não estão ativas.

## Referências

- Kipyatkov, V. E.; Lopatina, E. B. Síntese sobre respostas térmicas do desenvolvimento em formigas. _Entomological Science_ (2015). https://doi.org/10.1111/ens.12098
- Willot, Q. et al. Estudo de dormência em cinco espécies temperadas (2026). https://doi.org/10.1111/1365-2435.70359
- Yan, W.; Hunt, L. A. An equation for modelling the temperature response of plants using only the cardinal temperatures. _Annals of Botany_ 84, 607–614 (1999).
- Documentação do projeto: [maturacao.md](../../maturacao.md) e [sazonalidade.md](../../sazonalidade.md).
