# P3-OP — Dados abertos adicionais (opcional)

**Proposta do usuário, fora dos requisitos de conclusão do escopo ativo.**
Incrementa evidência, transparência e valor científico; não bloqueia Buhl, UX ou
release atual. Não cria parceria presumida nem comprova superioridade sobre concorrentes.

Fonte: [levantamento fornecido](fontes/dados-abertos-validacao.md). Conferidos os
registros primários e suas listas de arquivos em 03/11/2026. A auditoria de
Gautrais et al. foi adicionada abaixo; os demais arquivos internos e amostras
ainda não foram auditados. Uma página com arquivos
não significa que o benchmark já foi implementado. Não baixar grandes pacotes
para simplesmente marcar o planejamento como feito.

## Ordem sugerida e fontes

### OP-01 — Trânsito: Poissonnier et al. 2019

- [ ] Comparar densidade, fluxo, velocidade e contatos em ponte bidirecional
  com largura variável. Espécie *Linepithema humile*, diferente de Buhl.
- [Dados Dryad](https://datadryad.org/dataset/doi:10.5061/dryad.prr4xgxw0):
  três arquivos `Figure2/3/4-SourceData.txt`, README e scripts R, ~10,26MB;
  artigo de 2019, depósito atual de 2025. O README lista unidades e variáveis.
- Próximo passo opcional mais curto: auditar esses arquivos e adaptar o
  `benchmark:fluxo`, sem mudar o modo padrão só para concordar com os dados.
- Aceite: curvas por densidade/largura, contatos e incerteza por experimento;
  unidades ou ocupação corporal justificadas e falhas do modelo publicadas.

### OP-02 — Escavação 3D: Leckie et al. 2025

- [ ] Comparar somente controles compatíveis: volume, entradas, câmaras e
  topologia do ninho de *Lasius niger*. Definir protocolo e métricas de grafo.
- [Zenodo 15353580](https://zenodo.org/records/15353580):
  `architectural_immunity_nest_analysis.csv` (~198kB), `COLONY_INFO.csv`,
  scripts e resultados; pacote listado ~4,2MB. Não presumir que o ZIP de redes
  contém vídeos brutos completos só pelo nome.
- Aceite: observações/controles auditados, escala espacial/temporal e métricas
  comparáveis, fonte/licença registradas. Modelo Python dos autores é uma
  comparação de modelos separada; patógeno/transmissão fica fora desta etapa.
- Referência 2D complementar para Buhl: [Gautrais et al. 2014](../validacoes/gautrais-2014.md).
  Grafos verificados: 28 finais e 23 séries de *Messor sancta*. Ainda é
  preciso demonstrar a separação de réplicas antes de usar como dados reservados.

### OP-03 — Fundação/crescimento: Casillas-Pérez et al. 2021/2022

- [ ] Comparar crescimento e composição de prole nas colônias-controle de
  *Lasius niger*, com temperatura, diapausa e dias físicos compatíveis.
- [Dryad 7pvmcvdtj](https://datadryad.org/dataset/doi:10.5061/dryad.7pvmcvdtj):
  CSVs de crescimento/composição/comportamento/sobrevivência, ~81,7kB.
- Aceite: reservar colônias antes de ajustar; declarar quais contagens existem
  realmente, unidades, dados faltantes e incerteza. Não presumir série diária
  completa de ovos/larvas só porque o Viveiro consegue exportá-la.

### OP-04 — Crescimento sob dieta: Smith & Gutierrez 2021

- [ ] Avaliar dados de *Lasius niger/L. neoniger* como possível validação externa
  reservada de crescimento, após verificar equivalência de dieta/condições.
- [Dryad g79cnp5n1](https://datadryad.org/dataset/doi:10.5061/dryad.g79cnp5n1):
  arquivos TXT e scripts R, ~410,65kB, incluindo `DATA_combined.txt`.
- Aceite: selecionar espécie/tratamento sem usar o resultado para reajuste;
  reportar discrepâncias. Tratamentos nutricionais completos exigem distinguir
  proteína/carboidrato; o alimento escalar atual não representa essa fisiologia.

### OP-05 — Tarefas/idade/espaço: Mersch et al. 2013

- [ ] Avaliar padrão qualitativo de fidelidade espacial e transição de tarefas
  em *Camponotus fellah*, sem transferir taxas diretamente para outra espécie.
- [Dryad 8d8h7](https://datadryad.org/dataset/doi:10.5061/dryad.8d8h7):
  `tracking_data.zip` (~36,53MB) e README, seis colônias acompanhadas por 41 dias.
- Aceite: exportação de posição/tarefa/idade, zonas comparáveis, métricas por
  colônia e limitações de classificação. Não usar “idade → tarefa” imposta pelo
  código como evidência de que o padrão emergiu independentemente.

### OP-06 — Redes de contato: Stroeymeyt et al. 2018

- [ ] Depois dos benchmarks menores, avaliar uma amostra auditável de contatos
  de *Lasius niger*. Exportar encontros e medir grau, agrupamento/modularidade.
- [Zenodo 1480665](https://zenodo.org/records/1480665): README e `data.zip`
  de **24,7GB**. Inspecionar índice/README antes de planejar armazenamento/extração.
- Aceite: subconjunto/controles, custo e licença definidos; doença/transmissão
  requer outro submodelo e não integra o compromisso atual.

### OP-07 — Composição da colônia: Ulrich et al. 2021

- [ ] Explorar resumos antes de rastreamentos completos de *Ooceraea biroi*.
- [Dryad hx3ffbgdd](https://datadryad.org/dataset/doi:10.5061/dryad.hx3ffbgdd):
  CSVs-resumo, arquivos MAT e scripts R, ~271,19MB.
- Aceite: documentar incompatibilidades biológicas e limites. Não prometer
  replicação direta pelo modelo atual de rainha/fundação sem adaptar a espécie.

### OP-08 — Fonte de parâmetros: Ślipiński et al. 2025

- [ ] Examinar velocidade/temperatura como referência de unidades e sensibilidade.
- [Dryad z612jm6q8](https://datadryad.org/dataset/doi:10.5061/dryad.z612jm6q8):
  planilhas S2/S3 e material suplementar; *Cataglyphis velox/Aphaenogaster senilis*.
- Aceite: justificar extrapolação entre espécies; velocidade isolada não calibra
  o relógio inteiro nem taxas biológicas de Buhl. Dado usado para fixar parâmetro
  **não conta como validação independente** desse mesmo parâmetro.

## Porta de entrada técnica comum

- [ ] **OP-A — Proveniência:** DOI/versão, arquivos, hashes, licença e citação.
  Dryad aplica CC0 aos datasets por seus [termos](https://datadryad.org/terms).
  A fonte fornecida informa CC BY4.0 para os dois Zenodo; a extração textual
  consultada não exibiu o valor da licença. Confirmar no registro/metadata antes
  de redistribuir; o documento original não substitui a conferência.
- [ ] **OP-B — Dados reais:** abrir README/arquivos, mapear colunas, unidades,
  controles, amostras/colônias e exclusões. Guardar dados brutos sem transformação
  destrutiva e um importador pequeno com testes sobre exemplos.
- [ ] **OP-C — Separação:** definir conjuntos de calibração e validação por
  colônia/experimento antes do ajuste, evitando vazamento entre medidas correlatas.
  Seeds separadas do simulador não substituem dados observados reservados.
- [ ] **OP-D — Execução e relatório:** cenário compatível, análise de sensibilidade,
  réplicas e métricas pré-definidas; MAE/cobertura quando aplicáveis, resultados
  favoráveis e desfavoráveis, custo e limitações reproduzíveis.

**Papéis:** importadores/benchmarks/análise são técnicos. Você pode decidir o
recorte e oferecer dados já disponíveis. Terceiros só são necessários para
informações/licenças ausentes ou revisão/parceria independente. Nada aqui exige
contatar autores automaticamente.

## Estudos apenas candidatos a verificar

Toffin 2009, Khuong 2016, Gravish 2012, Aguilar 2018 e Nova/Pagliara/Gordon 2022
constam na fonte como estudos úteis, com acesso/dados ainda não confirmados.
Não os classificar como “sem dados abertos” de forma definitiva nem contá-los
como datasets licenciados. Figuras digitalizadas são evidência indireta com erro,
não observações brutas por réplica. Nova usa [registro Stanford](https://purl.stanford.edu/gr652yp4782).

Escavação + trânsito + crescimento são uma proposta de padrões complementares;
sua combinação não calibra automaticamente uma única espécie quando os estudos
usam espécies e condições diferentes. P3.1–P3.3 mantêm seus aceites originais;
OP-01–OP-08 só entram neles mediante protocolo explícito, sem inflar o escopo.
