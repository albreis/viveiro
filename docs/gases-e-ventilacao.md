# Gases e ventilação — etapa 7B2

Modelo exploratório de rede, independente do DOM e do Three.js. Compara arquiteturas e obstruções; não prevê concentrações reais de uma espécie ou substitui CFD. Coeficientes usam espaço e tempo internos, sem correspondência calibrada com pascals, litros ou metabolismo medido.

## Estado e geometria

Cada nó do ninho armazena volume, quantidade de O₂ e quantidade de CO₂. O volume aproxima a esfera da câmara mais metade dos cilindros incidentes; sobreposições geométricas não são subtraídas. Valores exibidos são quantidade/volume. O restante da mistura é um gás portador implícito, sem equação própria. O modelo é incompressível e isotérmico em cada compartimento; o quociente respiratório não altera a pressão total.

A atmosfera de referência usa 20,9% de O₂ e 0,042% de CO₂ como cenário fixo, sem afirmar uma medição contemporânea. Saves antigos inicializam o campo quando o tempo avança. Nenhuma galeria é inventada: enquanto a fundação possui zero nós, não há compartimentos subterrâneos. O painel mostra essa condição sem infinitos.

Mudanças de volume preservam a fração local por meio de uma transferência geométrica explicitamente contabilizada. Uma cavidade nova herda a composição de uma vizinha existente, ou a referência se estiver isolada; a fonte idealizada é ar do meio poroso recém-exposto. Isso não resolve pressão compressível ou difusão no solo externo. Não deve ser confundido com ventilação pelas entradas. Remoção de compartimentos também registra o gás retirado.

## Rede de pressão e circulação

Em cada aresta a→b:

- Q_ab = G_ab * (p_a - p_b + H_ab).
- G_ab = 0,02 * r⁴ / comprimento * abertura⁴, uma analogia de resistência laminar.
- H_ab = 0,02 * (T_matriz - T_ar)/(T_ar + 273,15) * (y_b-y_a), uma aproximação de empuxo.
- O vento fornece uma pressão de referência proporcional à projeção da posição da entrada no vetor de vento.

A rede satisfaz soma dos fluxos = 0 nos nós internos. Entradas têm pressão prescrita; componentes sem entrada usam uma referência de pressão sem injetar ar. Um solver de gradiente conjugado resolve o laplaciano reduzido, com residual registrado. O limite numérico é min(2N+8, 1024) iterações; benchmarks de redes grandes e condicionamento extremo ainda pertencem à etapa 8.

Uma árvore com uma única entrada não ganha circulação de passagem por vento uniforme. Duas entradas submetidas a pressões diferentes podem gerar fluxo. Laços e diferenças térmicas podem produzir convecção. Não se promete que toda segunda entrada melhora qualquer ninho: geometria, orientação, resistência e concentrações transportadas importam.

Entulho próximo ao eixo da galeria reduz uma abertura estimada a partir do raio equivalente e da sobreposição com a seção. A menor abertura encontrada limita condutância e difusão. É um gargalo aproximado; não integra a seção 3D exata, permeabilidade dos agregados nem múltiplos escoamentos entre partículas. A limpeza e o alargamento alteram essa resistência na atualização seguinte.

## Transporte e balanços

Difusão: J_ab = D_ab * (C_a-C_b), D_ab = 0,0005 * área/comprimento * abertura². A troca é igual e oposta entre os compartimentos. O passo é limitado pela aproximação ao equilíbrio para manter positividade. Nas entradas há troca difusiva com o reservatório atmosférico.

Advecção usa a concentração da doadora, com deltas simultâneos. Subpassos de no máximo um tick e limite de Courant de referência 0,1 por doadora evitam retirar uma fração excessiva do volume em um passo. Entrada atmosférica adiciona a mistura de referência; saída remove a mistura local. A fronteira registra fluxos com sinal.

Respiração demanda O₂ conforme número de adultos, escala cúbica do corpo e custo metabólico; prole tem uma demanda menor. O consumo é limitado pelo O₂ presente e produz 0,8 unidade de CO₂ por unidade consumida. Esses coeficientes são hipóteses ilustrativas. Prole carregada contribui no compartimento da transportadora, sem consumir no antigo nó do berçário. Agentes no exterior não debitam um reservatório subterrâneo. Não há jardim fúngico, respiração de microrganismos ou plantas modelados nessa rede.

Balanços:

O₂ inicial + geometria + fronteira - consumido = O₂ presente.

CO₂ inicial + geometria + fronteira + produzido = CO₂ presente.

O campo avança uma vez a cada dez ticks globais, compartilhado entre todas as colônias. Snapshots preservam quantidades, fluxos, pressão e balanços; restore recompõe referências comuns. O solver não consome o RNG das formigas.

## Sensores e respostas

O indivíduo lê seu compartimento atual; ao transitar entre dois nós, usa o extremo mais próximo da aresta que está percorrendo. É uma discretização por compartimentos, sem continuidade de concentração ao cruzar a metade do segmento. O exterior usa a referência atmosférica.

Uma curva exploratória de desconforto aumenta abaixo de 16% de O₂ ou acima de 2% de CO₂. Ela adiciona custo energético às operárias e reduz o peso probabilístico de saídas adjacentes a até 1,2 unidade. A memória de rota não força a primeira aresta conhecida quando a leitura local dessa saída está ruim. A exploração continua possível e o corpo mantém a navegação apoiada existente. Nenhuma formiga recebe um mapa global de ar. Limiares não foram medidos para uma espécie; respostas da rainha, desenvolvimento térmico da prole, diapausa e tolerância fisiológica específica seguem nas etapas biológicas futuras.

Desgaste do túnel e perda de alimento passaram a amostrar água da matriz perto da aresta e do estoque. O alimento perdido vira a mesma massa de resíduo. Temperatura local modula uma taxa limitada. Isso aproxima risco de deterioração, sem simular fungos, atividade de água da semente ou epidemiologia. Umidade relativa do ar não é usada como substituto imediato do teor de água no solo.

## Observação e validação

O painel informa faixas espaciais e consumo acumulado. O diagrama projeta o grafo, colore por CO₂ e marca direção de circulação e entradas. Não é uma seção física exata. A formiga selecionada mostra O₂/CO₂ locais, inclusive em primeira pessoa. O vento horizontal é uma intervenção registrada, persistente e compartilhada com o transporte de feromônios.

Testes dirigidos cobrem conservação fechada, positividade para passo longo, uma/duas entradas, remoção de CO₂ por vento, inversão térmica, entulho/alargamento, balanços respiratórios e geométricos, prole carregada, terreno sem galerias, componentes desconectados, sensores locais, viés ACO com exploração, duas colônias e restauração determinística. Uma regressão da fundação sem estoque foi encontrada e corrigida preservando o teste original. A execução completa limpa aprovou 123/123 casos em 448552 ms, após a correção; TypeScript e Vite finais aprovados. No navegador, vento, campos locais, diagrama, recarga e leitura em primeira pessoa foram conferidos preservando a seed a. Nenhum erro novo de console após corrigir o HMR de uma instalação parcial.

## Evidência e dependências

[Bollazzi, Römer e Roces, 2021 — Carbon dioxide levels and ventilation in Acromyrmex nests](https://doi.org/10.1098/rsos.210907) investigou arquiteturas distintas e mostrou ventilação por vento/convecção em configurações específicas. O resultado justifica estudar conectividade e fronteiras, sem transferir os parâmetros ou as concentrações medidas para este terrário genérico.

Faltam escala física, taxas respiratórias por casta/espécie/temperatura, resistência real dos túneis, pressões externas medidas, difusão através do solo, capacidade térmica e advecção de calor do ar, vapor/condensação, gases de microrganismos, geometria de bocas seladas e calibração experimental. Esses dados são dependências reais. A etapa 7C tratará suporte estrutural local; a calibração científica permanece aberta.

## Checagem de custo do solver

Nesta máquina, 1.000 resoluções sucessivas do grafo maduro inicial (nove nós/nove arestas, vento três) levaram 70 ms em uma medição isolada, com residual de continuidade de cerca de 1,12e-19 e balanços iniciais zero. A pressão anterior foi reutilizada. Esse microbenchmark não mede FPS, malha, redes grandes, previsão nem custo total da simulação; a avaliação completa continua na etapa 8.
