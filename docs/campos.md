# Campos e tarefas — modelo exploratório

O campo superficial usa volumes finitos com fronteiras fechadas. Cada fluxo
entre duas células é retirado de uma e adicionado à outra. Evaporação aplica
exp(-lambda dt); vento usa fluxo a montante. O número de subpassos respeita
4 D dt / h² + (|vx| + |vz|) dt / h <= 0,85.

A umidade altera D e lambda. São parâmetros em unidades do modelo, sem
calibração química por espécie. Um campo sem fontes se espalha e desaparece.
Depósitos saturados não apagam concentração que veio de células vizinhas.

ACO usa pesos tau^alpha eta^beta, normalizados no domínio logarítmico e
misturados com uma pequena probabilidade uniforme de exploração.
A operária amostra três direções a 0,7 unidades, sem ler o campo inteiro.
Alimento continua limitado ao sensor de 2,3 unidades.

A resposta de tarefa é S²/(S²+theta²). Os limiares individuais são estáveis
pela seed; idade, casta e atividade os modulam. Pesos de resposta são amostrados,
com um pequeno intervalo entre reconsiderações. Sujeira, prole, predadores e
material solto só criam estímulos dentro do raio local. Necessidades percebidas
junto à rainha podem ser lembradas por tempo limitado.

Trofalaxia exige um caminho de contato sem solo entre as bocas. O simulador
conserva alimento na troca; isto não valida a fisiologia ou os parâmetros.

A parte 4A ainda tem rotas internas pelo grafo conhecido. A parte 4B deve
substituir esse conhecimento prévio por odor local e memória de trajetos visitados.
