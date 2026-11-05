# Atividade individual na arena de Buhl

Ative `observeActivity: true` no plano da arena para medir acesso à
areia, esforço e retirada por operária. As amostras registram quantas
operárias estão junto à areia, tentativas de movimento bloqueadas por
outras operárias, segundos de escavação e transporte somados no grupo
e tentativas de escavar que terminaram com ou sem carga. Ao fim, o
resultado inclui segundos de escavação e massa removida por operária.

O indicador de inatividade adjacente conta operárias vizinhas que
passaram ao menos dez segundos sem andar, cavar ou carregar, fora das
frentes e sem bloqueio recente por outra operária. É uma definição de
observação para separar fila e inatividade. A arena ainda precisa de
uma regra de agregação social e de uma classificação compatível com
os dados de campo. [Evidência de agregação](buhl-variaveis.md).

## Piloto de duas horas

O [recibo](../validacoes/buhl-atividade-piloto.json) contém uma réplica
pareada de 100 operárias, com sete amostras por variante e totais
individuais. O controle retirou 3,303 g e somou 23,00 horas de escavação
entre as operárias. Com fadiga foram 3,228 g e 22,47 horas. A razão ficou
próxima de 144 mg por hora de escavação nos dois casos. Nenhuma amostra
registrou inatividade adjacente pelo critério de dez segundos.

Isso verifica os contadores e sugere que a diferença nessa réplica veio
do tempo dedicado a cavar. O piloto ainda precisa ser repetido para
estimar a variação entre seeds e grupos. A instrumentação foi conferida
contra a trajetória sem observação e o balanço do solo.

Para repetir cada variante, use o objeto `plan` do recibo com
`node scripts/run-buhl-arena.ts plano.json`. Na variante de fadiga,
inclua `"digFatigue": "work-recovery"` no plano.

## Próxima comparação de microclima

- **Temperatura.** Comparar o efeito isolado sobre a locomoção usando
  16, 25 e 30 °C como condições da literatura de caminhada. A resposta
  da recuperação ao calor exige um fator experimental separado.
  [Challet et al.](https://doi.org/10.1007/s00040-005-0821-1)
- **Água na areia.** Definir teor de água por massa seca e testar
  diferenças no custo ou tempo por pelota. A dose de 25 mL do protocolo
  não informa por si só o teor retido. O sinal da resposta precisa ser
  tratado como hipótese. [Métodos e lacunas](buhl-variaveis.md).
- **Vento.** Testar primeiro o fluxo como fator de secagem, com temperatura
  e umidade do ar fixadas. Um controle com água constante separa a via
  de secagem de efeitos de orientação pelo fluxo. [Revisão ambiental](buhl-variaveis.md).

Manter um controle pareado e rodar cada condição com e sem fadiga. A
primeira triagem deve publicar chegadas às frentes, tentativas,
segundos escavados, retirada por hora ativa e disposição média, além
da curva de volume. Fixar os parâmetros de cada hipótese antes do lote.
A evidência empírica independente segue como requisito do B7.
