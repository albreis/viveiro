# Prever e medir o erro

Pilar técnico do [kit de divulgação](../kit-divulgacao.html) · código em `src/modules/forecast/` e `scripts/evaluate-forecasts.mjs` · [índice das fórmulas](README.md)

## As fórmulas

**Extrapolação só com contagens:**

$$
N(t + \Delta t) = \text{limitar}\big(N(t) + b\,\Delta t + r\sqrt{\Delta t},\ 0,\ 450\big)
\qquad
r_i = \frac{\Delta N_i - b\,\Delta t_i}{\sqrt{\Delta t_i}}
$$

**Medidas de erro**, com $e = \text{mediana prevista} - \text{resultado}$:

$$
\text{MAE} = \overline{|e|}
\qquad
\text{RMSE} = \sqrt{\overline{e^2}}
\qquad
\text{viés} = \overline{e}
\qquad
\text{cobertura} = \text{fração dos resultados entre P10 e P90}
$$

| Símbolo    | Significado                                       | Valor no Viveiro         |
| ---------- | ------------------------------------------------- | ------------------------ |
| $N$        | número de adultos                                 | limitado a 450           |
| $b$        | tendência: adultos por dia, por mínimos quadrados | últimos 3 dias de censos |
| $r$        | resíduo sorteado do passado, já centralizado      | sorteio com reposição    |
| $\Delta t$ | passo estatístico                                 | no máximo 0,25 dia       |
| P10, P90   | faixa onde caem 80% das trajetórias simuladas     | quantis empíricos        |

**Os três métodos comparados:**

| Método          | O que sabe                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| Estado completo | tudo: agentes, prole, estoque, solo, ar, cérebros; roda o modelo inteiro várias vezes com sorteios diferentes |
| Só contagem     | apenas os censos de adultos dos últimos 3 dias                                                                |
| Base constante  | supõe que a população não muda                                                                                |

## Em palavras

Prever é fácil; difícil é saber o quanto a previsão erra. O Viveiro faz várias previsões a partir do mesmo momento e compara com o que aconteceu de verdade numa continuação separada do modelo.

O modo "só contagem" estima a tendência pela reta que melhor passa pelos censos, e soma variações sorteadas a partir das oscilações já vistas. O erro dessas variações cresce com $\sqrt{\Delta t}$, como um passeio aleatório.

As quatro medidas dizem coisas diferentes. MAE é o erro médio em adultos. RMSE pune mais os erros grandes. Viés mostra se a previsão erra sempre para o mesmo lado. Cobertura mostra se a faixa de incerteza é honesta: uma faixa de 80% deveria conter o resultado em cerca de 80% das vezes.

## Exemplo resolvido

**Tendência.** Censos de 80, 84, 86 e 91 adultos nos dias 0, 1, 2 e 3.

1. Médias: dia 1,5; população 85,25.
2. $b = \dfrac{\sum (x - \bar x)(y - \bar y)}{\sum (x - \bar x)^2} = \dfrac{17{,}5}{5} = 3{,}5$ adultos por dia.
3. Variações observadas: +4, +2, +5. Resíduos: $4 - 3{,}5 = 0{,}5$; $-1{,}5$; $+1{,}5$. Média 0,17; centralizados: 0,33; −1,67; 1,33.
4. Previsão central para 3 dias depois do dia 3: $91 + 3 \times 3{,}5 = 101{,}5$, com as trajetórias espalhando em torno disso pelos resíduos sorteados.

**Erro.** Previsões 95, 100 e 104; resultados 93, 103 e 104.

1. Erros: +2, −3, 0.
2. MAE $= (2 + 3 + 0)/3 = 1{,}67$ adulto.
3. RMSE $= \sqrt{(4 + 9 + 0)/3} = 2{,}08$, maior que o MAE porque o erro de 3 pesa mais.
4. Viés $= -0{,}33$: quase sem tendência para um lado.

**Resultado do ensaio do projeto** (3 seeds, 2 origens, 6 futuros cada), erro médio em adultos:

| Horizonte | Estado completo | Só contagem | Base constante |
| --------- | --------------- | ----------- | -------------- |
| 1 dia     | 0,83            | 1,33        | 6,67           |
| 3 dias    | 0,33            | 6,00        | 21,33          |
| 7 dias    | 1,17            | 20,67       | 35,50          |

Com pouca informação, o erro cresce rápido com o horizonte. É a mesma razão pela qual a previsão do tempo é boa para amanhã e ruim para daqui a duas semanas.

## Na vida real

- **Previsão do tempo.** Centros meteorológicos rodam dezenas de versões do mesmo modelo com condições levemente diferentes, um "ensemble", para estimar a incerteza.
- **Epidemias.** Durante surtos de gripe e covid-19, equipes de pesquisa publicaram previsões com faixas de incerteza e foram avaliadas por cobertura e erro.
- **Caos.** Edward Lorenz mostrou, nos anos 1960, que pequenas diferenças iniciais crescem até tornar a previsão inútil depois de um horizonte: o efeito borboleta.
- **Negócios.** Estoques, vendas e demanda de energia são previstos e avaliados com MAE e RMSE.

## Atividade prática

1. Durante uma semana, a turma registra a temperatura da sala três vezes por dia.
2. Cada grupo prevê os próximos 3 dias: um com a reta de tendência, outro repetindo o último valor.
3. Compare MAE, RMSE e viés dos dois métodos. Discuta qual informação faltou.
4. No Viveiro, abra o painel de previsão, alterne entre estado completo e só contagem e baixe as métricas em JSON.

## Limites

O erro é medido contra o próprio modelo, não contra formigas reais. O ensaio usa 6 origens por horizonte, correlacionadas dentro de 3 seeds, um único regime de parâmetros e colônias pequenas. Isso não permite afirmar cobertura nominal, significância ou validade na natureza.

## Referências

- Hyndman, R. J.; Athanasopoulos, G. _Forecasting: Principles and Practice_. 3ª ed. OTexts, 2021. Disponível gratuitamente online.
- Lorenz, E. N. Deterministic nonperiodic flow. _Journal of the Atmospheric Sciences_ 20, 130–141 (1963).
- Gneiting, T.; Raftery, A. E. Strictly proper scoring rules, prediction, and estimation. _Journal of the American Statistical Association_ 102, 359–378 (2007).
- Documentação do projeto: [avaliacao-previsoes.md](../../avaliacao-previsoes.md) e [previsoes.md](../../previsoes.md).
