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

## Parte 4B: odor e experiência

A política de uma bifurcação recebe só uma lista de saídas adjacentes, o gradiente
químico amostrado perto da formiga e marcas de visitas recentes. Não recebe o mapa
completo. Rotas mais longas usam apenas arestas que ela já percorreu, com custo
medido pela distância caminhada. A memória guarda no máximo 64 arestas.

O motor físico mantém o grafo completo para geometria e transporte químico.
Os odores de referência dos tipos de câmara são uma simplificação do ambiente;
a química conserva massa entre nós, com fontes e evaporação contabilizadas.
Na superfície, a volta usa uma entrada já visitada ou uma entrada percebida a
até 2,3 unidades. As próprias operárias propõem frentes a partir da densidade local.

A função nestPath fica disponível como utilitário para ferramentas/testes, sem
participar das decisões dos agentes. Snapshots antigos migram para intenções
e trajetos locais; os corpos não são reposicionados nessa migração.
