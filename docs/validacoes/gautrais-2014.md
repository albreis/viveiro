# Gautrais et al. (2014) · redes de escavação de Messor sancta

[Artigo](https://doi.org/10.1371/journal.pone.0109436) ·
[Suplemento Data S1](https://doi.org/10.1371/journal.pone.0109436.s001) ·
[Inventário verificado](gautrais-2014-inventario.json).

A fonte contém grafos extraídos de experimentos em arena plana, com a mesma
espécie do benchmark de Buhl. A PLOS informa que os dados do suplemento
podem ser reutilizados sem restrição e que o artigo é aberto sob Creative
Commons Atribuição. Credite autores, artigo e suplemento. O repositório
preserva o hash e as estatísticas derivadas; os grafos originais ficam
no suplemento do periódico.

## Arquivos conferidos

| Operárias | Grafos finais | Séries com 217 quadros |
| --- | ---: | ---: |
| 50 | 5 | 0 |
| 100 | 5 | 5 |
| 200 | 18 | 18 |

A auditoria de 04/11/2026 abriu os 5.019 grafos: 28 finais e 4.991 quadros.
Os quadros são sequenciais, com intervalos de 20 minutos por 72 horas,
conforme o artigo. As réplicas de 50 têm apenas o grafo final. Há cinco
ocorrências de pares de nós repetidos, todas nos grafos finais do grupo
de 200. O leitor preserva essas arestas; verificar a convenção do grafo
antes de interpretar cada uma como túnel separado.

## Reprodução local

Baixe o [ZIP no periódico](https://journals.plos.org/plosone/article/file?id=10.1371%2Fjournal.pone.0109436.s001&type=supplementary).
O arquivo conferido tem 5.173.127 bytes e SHA-256
`e097692104f2011f5c138a992a83cf26d760fd021424f5f52f814fa6b838da11`.
Extraia em uma pasta nova fora de `src`/build. Passe a pasta `S12` que
contém `Final` e `TimeSequences`:

```sh
node scripts/audit-gautrais.ts CAMINHO/S12
```

O leitor valida os nós, as ligações e a presença dos 217 quadros para
cada série disponível. Resume componentes e ciclos independentes
(`arestas − nós + componentes`), sem converter coordenadas, raios ou
larguras em unidades físicas. O hash do conjunto usa caminhos relativos
e conteúdo dos grafos com quebras de linha normalizadas.

## Uso possível e limites

A fonte permite preparar comparações de ramificação, conectividade
e evolução do grafo após extrair as mesmas métricas da arena do Viveiro.
Comprimento, área e volume exigem que as unidades do suplemento e o
tratamento de câmaras e galerias sejam verificados. O artigo de 2014
reanalisa a série publicada por Buhl et al. em 2004 e descreve ajustes
de parâmetros próprios. A correspondência de réplicas com as curvas de
2001/2005 não está estabelecida; não declarar independência nem usar o
conjunto como teste reservado sem verificar a proveniência. Este inventário
não é uma avaliação empírica de saídas do Viveiro.
