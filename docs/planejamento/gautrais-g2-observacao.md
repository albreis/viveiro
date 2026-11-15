# G2 — Observação da rede física do World

15/11/2026. O mantenedor escolheu manter o **World como alvo** e adaptar K1
antes do G4. A arena antiga não substitui o motor do terrário.

## Contrato de medição

O observador consulta o mesmo campo contínuo de solo usado pela geometria
e pelo apoio dos agentes, incluindo erosão e material que bloqueia galerias.
Não conta diretamente os nós/links usados para roteamento. Um corte horizontal
tem posição, limites, resolução e unidades explícitos. Ar fora do solo não
une artificialmente as entradas. O corte 3D não é apresentado como ninho inteiro.

A discretização usa conectividade 4 para vazios e 8 para fundo. Uma ampliação
com cantos resolvidos permite afinamento direcional com remoções locais
que preservam componentes e buracos. Faces 2×2 preenchidas são área, não
ciclos de galerias. A rede é comprimida por cadeias de grau 2, preservando
componentes e ciclos; loops usam dois nós e arestas paralelas.

Essa mesma supressão de subdivisões pode ser aplicada aos grafos observados.
Os novos N/E são **contagens topológicas normalizadas**, não a contagem
original de câmaras/nós do artigo. O plano G1 e seus dados ficam imutáveis.
Qualquer uso dessa nova convenção no G4 exigirá emenda/protocolo próprio
congelado antes de novas métricas reservadas. Resolução e segmentação podem
alterar ramificações; o piloto usa duas resoluções, sem ajuste aos dados.

## Verificação

Testar todas as 512 máscaras locais, árvores, anéis, contatos diagonais,
arestas paralelas, bloqueios por solo solto e conexões criadas por erosão.
A leitura deve preservar o snapshot inteiro, sem consumir RNG. Componentes
e ciclos do grafo precisam coincidir com os vazios físicos da máscara;
uma divergência gera erro, em vez de ser exportada como medida válida.

[Piloto fixado](../validacoes/gautrais-g2-piloto-plano.json): grupos 50/100/200,
120 ticks, cortes y = −1/−2/−3 e pitches 0,2/0,25 unidades do modelo.
São coortes preparadas em ninho maduro, apenas um teste de instrumentação;
não são 72 horas físicas, nem uma previsão elegível para G4.

## Gate para G3/G4

K1 deve configurar disco/substrato sem galerias, escala espacial, relógios
físico/biológico e balanço de material. Só depois congelar condições,
parâmetros, seeds, operador e predições. Os grafos pares continuam fechados
para métricas até essa etapa. A normalização não fornece uma conversão
de tempo ou volume e não permite declarar calibração concluída.
