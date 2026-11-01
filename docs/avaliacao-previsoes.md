# Observação e avaliação das previsões

## Contratos de informação

0.17.0 oferece dois modos explícitos. Estado completo executa World.step a partir de uma cópia de agentes, prole, estoque, cérebro, solo e ambiente. Contagem e histórico é uma aproximação separada; o Worker recebe apenas seed/tick e pares instante/população dos últimos3dias, incluindo a contagem atual. O seletor muda também a fonte na aplicação, evitando construir/enviar um snapshot completo para o modo parcial.

O censo soma os adultos de todas as colônias. Assume contagem perfeita, inclusive no subsolo; não representa uma câmera com oclusão, erro de detecção ou amostragem de superfície. As formigas continuam com os mesmos sensores locais; esse contrato pertence ao observador do experimento. Não há acesso da previsão parcial a prole, idade, energia, genes, reservas, túneis ou estados futuros.

## Aproximação por histórico

No período de3dias, ajusta-se uma reta por mínimos quadrados para obter inclinação b em adultos/dia. Para cada par de censos consecutivos, calcula-se rᵢ=(ΔNᵢ−bΔtᵢ)/sqrt(Δtᵢ), e centraliza-se a média desses resíduos. Cada trajetória sorteia resíduos passados com reposição, usando RNG próprio seed/tick/índice:

N(t+Δt)=clip(N(t)+bΔt+r·sqrt(Δt),0,450).

O passo estatístico é no máximo0,25dia. O resultado é arredondado a adultos no horizonte. Essa é uma extrapolação local de contagem; não modela explicitamente a fisiologia, nascimentos, mortes, causalidade climática ou física3D. Limites e coeficientes são escolhas exploratórias, não calibração. Com menos de3censos ou menos de0,5dia de histórico, usa persistência com aviso de incerteza não estimada. Uma série constante também pode produzir faixa degenerada sem excluir riscos não observados.

## Ensaio pareado reservado

Executar npm run evaluate:forecast em Node24. O script fixa antecipadamente3seeds EVAL-VIVEIRO-01/02/03, origens nos passos300/600 e horizontes1/3/7dias, com6futuros por origem. São seeds distintas dos testes unitários. O cenário tem ninho estabelecido, par reprodutivo e parâmetros58%RH/72%luz/28%aleatoriedade/24°C/36°repouso. Não representa cronologia claustral calibrada por espécie. Nenhuma intervenção futura é aplicada.

Para cada origem, o ensemble completo reamostra o RNG raiz e perturba RH/luz como o painel. Um único conjunto de trajetórias coleta todos os horizontes, evitando repetir a mesma física. O desfecho de referência é outra cópia continuada com o RNG original. A extrapolação usa só os censos anteriores à origem. A base mantém a população atual constante. Os modelos não são ajustados usando os desfechos reservados. Os métodos e as informações disponíveis mudam juntos: a diferença de erro não isola um efeito causal da quantidade de dados. O ensaio usa apenas esse regime de parâmetros e colônias pequenas; não cobre todos os estágios, espécies ou condições ambientais.

Uma execução que excede o orçamento falha e não publica métricas de amostra selecionada. O arquivo public/benchmarks/previsoes-v1.json só é escrito quando todas as origens terminam. Contém manifesto, parâmetros, horários, runtime, desfechos, previsões, amostras e métricas. A tag da versão identifica o código correspondente. É um ensaio do modelo sintético, não observação biológica externa.

## Métricas

Para cada horizonte e método, e=mediana prevista−desfecho:

- MAE=mean(abs(e)), em adultos.
- RMSE=sqrt(mean(e²)), em adultos.
- Viés=mean(e), preservando o sinal.
- Cobertura=fração dos desfechos dentro de[P10,P90], inclusiva.
- Largura=mean(P90−P10).

A base constante tem previsão pontual; sua cobertura pontual aparece no JSON, mas o painel não a apresenta como faixa de incerteza. Cada horizonte tem6origens, correlacionadas dentro das3seeds. Esse tamanho é pequeno, e não permite afirmar cobertura nominal, significância, superioridade geral ou transferência à natureza. FaixasP10–P90 são quantis empíricos, sem promessa de80%de confiança.

O painel permite alternar MAE,RMSE e cobertura e baixar os dados. Ele identifica que a tabela vem do ensaio reservado, não de erros medidos no terrário atual. O custo completo inclui os3horizontes por origem; as linhas repetem esse custo e a média deduplica seed/origem. Custos da contagem são por horizonte. Tempos ativos são durações síncronas aproximadas, incluindo preempção, não leitura de CPU. Execução em Node não medeFPS do navegador; pausas e processos simultâneos afetam os tempos.

## Resultado da execução

Concluído em01/11/2026 15:13:33UTC, Nodev24.22.1/Windows.18pares origem/horizonte;6origens, cada método com6futuros completos. Desfechos de17–69adultos. Nenhuma seed descartada nem método alterado após conhecer os resultados.

| Horizonte | MAE completo | MAE contagem | MAE base constante | Cobertura completo | Cobertura contagem |
| --------- | -----------: | -----------: | -----------------: | -----------------: | -----------------: |
| 1dia      |         0,83 |         1,33 |               6,67 |             83,33% |               100% |
| 3dias     |         0,33 |         6,00 |              21,33 |               100% |                50% |
| 7dias     |         1,17 |        20,67 |              35,50 |             83,33% |             16,67% |

Erros em adultos. A extrapolação perdeu precisão no horizonte longo deste ensaio; suas faixas não sustentaram cobertura próxima de80%. O modelo completo acompanha melhor a própria dinâmica que o gerou, sem provar fidelidade ecológica externa. A não monotonicidade do erro completo entre1/3dias não é garantia de melhoria com o horizonte; há só6origens por linha.

Tempo total do ensaio518,45s. Média de51,08s ativos por origem para o ensemble completo com os3horizontes;0,44ms por horizonte para contagem. Maior custo ativo completo por origem62,96s. Não converter essa diferença de custo em alegação de qualidade equivalente. RelatórioJSON de19036bytes com dados individuais e manifesto preservado.

## Validação e limites externos

16testes dirigidos aprovados:8do agendador e8novos. Cobrem ausência de acesso a campos ocultos/futuros, determinismo, tendência conhecida, limites, histórico insuficiente, transporte parcial, métricas com respostas conhecidas, referência independente e equivalência com o ensemble antigo em cada horizonte. TypeScript/Vite aprovados. QA final aprovada no browser: modo parcial18futuros/3dias,89–97adultos,13censos,56,5ms decorridos/1,5ms ativos. Troca para completo1dia/6futuros terminou em45,1s/17,9s. TabelaMAE/RMSE/cobertura coincide com JSON; base sem faixa exibida como traço. Recarga preservou dia267,92%RH,97adultos/14crias/duas colônias e4719escolhas/4607ajustes neurais. Nenhum erro novo; os dois logs deHMR14:44:57 são anteriores à QA. Screenshot viveiro-0.17.0-avaliacao.png. DevG PID17752 e HTTP200.

Calibração científica depende de dados externos com espécie, ambiente, método de censo, erro observacional, manejo, datas e desfechos. Também requer identificação e validação dos parâmetros físicos/biológicos já descritos no cronograma. Erro baixo contra o próprio motor não demonstra reprodução da realidade. Observação parcial espacial com detecção imperfeita e inferência de estados ocultos continua fora do contrato desta versão.
