# Avaliação da arena física de Buhl

B8 avaliou a configuração `follow-035` em cinco seeds
reservadas por grupo durante 72 h. A escolha usou as outras cinco
seeds por grupo e somente as médias digitalizadas às 12 h. O erro
relativo médio na escolha foi 10,0%. O manifesto
fixa o acesso à face, o relógio, a densidade e a dispersão.

| Operárias | Modelo em 72 h, média ± DP (cm³) | Buhl 2005, média ± DP (cm³) | MAE controle → candidato (cm³) | Cobertura da faixa de leitura |
| --- | ---: | ---: | ---: | ---: |
| 50 | 34,00 ± 0,54 | 25,35 ± 11,00 | 17,14 → 3,08 | 67% |
| 100 | 61,78 ± 0,83 | 37,15 ± 9,20 | 26,02 → 10,66 | 33% |
| 200 | 108,27 ± 0,30 | 65,27 ± 22,40 | 40,65 → 24,23 | 17% |

O erro absoluto médio (MAE) e a cobertura usam seis tempos de 12 a 72 h
da curva de 2001. A cobertura mede a proporção das médias simuladas na
faixa de leitura de ±3 cm³. O desvio padrão (DP) do modelo é entre seeds.
O DP de 2005 é entre réplicas observadas. Somente o grupo de 50 operárias
ficou na faixa descritiva média ± DP de 2005. A inclinação log-log foi
0,836, acima da faixa de leitura de 0,500 a 0,747.
[Curva e fontes](validacoes/buhl-2005.md).
[Buhl et al. (2005), tabela 1](https://doi.org/10.1007/s00265-004-0906-2).

Às 48 h, os grupos de 50, 100 e 200 operárias chegaram a 68%, 68% e 70%
dos respectivos volumes finais simulados. Na curva de 2001 as proporções
foram 82%, 84% e 80%. O modelo concentrou mais crescimento após 48 h.

Foram verificadas 3.255 amostras. Em cada uma, a massa retirada coincidiu
com a soma transportada e depositada, e nenhuma célula abriu por trânsito.

A arena usa grade cardinal, uma operária por célula, densidade seca
hipotética e acesso à face ajustado. A deposição de solo não preenche
o vazio já escavado. Os tempos tardios da mesma curva
testam extrapolação temporal e as novas seeds testam a variabilidade
do simulador. A validação empírica de P3.3 precisa de séries independentes,
com identidade por réplica e licença verificável. Os grafos de
[Gautrais et al.](https://doi.org/10.1371/journal.pone.0109436.s001)
medem topologia. A relação de suas réplicas com a série de volume ainda
precisa ser verificada.

A [comparação visual de fadiga](planejamento/buhl-fadiga.md#curvas-de-0-a-72-h)
mostra um lote pareado posterior com a curva de Buhl e as séries do
Viveiro sem e com a regra de fadiga.

## Reprodução

- [Escolha e resultados de 12 h](validacoes/buhl-arena-escolha-12h.json).
- [Plano congelado das 72 h](validacoes/buhl-arena-reservado-plano.json).
- [Resultados, limites e hashes](validacoes/buhl-arena-reservado-72h.json).
- [Medições a cada 20 minutos](validacoes/buhl-arena-reservado-72h.csv).
- [Controle e critérios anteriores ao ajuste](planejamento/buhl-criterios.md).

Para repetir as rodadas arquivadas, use a
[fonte do lote](https://github.com/albreis/viveiro/tree/c7e2688bbd4b5eb0cd8cc87f951b0abb01f1a6c5)
e o Node v24.22.1. A correção posterior roteou o cálculo
pelo serviço numérico. A repetição de uma trajetória de 12 h com a
correção preservou todas as amostras.

```sh
node scripts/sweep-buhl-arena.ts --plan docs/validacoes/buhl-arena-reservado-plano.json --out .runtime/buhl-arena-reservado-reproducao --jobs 4
node scripts/assess-buhl-arena.ts .runtime/buhl-arena-reservado-reproducao/series.json
```
