# Avaliação com dados públicos de Gautrais

15/11/2026. Segue a mudança de escopo do [PR #134](https://github.com/albreis/viveiro/pull/134). B7/P3.3 deixa de depender de resposta dos autores. O contato continua opcional; P3.1 e os aceites humanos mantêm seus requisitos próprios.

## Sequência técnica

- [x] **G0 — Escopo e fonte:** conferir artigo, suplemento e inventário local. O ZIP de 5.173.127 bytes coincide com o SHA-256 arquivado.
- [x] **G1 — Protocolo e dados:** congelar [plano e partição](../validacoes/gautrais-2014-plano.json), testar leitor/métricas, analisar somente desenvolvimento e arquivar proveniência.
- [ ] **G2 — Mesmo observável no simulador:** extrair rede do motor declarado e verificar convenções de nós, componentes, câmaras, túneis, periferia e relógio. A contagem de nós internos do World não equivale automaticamente aos grafos do artigo.
- [ ] **G3 — Predições congeladas:** cenário compatível, parâmetros, sensibilidade, réplicas/seeds, nível da faixa e protocolo de comparação. Resolver K1–K6 onde necessário. Não ajustar olhando as réplicas reservadas.
- [ ] **G4 — Avaliação reservada e relatório:** abrir a partição reservada só depois de G3, calcular MAE/cobertura por métrica/grupo e registrar resultados favoráveis e desfavoráveis. Não declarar independência inexistente.

## O que está fixado antes desta análise

Réplica ímpar para desenvolvimento, par para reserva: 15 e 13 grafos finais; 12 e 11 séries. Quadros da mesma réplica nunca atravessam partições. Usar os sete quadros nominais de 0–72 h, a cada 12 h, e manter o grafo final separado do último quadro. O grupo 50 não tem série temporal no suplemento. Não inventar os quadros ausentes.

Métricas primárias: nós, arestas e ciclos independentes (E − N + C). Diagnósticos: componentes, arestas paralelas, grau médio, ramificações e pontas. São medidas correlatas da mesma fonte, não três estudos independentes. Não converter coordenadas ou larguras em cm³. Não aplicar a fórmula de meshedness de grafo conectado a redes desconectadas ou multigrafos sem verificar a convenção.

Não haverá ajuste do motor nesta etapa. Os limites e o protocolo preditivo permanecem pendentes; não inventar uma tolerância só para concluir P3.3.

## Exposição e dependência conhecidas

A auditoria de 04/11 já percorreu todos os arquivos e publicou médias de topologia. Portanto, a reserva definida hoje não é um conjunto inteiramente inédito. A regra por ID evita escolher colônias pelo resultado, mas não apaga a exposição anterior. Hashes podem ler os bytes de reserva para integridade, sem calcular/exibir suas métricas nesta etapa.

O artigo reanalisa experimentos de Buhl 2004. A correspondência com as curvas de 2001/2005 não está estabelecida. O resultado poderá avaliar padrões adicionais, com essas limitações; não será chamado de replicação independente. O uso prévio de Buhl no desenvolvimento continua registrado no TRACE.

A descrição do artigo usa a autoria Camille Buhl e cita trabalhos anteriores com inicial J. Isso não confirma, por si só, que o endereço usado no e-mail estava errado. Mantém-se o registro do contato tentado, sem diagnóstico sobre a entrega.

[Artigo e disponibilidade](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0109436) · [Inventário](../validacoes/gautrais-2014.md) · [TRACE](buhl-trace.md).

## Primeira entrega G1

Leitor e CLI implementados. A análise de desenvolvimento calculou 15 grafos
finais e 84 quadros selecionados (99 observações), sem calcular métricas de
reserva. Os 5.019 arquivos passaram pela checagem de integridade.
[Dados gerados](../validacoes/gautrais-2014-desenvolvimento.json) ·
[Relatório e reprodução](../validacoes/gautrais-2014-desenvolvimento.md).
G2–G4 e B7 permanecem abertos.
