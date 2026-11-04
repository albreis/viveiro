# Dados abertos para validar o Viveiro

Nov 4, 2026 · @Everaldo Reis

## Resumo

Existem pelo menos seis conjuntos de dados abertos, com arquivos baixáveis e licença de reuso, que o Viveiro poderia usar além do experimento de Buhl. Três deles são de *Lasius niger*, a espécie que o cronograma já sugere para o P3.1, o que torna essa escolha bem mais fácil de defender.

A recomendação é montar o P3.2 com três padrões independentes, cada um de um estudo diferente: **escavação** (Buhl e Leckie et al. 2025), **trânsito** (Poissonnier et al. 2019) e **crescimento da colônia** (Casillas-Pérez et al. 2021). Para o P3.3, reservar dados que não entram na calibração, por exemplo as colônias-controle de Smith & Gutierrez 2021 ou uma parte das colônias de Casillas-Pérez separada antes de qualquer ajuste.

O que eu conferi: a página de cada repositório (título, autores, licença, lista de arquivos e tamanhos). O que **não** conferi: as colunas internas dos CSVs. Antes de implementar, cada arquivo precisa ser aberto para confirmar as variáveis.

## Ranking por viabilidade

| # | Estudo | Espécie | Padrão principal | Viabilidade |
| --- | --- | --- | --- | --- |
| 1 | Poissonnier et al. 2019 | *Linepithema humile* | fluxo e velocidade por densidade | muito alta |
| 2 | Leckie et al. 2025 | *Lasius niger* | crescimento e forma do ninho escavado | alta |
| 3 | Casillas-Pérez et al. 2021 | *Lasius niger* | crescimento e composição da colônia fundadora | alta |
| 4 | Smith & Gutierrez 2021 | *Lasius niger* | número de operárias por mês sob dietas | média |
| 5 | Mersch et al. 2013 | *Camponotus fellah* | divisão de trabalho por idade e espaço | média |
| 6 | Stroeymeyt et al. 2018 | *Lasius niger* | rede de contatos dentro do ninho | média-baixa |
| 7 | Ulrich et al. 2021 | *Ooceraea biroi* | divisão de trabalho e composição | baixa |

Além disso, um conjunto serve como **fonte de parâmetro** (não de validação): Ślipiński et al. 2025, velocidade de caminhada por temperatura.

## 1. Trânsito: Poissonnier et al. 2019

- **Artigo:** Experimental investigation of ant traffic under crowded conditions, *eLife* 8:e48945. [doi:10.7554/eLife.48945](https://doi.org/10.7554/eLife.48945)
- **Dados:** [Dryad, doi:10.5061/dryad.prr4xgxw0](https://datadryad.org/dataset/doi:10.5061/dryad.prr4xgxw0). Três arquivos .txt com os dados das figuras 2 a 4 (10 MB), README e scripts R.
- **Licença:** Dryad publica tudo sob CC0 (política do repositório; a página não repete o nome).
- **O que foi medido:** 170 experimentos com colônias de 400 a 25.600 operárias, numa ponte de 5, 10 e 20 mm de largura entre ninho e comida. Densidade (formigas/cm², a cada 0,5 s por 1 h), fluxo (formigas/cm/s), tempo de viagem e contatos de cada formiga.

**O que o Viveiro compara hoje.** O `benchmark:fluxo` já mede fluxo por densidade num túnel. Dá para comparar a forma do diagrama fundamental: o fluxo cresce com a densidade e se estabiliza em vez de despencar. Isso já é citado no relatório Buhl como argumento, mas nunca foi comparado com os números.

**O que precisaria mudar.** O teste de fluxo mostrou velocidade constante (cerca de 0,045 u/tick) de 2 a 200 operárias, enquanto em Poissonnier a velocidade cai com a densidade. Ou seja, é um teste que o modelo provavelmente **falha hoje**, o que é exatamente o tipo de padrão que vale ter. Seria preciso: uma ponte de largura variável com tráfego nos dois sentidos, medir contatos por formiga, e expressar densidade em formigas por área de corpo (para não depender da conversão de unidades).

**Cronograma.** Padrão do P3.2 independente da escavação. É o mais barato: roda em minutos, não em horas, e o código de medição já existe.

## 2. Escavação de *Lasius niger*: Leckie et al. 2025

- **Artigo:** Architectural immunity: ants alter their nest networks to prevent epidemics, *Science* 390: 266–271 (2025). Preprint: [bioRxiv 2024.08.30.610481](https://www.biorxiv.org/content/10.1101/2024.08.30.610481)
- **Dados:** [Zenodo, registro 15353580](https://zenodo.org/records/15353580). `architectural_immunity_nest_analysis.csv` (198 kB), `COLONY_INFO.csv`, scripts de análise, dados de rede e vídeo, e o próprio modelo baseado em agentes dos autores (`agent_based_simulation.py`) com resultados.
- **Licença:** CC BY 4.0.
- **O que foi medido:** grupos de 180 operárias cavam em solo; após cerca de 24 h, micro-CT; depois entram 20 formigas expostas a fungo (ou controle) e o ninho é escaneado de novo. Métricas de volume, entradas, câmaras e topologia da rede de galerias.

**O que o Viveiro compara hoje.** O ninho do Viveiro já é um grafo de nós e túneis em 3D, e o `serie.csv` do benchmark já tem volume e número de nós. No grupo-controle dá para comparar volume escavado em 24 h, número de entradas, número de câmaras e propriedades da rede (grau, distância média até a entrada).

**O que precisaria mudar.** Exportar métricas de grafo do ninho (grau, centralidade, espaçamento entre entradas) no fim da rodada; protocolo de 180 operárias em solo 3D (o Viveiro é 3D, o que aqui é uma vantagem sobre Buhl, que é 2D). A parte do patógeno exigiria transmissão de doença, que fica para depois.

**Cronograma.** Segundo padrão de escavação para o P3.2, com a mesma espécie do P3.1. Depende de a escavação no modo por feromônio ficar estável (o ponto em que o trabalho de Buhl parou). O modelo dos autores também serve como comparação de modelo para modelo, como o NetLogo de van der Vaart.

## 3. Fundação e crescimento de *Lasius niger*: Casillas-Pérez et al. 2021

- **Artigo:** Early queen infection shapes developmental dynamics and induces long-term disease protection in incipient ant colonies, *Ecology Letters* 25(1), 2022. [doi:10.1111/ele.13907](https://doi.org/10.1111/ele.13907)
- **Dados:** [Dryad, doi:10.5061/dryad.7pvmcvdtj](https://datadryad.org/dataset/doi:10.5061/dryad.7pvmcvdtj) (cópia no Zenodo, doi:10.5281/zenodo.5576808). CSVs de taxa de crescimento (fig. 2), composição da colônia (fig. 3a), comportamento, progressão do fungo na rainha e sobrevivência de operárias de um ano.
- **Licença:** CC0 (Dryad).
- **O que foi medido:** colônias fundadas por uma rainha recém-acasalada, acompanhadas no primeiro ano, com hibernação. Crescimento antes do inverno, razão pupas/operárias e sobrevivência da rainha à hibernação.

**O que o Viveiro compara hoje.** Este é o encaixe mais direto com o que o modelo já faz: fundação claustral, ovos, larvas, pupas e adultos, e diapausa. O CSV diário já exporta exatamente essas contagens. Dá para comparar a curva de operárias no primeiro ano e a composição da prole nas colônias-controle.

**O que precisaria mudar.** Um perfil de *Lasius niger* com tempos de desenvolvimento e temperaturas reais, e uma conversão honesta de dias do modelo (100 ticks) para dias reais. A exposição ao fungo não é modelada, então só as colônias-controle servem por enquanto.

**Cronograma.** P3.1 e P3.2 (curva de crescimento e composição como padrões). Como tem muitas colônias, dá para separar uma parte para o P3.3 antes de calibrar.

## 4. Crescimento sob dietas: Smith & Gutierrez 2021

- **Artigo:** Growth and survival of the superorganism: ant colony macronutrient intake and investment (*Ecology and Evolution*, 2021).
- **Dados:** [Dryad, doi:10.5061/dryad.g79cnp5n1](https://datadryad.org/dataset/doi:10.5061/dryad.g79cnp5n1). 16 arquivos .txt e scripts R (410 kB).
- **Licença:** CC0 (Dryad).
- **O que foi medido:** cerca de 86 a 96 colônias de *L. niger* (e *L. neoniger*) com dietas de mesma energia e proporções diferentes de proteína e carboidrato, oito censos mensais de operárias, sobrevivência, tamanho e gordura das operárias, preferência alimentar no campo.

**O que o Viveiro compara hoje.** Número de operárias ao longo de oito meses e sobrevivência da colônia, com uma dieta de referência.

**O que precisaria mudar.** O alimento do Viveiro é uma moeda única. Para usar os tratamentos, seria preciso separar proteína (vai para a prole) de carboidrato (energia das operárias).

**Cronograma.** Melhor como dado reservado do P3.3: calibra-se o crescimento com Casillas-Pérez e prevê-se a curva das colônias-controle daqui, sem ajustar nada.

## 5. Divisão de trabalho: Mersch, Crespi & Keller 2013

- **Artigo:** Tracking individuals shows spatial fidelity is a key regulator of ant social organization, *Science* 340: 1090–1093.
- **Dados:** [Dryad, doi:10.5061/dryad.8d8h7](https://datadryad.org/dataset/doi:10.5061/dryad.8d8h7). `tracking_data.zip` (36,5 MB) e README.
- **Licença:** CC0 (Dryad).
- **O que foi medido:** seis colônias de *Camponotus fellah* com todas as operárias marcadas, rastreadas por 41 dias. Três grupos (cuidadoras, faxineiras, forrageadoras), com transição por idade e fidelidade a zonas do ninho.

**O que o Viveiro compara hoje.** O modelo tem tarefas e idade. Dá para comparar a fração de operárias em cada grupo e a ordem da transição com a idade.

**O que precisaria mudar.** Registrar posição e tarefa de cada formiga ao longo do tempo e definir zonas equivalentes (prole, lixo, saída). A espécie não é a do P3.1, então o resultado vale como padrão qualitativo.

**Cronograma.** Padrão extra para o P3.2 ou validação qualitativa no P3.3.

## 6. Rede de contatos: Stroeymeyt et al. 2018

- **Artigo:** Social network plasticity decreases disease transmission in a eusocial insect, *Science* 362: 941–945. [doi:10.1126/science.aat4793](https://doi.org/10.1126/science.aat4793)
- **Dados:** [Zenodo, doi:10.5281/zenodo.1480665](https://zenodo.org/records/1480665). `data.zip` de 24,7 GB e README.
- **Licença:** CC BY 4.0.
- **O que foi medido:** colônias de *L. niger* rastreadas antes e depois da exposição de forrageadoras a fungo; redes de contato e carga de patógeno.

**O que o Viveiro compara hoje.** Pouco. O modelo tem contato entre formigas, mas não exporta a rede.

**O que precisaria mudar.** Registrar contatos e calcular modularidade, agrupamento e distribuição de grau. Para a parte principal do estudo, um submodelo de transmissão. O arquivo é enorme.

**Cronograma.** Depois do P3.3. O mesmo laboratório (Stroeymeyt, Bristol) publicou o estudo 2, o que faz dele um contato natural para a parceria pedida no P3.1.

## 7. *Ooceraea biroi*: Ulrich et al. 2021

- **Dados:** [Dryad, doi:10.5061/dryad.hx3ffbgdd](https://datadryad.org/dataset/doi:10.5061/dryad.hx3ffbgdd). Rastreamento individual (.mat, 271 MB) e resumos em CSV.
- **Licença:** CC0 (Dryad).
- **Por que fica por último:** a espécie é clonal, sem rainha e com ciclo reprodutivo sincronizado, nada disso existe no Viveiro.

## Fonte de parâmetro: velocidade e temperatura

- **Dados:** Ślipiński et al., Need for speed? It is not necessary to be always the fastest – a case study of two thermophilous ant species. [Dryad, doi:10.5061/dryad.z612jm6q8](https://datadryad.org/dataset/doi:10.5061/dryad.z612jm6q8). Velocidade em cm/s e retidão do caminho por temperatura, em *Cataglyphis velox* e *Aphaenogaster senilis*.
- **Uso:** resolver a pendência 4 do relatório Buhl (converter as taxas de "por tick" para "por segundo") com velocidade real de caminhada, inclusive dependente de temperatura. Como é usado para fixar parâmetros, **não** pode ser contado como validação.

## Estudos úteis mas sem dados abertos

Estes só têm figuras ou material suplementar em PDF. Servem como padrões qualitativos, não como dados:

- Toffin et al. 2009, *PNAS*, transição de forma do ninho (de disco para ramificado) em *Messor sancta*, com 50 e 300 operárias. Do mesmo grupo de Buhl, e o Viveiro poderia testar a transição no mesmo benchmark.
- Khuong et al. 2016, *PNAS*, construção por estigmergia em *Lasius niger*.
- Gravish et al. 2012, *J. R. Soc. Interface*, e Aguilar et al. 2018, *Science*, escavação de túneis por formigas-de-fogo e controle de entupimento.
- Nova, Pagliara & Gordon 2022, forrageamento de *Pogonomyrmex barbatus* por umidade, no repositório de Stanford ([purl.stanford.edu/gr652yp4782](https://purl.stanford.edu/gr652yp4782)). A página estava fora do ar quando conferi, então licença e arquivos não foram confirmados.

## Como isso se encaixa no cronograma

- **P3.1 (espécie com dados de laboratório):** *Lasius niger* tem três conjuntos abertos (estudos 2, 3 e 4), o que cumpre a parte "conjuntos de dados com licença de uso" do aceite. A parceria com laboratório continua pendente; o grupo de Stroeymeyt em Bristol é o candidato óbvio.
- **P3.2 (calibração com 3 ou mais padrões):** escavação (Buhl, depois Leckie), trânsito (Poissonnier) e crescimento (Casillas-Pérez). Cada padrão vem de um estudo independente, o que dificulta o ajuste forçado que você quer evitar.
- **P3.3 (validação com dados reservados):** separar, antes de calibrar, as colônias-controle de Smith & Gutierrez e uma parte das colônias de Casillas-Pérez. Mesma lógica das sementes separadas, aplicada aos dados.

## Próximo passo sugerido

O mais barato e informativo é Poissonnier: o teste de fluxo já existe, roda em minutos e deve mostrar uma diferença real (a velocidade do modelo não cai com a densidade). Pode ser feito em paralelo à pausa do Buhl, sem mexer no modo padrão.
