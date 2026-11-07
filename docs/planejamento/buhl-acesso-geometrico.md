# Diagnóstico curto — acesso à frente com corpos explícitos

07/11/2026. Hipótese formulada após examinar os três primeiros braços do
ensaio de locomoção e o código, antes de executar este diagnóstico.
É investigação exploratória posterior, não pré-especificação retroativa.
Não acrescenta casos nem altera parâmetros do lote fatorial de 72 h.

## Motivo e contraste fixado

O registro de [ajuste antigo](buhl-ajuste.md) define `contactAccess` como
fração de oportunidades em que uma operária consegue acessar uma face,
uma hipótese para a aproximação de uma operária por célula. O valor 0,35
foi escolhido olhando o volume de 12 h. Com a exclusão corporal explícita,
o fator permanece multiplicando as chances de iniciar escavação.
Isso pode representar parte da restrição de acesso duas vezes; ainda não
é uma causa demonstrada da discrepância com Buhl.

Comparar somente `contactAccess: 0.35` com `contactAccess: 1`. O segundo
remove a redução fenomenológica adicional; as restrições físicas entre
corpos e a chance local de cavar continuam. Não se escolhe um valor
intermediário para aproximar o volume observado.

Manter Narbonne v2, caminhada térmica de 11,0222 mm/s a 24 °C, carga 0,85,
fadiga de escavação, densidade, dimensões, passos, tempo e massa por pelota.
50/100/200 operárias, cinco seeds pareadas, horizonte de apenas 7.200 s.
A base é o braço `base` do piloto já concluído, reproduzido exatamente.
[Plano de entrada](../validacoes/buhl-acesso-geometrico-piloto-plano.json).

## Execução e interpretação

Iniciar somente depois de terminar o único coordenador de 72 h.

```powershell
node scripts/sweep-buhl-arena.ts --plan docs/validacoes/buhl-acesso-geometrico-piloto-plano.json --out .runtime/buhl-acesso-geometrico-piloto --jobs 6
```

Medir volume aberto, massa removida, inícios de escavação, tempo cavando,
tempo com carga e bloqueios, com diferenças pareadas nas mesmas seeds.
Conferir hashes, balanços e portes idênticos. Registrar o resultado mesmo
se o efeito for pequeno ou desfavorável. A saída de 2 h não é uma curva
de 72 h, nem demonstra que o volume de Buhl foi reproduzido.

Outra hipótese separada: em reentrâncias, a regra exige uma nova face de
contato para tentar cavar. Uma operária imobilizada pode não renovar essa
oportunidade. Este diagnóstico não muda a regra nem inventa uma frequência
de contato antenal; sua representação e evidências precisam ser investigadas.

A remoção do fator é uma ablação da hipótese de acesso, sem promoção
automática ao padrão do terrário. B7 continua aberto. Dados anteriores
permanecem preservados; nenhum fator de produtividade 1,6 será aplicado.
