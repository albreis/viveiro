# Registro TRACE — avaliação e integridade científica

07/11/2026. Roteiro de evidências a preencher durante o
[plano de parametrização](buhl-parametrizacao.md). Adota a organização de
[Grimm et al. (2014)](https://doi.org/10.1016/j.ecolmodel.2014.01.018);
não representa certificação, revisão externa ou TRACE completo já concluído.

## Matriz de evidências

| Parte | O que registrar | Situação atual |
| --- | --- | --- |
| Formulação do problema | Propósito, população, contexto e decisões permitidas | Exploração de mecanismos e ensino; previsão de volumes reais não validada |
| Avaliação dos dados | Fonte, licença, amostra, unidades, erros e dependências | Curvas digitalizadas/tabelas disponíveis; réplicas independentes pendentes |
| Modelo conceitual | Justificativa dos mecanismos e alternativas | Morfologia mantida por decisão explícita; hipóteses quantitativas ainda abertas |
| Verificação da implementação | Testes, conservação, relógio, geometria e contato | Arena e World distintos; comparabilidade física de World pendente |
| Verificação das saídas | Plausibilidade e consistência das métricas | Dados históricos preservados; não substituem observações biológicas |
| Análise do modelo | Sensibilidade, interações, incerteza e identificação | Novas análises de World planejadas em K3–K5 |
| Corroboração das saídas | Comparação com dados empíricos reservados | B7/P3.3 abertos; seeds reservadas não são dados empíricos |

## Registro mínimo de cada investigação

Antes do lote, criar plano versionado com pergunta, motor, fonte/hash,
comando, dependências, unidades, geometria, condições iniciais, parâmetros,
seeds, réplicas, hipóteses, métricas, tolerâncias justificadas e regra de parada.
Informar quais escolhas ocorreram após examinar os dados de referência.
Pré-especificação vale a partir desse registro, sem efeito retroativo.

Para cada parâmetro: origem e papel do dado, população, tamanho amostral,
valor/unidade, incerteza, distribuição escolhida, justificativa e conversão.
Distinguir variabilidade entre indivíduos de incerteza na média e correlações
entre parâmetros. Ausência de informação não autoriza uma faixa conveniente.

Durante o lote, preservar checkpoints e a fonte. Registrar execuções iniciadas,
falhas, exclusões com motivo técnico, retomadas e todos os candidatos avaliados.
Resultados incompatíveis com a referência não são falhas de execução a excluir.
Mudança de critério ou correção cria emenda datada e nova versão de análise;
a análise anterior continua acessível. Não alterar coeficientes silenciosamente.

Depois, arquivar saídas, hashes, ambientes, gráficos, dispersão e tabela dos
padrões. Cada conclusão deve identificar se deriva de medida, cálculo,
experimento controlado no modelo ou hipótese ainda não testada. Conservar
métodos e tentativas desfavoráveis; explicar limitações sem apresentá-las
como mecanismos já demonstrados. Nenhuma rodada nova é presumida neste registro.

## Separações obrigatórias

- **Verificação:** o código cumpre o contrato e os balanços; não confirma biologia.
- **Parametrização:** medidas individuais informam regras, com suas limitações.
- **Calibração:** seleção de parâmetros ou estrutura usando observações; é
  legítima quando declarada. Buhl já participou dessa etapa histórica.
- **Comparação retrospectiva:** diagnóstico com observações já examinadas.
- **Avaliação reservada:** dados elegíveis separados antes do ajuste e do acesso.
- **Replicação independente:** equipe externa produz/verifica evidência real;
  não é criada por novas seeds ou por outro runner da mesma equipe.

Uma mudança para parametrização individual não torna Buhl independente outra
vez. O histórico de restauração e da nova preferência por morfologia permanece.
O cumprimento deste roteiro sustenta a rastreabilidade; não garante acurácia,
identificabilidade dos parâmetros, generalização ou aceite editorial.

## Limites das alegações

Permitido relatar uma inclinação entre grupos compatível com a faixa de
leitura histórica, junto aos erros dos volumes e das curvas temporais.
Não declarar “reproduz Buhl” por inteiro ou “morfologia biologicamente validada”.
Os desvios percentuais devem nomear tabela/curva, grupos e versão do motor.

Faixas do simulador exigem descrição do que foi variado e do que ficou fixo.
Não equiparar cobertura da digitalização a cobertura de observações por réplica.
ABC só será usado como nome de método se houver priors, distância, tolerância,
modelo de observação e diagnósticos explícitos; uma triagem é chamada de triagem.
