# Andar sobre uma superfície implícita

Pilar técnico do [kit de divulgação](../kit-divulgacao.html) · código em `src/modules/terrain/field.ts` e `src/modules/terrain/surface-queries.ts` · [índice das fórmulas](README.md)

## A fórmula

$$
\vec v_t = \vec v - \vec n\,(\vec v \cdot \vec n)
\qquad
\vec p\,' = \vec p + \Delta t\,\vec v_t - \big(\varphi(\vec p\,') - m\big)\,\vec n
$$

| Símbolo           | Significado                                                          | Valor no Viveiro |
| ----------------- | -------------------------------------------------------------------- | ---------------- |
| $\varphi(\vec p)$ | campo de distância assinado: distância até a superfície mais próxima | calculado        |
| $\vec n$          | normal da superfície, $\nabla\varphi / \lVert\nabla\varphi\rVert$    | calculada        |
| $\vec v_t$        | parte da velocidade que desliza ao longo da superfície               | —                |
| $m$               | folga entre o corpo e o solo                                         | 0,008 unidade    |
| $\Delta t$        | passo de tempo                                                       | 1 tick           |

O deslocamento final de cada passo é limitado à velocidade da formiga. Se a projeção ultrapassa esse orçamento, o passo é reduzido antes de tentar de novo.

## Em palavras

O solo não é guardado como um monte de triângulos, e sim como uma função: para qualquer ponto do espaço, ela diz a que distância ele está da superfície. Zero é exatamente sobre ela; positivo é no ar; negativo é dentro da terra.

Para andar, a formiga tira da velocidade a parte que entraria no solo ou sairia dele e fica só com a parte que desliza. Depois corrige a posição para manter a folga de contato. Assim ela sobe paredes e anda no teto dos túneis sem atravessar a terra e sem "voar".

## Exemplo resolvido

Uma formiga numa rampa cuja normal é $\vec n = (0;\ 0{,}8;\ 0{,}6)$ tenta andar com $\vec v = (0;\ 0;\ 0{,}02)$, ou seja, de frente para a rampa.

1. **Componente contra a superfície:** $\vec v \cdot \vec n = 0{,}02 \times 0{,}6 = 0{,}012$.
2. **Velocidade tangente:** $(0;\ 0;\ 0{,}02) - 0{,}012 \times (0;\ 0{,}8;\ 0{,}6) = (0;\ -0{,}0096;\ 0{,}0128)$.
3. **Conferência:** $\vec v_t \cdot \vec n = -0{,}00768 + 0{,}00768 = 0$. A nova velocidade é paralela à rampa.
4. **Rapidez:** caiu de 0,020 para 0,016. Parte do esforço foi "absorvida" pela rampa.
5. **Correção:** se depois do passo $\varphi = 0{,}020$ (a formiga ficou 2 centésimos acima), ela volta $0{,}020 - 0{,}008 = 0{,}012$ na direção da normal.

## Na vida real

- **Jogos e computação gráfica.** Campos de distância assinados são a base do _ray marching_, que desenha formas suaves, fumaça e terrenos sem triângulos.
- **Robótica.** Braços robóticos e carros autônomos consultam campos de distância para planejar trajetórias que não colidem com obstáculos.
- **Medicina.** Métodos de _level set_ usam a mesma ideia para separar órgãos e tumores em tomografias.
- **Física.** Remover a componente normal é o que acontece com um objeto deslizando numa rampa: a superfície anula a parte do movimento que a atravessaria.

## Atividade prática

1. Em papel quadriculado, desenhe um círculo de raio 5 centrado na origem. O campo é $\varphi(x, y) = \sqrt{x^2 + y^2} - 5$.
2. Calcule $\varphi$ em alguns pontos: (0, 0), (3, 4), (6, 8). Interprete o sinal.
3. No ponto (3, 4), a normal é (0,6; 0,8). Escolha uma velocidade e calcule a parte tangente.
4. No Viveiro, use a vista lateral e acompanhe uma formiga subindo pela parede do túnel.

## Limites

As cavidades são uniões suaves de esferas e cápsulas, não grãos de terra. A malha desenhada é extraída do mesmo campo, mas com resolução finita: pequenas diferenças visuais podem aparecer.

## Referências

- Osher, S.; Fedkiw, R. _Level Set Methods and Dynamic Implicit Surfaces_. Springer, 2003.
- Hart, J. C. Sphere tracing: a geometric method for the antialiased ray tracing of implicit surfaces. _The Visual Computer_ 12, 527–545 (1996).
- Documentação do projeto: [navegacao.md](../../navegacao.md), seção "Terreno arredondado e apoio".
