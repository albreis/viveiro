# Água e calor no solo

Pilar técnico do [kit de divulgação](../kit-divulgacao.html) · código em `src/modules/microclimate/` · [índice das fórmulas](README.md)

## As fórmulas

**Água entre duas células vizinhas:**

$$
q_{ij} = \text{cap}\cdot\Delta t\cdot\Big[\underbrace{0{,}0015\,(s_i - s_j)}_{\text{capilaridade}} + \underbrace{0{,}00015\,\bar s^{\,2}\,\frac{z_i - z_j}{d}}_{\text{gravidade}}\Big]
$$

**Calor entre duas células vizinhas:**

$$
Q_{ij} = (T_j - T_i)\,\frac{(0{,}0008 + 0{,}0012\,\bar s)\,\Delta t}{d^2}
$$

| Símbolo     | Significado                                          | Valor no Viveiro                    |
| ----------- | ---------------------------------------------------- | ----------------------------------- |
| $s_i$       | saturação da célula $i$: água / capacidade dos poros | de 0 a 1                            |
| $\bar s$    | média da saturação das duas células                  | —                                   |
| cap         | capacidade de água da célula: volume × porosidade    | porosidade 0,4                      |
| $z_i - z_j$ | diferença de altura entre as células                 | —                                   |
| $d$         | distância entre os centros                           | —                                   |
| $T$         | temperatura da célula                                | °C                                  |
| $\Delta t$  | passo de integração                                  | a cada 10 ticks, subpassos de até 2 |

A grade tem 20 × 8 × 13 = 2.080 células sob o relevo. Chuva entra pela superfície, lagos cedem água, plantas consomem, e a evaporação é $0{,}0002\,(1 - h_{ar})(1 + \text{luz})$ da água da célula por tick, que também resfria a superfície.

## Em palavras

A água se move por dois motivos. A **capilaridade** puxa água da célula mais molhada para a mais seca, em qualquer direção, inclusive para cima. A **gravidade** puxa para baixo, e com mais força quando o solo já está molhado ($\bar s^2$). Cada troca é limitada pela água disponível e pelo espaço livre, então nada é criado nem perdido.

O calor também passa da célula quente para a fria, e passa melhor em solo úmido, porque a água conduz calor melhor que o ar dos poros. Por isso o subsolo tem "memória": ele demora a esquentar e a esfriar. A temperatura do solo não é copiada do controle do ar.

## Exemplo resolvido

**Camada seca acima de uma molhada.** Célula de cima com $s_i = 0{,}3$, célula de baixo com $s_j = 0{,}6$, uma sobre a outra ($(z_i - z_j)/d = 1$).

1. **Capilaridade:** $0{,}0015 \times (0{,}3 - 0{,}6) = -0{,}00045$. Sinal negativo: a água vai de baixo para cima.
2. **Gravidade:** $\bar s = 0{,}45$; $0{,}00015 \times 0{,}45^2 \times 1 = +0{,}00003$. A água tende a descer.
3. **Total:** $-0{,}00042$. A capilaridade vence com folga, e a camada seca de cima é umedecida por baixo.

**Condução de calor.** O coeficiente vale $0{,}0008 + 0{,}0012 \times 0{,}1 = 0{,}00092$ em solo seco ($\bar s = 0{,}1$) e $0{,}0008 + 0{,}0012 \times 0{,}9 = 0{,}00188$ em solo encharcado. O calor passa duas vezes mais rápido no solo molhado.

## Na vida real

- **Irrigação.** A irrigação por gotejamento aproveita a capilaridade para espalhar água pelas raízes sem encharcar o solo.
- **Umidade nas paredes.** A umidade que sobe do chão pelas paredes de casas antigas é capilaridade em materiais porosos.
- **Adegas e tocas.** Vinhos são guardados em subsolos, e muitos animais cavam tocas, porque alguns metros de terra amortecem as variações de temperatura do dia e do ano.
- **Bombas de calor geotérmicas.** Usam a temperatura estável do subsolo para aquecer e resfriar prédios.
- **Agricultura de precisão.** Sensores de umidade e temperatura do solo orientam plantio e rega.

## Atividade prática

1. Coloque a ponta de uma tira de papel-toalha num copo com água colorida e marque a altura a cada minuto. Isso é capilaridade.
2. Encha dois potes com terra, um seco e um úmido, e deixe ao sol. Meça a temperatura a 5 cm de profundidade a cada 15 minutos.
3. Compare as curvas: o solo úmido muda mais devagar.
4. No Viveiro, abra os mapas de água e calor, faça chover e acompanhe a frente de umidade descendo e se espalhando.

## Limites

É uma tendência capilar simplificada, não a equação de Richards com curva de retenção. Não há calor carregado pela água, calor latente de congelamento, nem inundação das câmaras. Os coeficientes usam as unidades do motor e não foram calibrados para um solo real.

## Referências

- Hillel, D. _Introduction to Environmental Soil Physics_. Academic Press, 2003.
- Richards, L. A. Capillary conduction of liquids through porous mediums. _Physics_ 1, 318–333 (1931).
- Documentação do projeto: [agua-e-calor.md](../../agua-e-calor.md).
