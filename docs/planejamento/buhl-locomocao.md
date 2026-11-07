# Buhl — ensaio fatorial de velocidade e carga

07/11/2026. Branch `codex/buhl-velocidade-carga`, criada diretamente da
main `d88c31e`. Novo pedido autoriza recuperar a integração histórica de
morfologia na arena e testar a hipótese do ganho de aproximadamente 1,6.
Não há multiplicador de volume nem alteração do perfil padrão do terrário.
O cenário com World dos PRs #128/#129 permanece uma entrega separada.

## Hipótese e intervenções fixadas antes dos novos lotes

A análise retrospectiva encontrou um fator de amplitude próximo de 1,6
entre o lote histórico e os pontos digitalizados de Buhl 2001. Isso não
demonstra causalidade. Testar os dois fatores individualmente e sua interação:

| Braço | Caminhada livre (mm/s) | Fator de carga em galeria |
| --- | ---: | ---: |
| base | 11,0222, perfil a 24 °C | 0,85 |
| velocidade | 15,05, observação de Buhl | 0,85 |
| carga | 11,0222, perfil a 24 °C | 1 |
| ambos | 15,05, observação de Buhl | 1 |

15,05 mm/s é média observada em caminhada livre fora do disco, DP 4,38,
N=100. Não é uma medida de transporte carregado em túneis. O fator 0,85
é hipótese do perfil; retirá-lo é uma intervenção experimental, não uma
constatação de que a espécie ignora o peso. O braço observado usa a medida
diretamente sem supor uma temperatura que faça a curva coincidir.
Fonte: [Buhl 2005](https://doi.org/10.1007/s00265-004-0906-2).

Todos mantêm os mesmos portes, contato corporal, grade de 0,8 mm, passo de
0,05 s, acesso à frente 0,35, tempo/massa por pelota, densidade e fadiga
apenas de escavação. Microclima permanece em 24 °C, água 0,08, umidade 0,8,
vento zero e sem secagem: hipóteses fixas, não condições medidas em Buhl.
A velocidade potencial térmica registrada no microclima fica distinta da
velocidade aplicada pelo braço observado, descrita nos metadados de locomoção.

## Protocolo e critérios

[Plano imutável de entrada](../validacoes/buhl-locomocao-plano.json):
50/100/200 operárias, cinco seeds pareadas ARENA-FADIGA-1 a 5, quatro
braços. Piloto de 2 h e, após verificação técnica, lote de 72 h por braço.
Não selecionar outra velocidade, penalidade ou seed em função das curvas.
Reutilizar o mesmo plano; qualquer correção terá registro de versão.

Antes do lote longo, conferir a reprodução dos primeiros 1.200 segundos
dos 15 controles históricos, fenótipos, balanço de massa/células e ausência
de escavação por trânsito. Instrumentação deve ser inerte para trajetória/RNG.
As quatro intervenções precisam preservar os mesmos portes individuais.

Medidas principais: volume em 12/24/36/48/60/72 h, razão por grupo ante a
base, diferenças pareadas, MAE e cobertura dos pontos digitalizados de
2001, inclinação entre grupos e médias/DP de 2005 separadas. Quantificar
interação pelo contraste ambos − velocidade − carga + base; apresentar
resultados nulos/negativos. Um ganho diverso de 1,6 não é falha de execução.

Registrar também segundos-operária escavando e com carga, passos livres
e carregados e tentativas bloqueadas. Tempo com carga inclui pausas;
passos não são tempo, e tentativas bloqueadas não são duração de bloqueio.
Essas medidas ajudam a testar a explicação por transporte, sem presumi-la.

São 60 execuções em cada horizonte, com arquivo e hash por rodada, versão
da fonte e Node; um único coordenador, até seis workers, sem mudar o motor
durante os lotes. Preservar saídas/checkpoints; não excluir uma execução
por discordar do estudo. Esses ensaios são desenvolvimento retrospectivo,
não observações independentes; B7 permanece aberto e não valida o World.

## Execução

```powershell
node scripts/run-buhl-locomotion.ts .runtime/buhl-locomocao-piloto piloto
node scripts/run-buhl-locomotion.ts .runtime/buhl-locomocao-72h 72h
```

Retomada usa `--resume`, na mesma fonte e pasta. Nenhum resultado será
multiplicado por 1,6 nos dados medidos. Gráficos e relatório terão curvas
obtidas pela execução real de cada braço. A escolha de uma referência
experimental não altera automaticamente velocidade/carga no terrário 3D.

## Verificações antes das 72 h

545/545 testes, TypeScript/Vite/i18n e os quatro braços no Chrome 157
passaram. O piloto concluiu 60 execuções de 2 h, com 420 amostras,
balanços preservados, trânsito sem abrir areia e portes idênticos entre
braços. A base reproduziu exatamente todas as amostras históricas até
2 h nos 15 pares. [Recibo](../validacoes/buhl-locomocao-piloto.json).
Nenhum coeficiente foi escolhido ou alterado após esse piloto.
