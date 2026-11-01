# Terra que cai e se acomoda

Pilar técnico do [kit de divulgação](../kit-divulgacao.html) · código em `src/modules/granular/` · [índice das fórmulas](README.md)

## As fórmulas

$$
F_n = \max(0,\ k\,\delta - c\,v_n)\; m_{red}
\qquad
|J_t| \le \mu\,J_n
\qquad
\mu = \tan\theta_{repouso}
$$

| Símbolo            | Significado                                                           | Valor no Viveiro           |
| ------------------ | --------------------------------------------------------------------- | -------------------------- |
| $\delta$           | quanto dois agregados se sobrepõem                                    | medido                     |
| $v_n$              | velocidade relativa na direção do contato (negativa = se aproximando) | medida                     |
| $k$                | rigidez da "mola" de contato                                          | 0,08                       |
| $c$                | amortecimento: perda de energia no choque                             | 0,3                        |
| $m_{red}$          | massa reduzida $m_1 m_2 / (m_1 + m_2)$                                | do volume de cada agregado |
| $J_n$, $J_t$       | impulso normal e tangencial (atrito)                                  | —                          |
| $\mu$              | coeficiente de atrito                                                 | $\tan\theta$               |
| $\theta_{repouso}$ | ângulo de repouso do material                                         | controle de 15° a 55°      |
| $g$                | gravidade                                                             | 0,0016 unidade/tick²       |

Cada tick tem 4 subpassos de 0,25. A velocidade de um agregado é limitada a 0,008 unidade por tick.

## Em palavras

A terra escavada não some: vira agregados esféricos com volume, posição e velocidade. Eles caem pela gravidade, batem uns nos outros e no solo, e param.

No contato, os agregados se comportam como molas com freio: quanto mais se sobrepõem, mais se empurram, e o freio tira energia do choque para que não fiquem quicando. Os impulsos são iguais e opostos, então o momento do par se conserva.

O atrito segue a lei de Coulomb: a força que segura um agregado parado tem um limite, proporcional à força que o aperta contra a superfície. Numa rampa, ele fica parado enquanto a tangente da inclinação não passar de $\mu$.

## Exemplo resolvido

**Rampa.** Com ângulo de repouso de 30°, $\mu = \tan 30° = 0{,}577$.

| Inclinação | $\tan$ | Comparação com $\mu$ | Resultado   |
| ---------- | ------ | -------------------- | ----------- |
| 25°        | 0,466  | menor                | fica parado |
| 35°        | 0,700  | maior                | escorrega   |

**Choque.** Dois agregados iguais se sobrepõem $\delta = 0{,}01$ e se aproximam a $v_n = -0{,}002$:

$F_n / m_{red} = 0{,}08 \times 0{,}01 - 0{,}3 \times (-0{,}002) = 0{,}0008 + 0{,}0006 = 0{,}0014$.

Metade da força vem da sobreposição e metade do amortecimento. Se eles já estivessem se afastando, o amortecimento reduziria a força, e ela nunca fica negativa, porque terra não "puxa" terra.

## Na vida real

- **Silos e indústria.** O ângulo de repouso define a forma dos montes de grãos, areia e minério, e o projeto de silos e esteiras.
- **Deslizamentos.** Encostas mais íngremes que o ângulo de repouso do material tendem a escorregar, sobretudo quando a água reduz o atrito.
- **Farmácia e alimentos.** O escoamento de pós, como farinha e comprimidos moídos, é avaliado pelo ângulo de repouso.
- **Mineração e engenharia.** O método dos elementos discretos (DEM), que usa contatos de mola com atrito como estes, simula britadores, moinhos e carregamento de caminhões.

## Atividade prática

1. Despeje devagar areia seca, açúcar e arroz em pilhas separadas sobre papel.
2. Meça a altura $h$ e o diâmetro $D$ de cada cone. O ângulo é $\arctan(2h/D)$. Por exemplo, $h = 5$ cm e $D = 17$ cm dão cerca de 30°.
3. Repita com a areia levemente úmida e compare.
4. No Viveiro, mude o controle "Repouso da terra" de 15° para 55° e observe como a terra solta se acomoda nos túneis.

## Limites

Os agregados são macroscópicos: um deles não equivale a um grão real. O solo compacto não é discretizado, e não há fratura de grãos, rotação, pressão de poros nem soterramento de formigas. O ângulo é um parâmetro do material, não uma medida tirada da umidade.

## Referências

- Cundall, P. A.; Strack, O. D. L. A discrete numerical model for granular assemblies. _Géotechnique_ 29, 47–65 (1979).
- Al-Hashemi, H. M. B.; Al-Amoudi, O. S. B. A review on the angle of repose of granular materials. _Powder Technology_ 330, 397–417 (2018).
- Documentação do projeto: [granular.md](../../granular.md).
