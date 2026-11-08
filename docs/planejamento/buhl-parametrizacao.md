# Buhl — parametrização individual e avaliação do motor real

Decisão de 07/11/2026: manter a morfologia no Viveiro e investigar os
volumes menores, sem ajustar a produção coletiva para fazê-los coincidir
com Buhl. Este plano substitui a preferência operacional pela configuração
que mais se aproximava dos volumes; não altera os registros dos ensaios.

## Atualização para a versão 0.48.0

A integração entregue é Narbonne v3 no World, com acesso geométrico às frentes,
e os ensaios opcionais da arena do PR #130. O relato abaixo conserva o estado
da decisão original. Os novos ensaios continuam comparações de desenvolvimento,
sem reclassificar Buhl como evidência independente. O rascunho #128 fica fora
da release; sua branch é preservada. K1–K6 continuam abertos para a réplica
física do experimento. [Estado do motor real](buhl-motor-compartilhado.md).

## Escopo e estado real

A morfologia do perfil Narbonne v2 continua no terrário 3D. O PR #127
retirou sua projeção na arena plana, não o perfil do terrário. O trabalho
seguinte usa o [mesmo motor World](buhl-motor-compartilhado.md), com ambiente
experimental controlado. A arena plana e seus dois resultados permanecem
controles históricos, sem transferir sua validação ao motor 3D.

O piloto de World ainda declara `buhlComparable: false`. Não há nova
execução de 72 horas nem reintegração automática da projeção plana neste
plano. Manter a morfologia não significa que cada regra de porte, carga
e temperatura já tenha sido medida ou validada para essa população.

## O que os resultados históricos permitem dizer

No [lote de morfologia](buhl-narbonne-operarias.md), as médias de 72 h
foram 15,7632/23,8560/36,6560 cm³, para 50/100/200 operárias. Comparadas
às médias da tabela de 2005, 25,35/37,15/65,27 cm³, ficaram aproximadamente
37,8%/35,8%/43,8% abaixo. Esses desvios usam médias, não testes de
significância, e não são resultados do piloto atual de World.

A inclinação log-log passou de 0,847 para 0,609, dentro da faixa de
0,500–0,747 construída dos limites de digitalização. É concordância
parcial do padrão entre grupos, não um intervalo de confiança empírico.
O MAE temporal piorou nos três grupos; a curva inteira não foi reproduzida.
A curva digitalizada de 2001 e a tabela de 2005 ficam sempre separadas.

Menor velocidade, carga e exclusão corporal são explicações candidatas.
O lote alterou esses mecanismos em conjunto e não mede sua contribuição
isolada. A frase “freios sem motores” não é uma conclusão estabelecida.
Tamanho maior não exige um bônus automático de escavação. Efeito positivo
sem dado é lacuna ou hipótese explícita, nunca compensação para acertar o volume.

## Etapas técnicas e critérios de passagem

- [x] **K0 — Registrar a decisão e a exposição aos dados:** preservar a escolha
  anterior e a nova justificativa. Buhl já orientou comparação e seleção de
  variantes; não reclassificar esse material como teste independente.
- [ ] **K1 — Fixar o protocolo no motor real:** dimensões do disco/substrato,
  coorte adulta e condições iniciais sem galerias. Resolver relógio físico,
  geometria e ciclo biológico antes de simular 72 horas físicas. Testar
  conservação, passo temporal e equivalência entre CLI e app; manter o
  indicador de não comparabilidade até esses critérios passarem.
- [ ] **K2 — Montar o registro dos parâmetros:** fonte, espécie/população,
  contexto, unidade, amostra, dispersão, conversão e papel de cada dado.
  Separar medida direta, transferência entre estudos, hipótese e condição
  ambiental desconhecida. Listar mecanismos de porte ausentes ou simplificados.
- [ ] **K3 — Verificar indivíduos e contatos:** velocidade livre e carregada,
  tempo/massa por pelota, passagem entre operárias, esforço e repouso.
  Distinguir mordida, pelota, volume aberto e massa transportada. Uma média
  agregada de pelotas não identifica um efeito causal do tamanho corporal.
- [ ] **K4 — Pré-especificar a análise de incerteza e sensibilidade:** justificar
  distribuições, correlações, faixas, réplicas, precisão Monte Carlo, critérios
  de parada e orçamento. Fixar o plano antes dos novos lotes; documentar
  separadamente escolhas já motivadas pelos resultados históricos.
- [ ] **K5 — Executar e explicar:** variar entradas com respaldo, parear seeds
  ao comparar hipóteses e arquivar todas as rodadas válidas, inclusive ruins.
  Quantificar efeitos isolados e interações antes de atribuir causas ao viés.
  Não escolher parâmetros pela proximidade aos volumes ou ao expoente de Buhl.
- [ ] **K6 — Avaliar e publicar o alcance:** matriz de padrões atendidos,
  parciais, incompatíveis ou não avaliáveis. Reportar erro com sinal, MAE,
  dispersão e incerteza; atualizar ODD e [registro TRACE](buhl-trace.md).
  B7/P3.3 seguem abertos até avaliação com dados empíricos reservados elegíveis.

Os valores medidos por Buhl incluem tempo de escavação por pelota
(42,04 s), massa estimada (1,69 mg) e parâmetros de início de escavação.
Eles têm contexto e incerteza; não são todos coeficientes livres. A fadiga,
a distribuição corporal e penalidades sem medição correspondente continuam
hipóteses identificadas, mesmo quando biologicamente plausíveis.

## Uso dos dados e limites da conclusão

A abordagem passa a priorizar parametrização de baixo para cima. Ela não
apaga o uso anterior dos resultados de Buhl na estrutura/seleção do modelo.
Parâmetros do mesmo experimento também precisam ser identificados como tal.
Seeds novas verificam variabilidade computacional; não criam novas colônias
observadas. Dados já examinados permanecem comparações retrospectivas.

Reservar observações futuras ou ainda não examinadas antes de acessá-las:
proveniência, licença, protocolo, ausência de sobreposição entre publicações,
quais réplicas são de parametrização e quais ficam para avaliação. O uso do
conjunto reservado deve ter plano congelado. Retocar o modelo após acessá-lo
transforma essa rodada em desenvolvimento e exige nova avaliação independente.

Condições ausentes de Buhl, como temperatura, umidade retida e ventilação,
entram como incertezas declaradas. Água adicionada não determina a umidade
retida por 72 h. Valores exploratórios não serão chamados de reconstrução
experimental nem escolhidos para aproximar as curvas.

Ensembles geram faixas condicionais às hipóteses de entrada e estrutura.
Não chamar a faixa entre seeds de intervalo preditivo completo. Incluir ou
excluir a média de Buhl, isoladamente, não prova compatibilidade: considerar
amostragem empírica, dependências, erro de medição e outros padrões. Os ±3 cm³
são incerteza da digitalização, não desvio biológico ou margem geral de aceite.

Toffin e outros estudos podem ampliar padrões após conferir população,
protocolo, acesso e dependência dos dados. Não contam automaticamente como
réplicas independentes, e dados de outra espécie não validam este perfil.

## Entregas e dependências

K1–K6 são trabalho técnico até onde houver dados acessíveis. O mantenedor
recebe decisões e relatórios; não precisa executar código manualmente.
A fonte das medidas e a avaliação externa permanecem dependências reais.
O pedido de dados enviado à autora em 05/11 continua registrado em B7.
Nenhum dado bruto, parecer ou confirmação taxonômica será presumido.

Verificação computacional, parametrização, comparação retrospectiva,
avaliação empírica reservada e replicação por terceiros terão estados
separados. Uso exploratório e didático não implica previsão quantitativa
de colônias reais. Proximidade de uma curva não certifica o software.

Fontes: [Buhl 2005](https://doi.org/10.1007/s00265-004-0906-2),
[POM](https://doi.org/10.1126/science.1116681),
[TRACE](https://doi.org/10.1016/j.ecolmodel.2014.01.018).

Conferência desta atualização documental: 8/8 testes de cronograma/ODD,
TypeScript/Vite e i18n aprovados; Chrome 157 em 1440×900 e 390×844,
sem erros de página. A exclusão do cronograma no build público foi verificada.
Nenhum mecanismo ou lote de simulação foi alterado por esta entrega.
