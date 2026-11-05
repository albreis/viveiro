# Contato com a parede e recrutamento local

A referência B4 mostrou pouco vazio aberto nos três grupos. Em seis horas,
a triagem Morris do controle registrou maior efeito da taxa de escavação
sobre massa retirada e pelotas, com efeito nulo sobre vazio aberto nas
trajetórias testadas. O [recibo da triagem](../validacoes/buhl-arena-morris-6h.json) conserva
os efeitos assinados e as faixas utilizadas.

B6 separa dois mecanismos com o mesmo relógio, densidade seca e seeds do
controle. As regras se inspiram no [estudo de Buhl et al. (2005)](https://doi.org/10.1007/s00265-004-0906-2).

- `edge-follow` detecta areia nas quatro células vizinhas, segue a borda
  enquanto mantém contato e pode abandoná-la a 0,0176/s. Uma reentrância
  é aproximada por pelo menos duas faces sólidas ao redor de uma célula
  de galeria. Nessa situação, usa-se a chance de 0,054 por contato novo.
- `edge-recruit` acrescenta uma marca na face após escavação. Uma operária
  que encontra uma face nova lê a marca local ou a mais forte de suas
  vizinhas. A marca tem meia-vida de 20 min. A resposta quadrática usa
  os valores de referência 200 para reentrâncias e 3.500 para faces planas.
  Esses parâmetros químicos são estimativas do modelo publicado. Aqui a
  resposta ocorre na mudança de face e o sinal abrange apenas vizinhas
  cardinais, duas hipóteses do Viveiro.

A ocupação exclui sobreposição na malha e a escavação permanece limitada
à fronteira acessível. A largura efetiva de uma operária é uma célula
e a grade usa quatro direções. O relatório distingue células abertas,
massa retirada e início de escavação por recrutamento. O tráfego circula
nas galerias e suas ações de transporte conservam a massa.

Os planos de [seguimento](../validacoes/buhl-arena-edge-follow-6h-plano.json)
e [recrutamento](../validacoes/buhl-arena-edge-recruit-6h-plano.json) usam as
cinco seeds de desenvolvimento em cada grupo. Compare as três variantes
às seis horas. Uma nova comparação com os dados publicados usa o
horizonte de 72 horas e os critérios de B4.

## Resultado às seis horas

As diferenças foram medidas nas mesmas cinco seeds por grupo. O
[recibo](../validacoes/buhl-arena-mecanismos-6h.json) inclui desvio padrão,
diferenças pareadas, massa e contatos.

| Operárias | Controle (cm³) | Seguimento (cm³) | Seguimento e recrutamento (cm³) |
| --- | ---: | ---: | ---: |
| 50 | 0,000 | 5,463 | 9,979 |
| 100 | 0,001 | 10,452 | 20,375 |
| 200 | 0,003 | 18,831 | 39,099 |

Esse ensaio mede o efeito das regras no simulador. A escolha para B7
usa a amostra física de 12 h e a avaliação posterior até 72 h.
