# Extensões locais tipadas

A API de pesquisa separa observações, sensores, submodelos de sinais e pesos de decisão. ACO continua sendo o padrão; adicionar um arquivo não muda experimentos antigos nem o terrário salvo.

## Criar em um arquivo

Copie `src/extensions/balanced.ts`, altere `id`, `version` e as funções. O export default usa `satisfies DecisionExtension`. Os contratos ficam em `src/modules/extensions/types.ts`.

- `SensorSystem.sample(LocalInput)` deriva sinais finitos de energia, carga e saídas adjacentes.
- `DecisionSubmodel.compute(DecisionFrame)` transforma sinais; recebe apenas observações e resultados anteriores da mesma decisão.
- `DecisionPolicy.weights(DecisionFrame)` devolve um peso não negativo por saída. A soma deve ser positiva; o simulador usa seu RNG por seed para amostrar.

Observações são cópias congeladas; não incluem World, posições globais, estoques, mapa completo ou referências mutáveis dos agentes. As saídas já passaram pela verificação física de passagem. A política não devolve uma posição e não escava, move alimento ou altera o relógio. Submodelos desta API são transformações locais de sinais, não substituições arbitrárias dos solvers de gases/solo.

Um peso só pode valer de 0 a 1.000.000. Sensores/submodelos têm até 16 instâncias por estágio, 32 sinais por instância e sinais finitos de módulo até 1.000.000. Saída inválida encerra o experimento com erro explícito, sem fallback silencioso.

## Executar e comparar

```sh
npm run experiment -- --extension src/extensions/balanced.ts --seed MINHA-SEED --start established --profile generic-demo@1 --days 5 --out ensaio-novo
npm run compare:policy -- --extension src/extensions/balanced.ts --days 5 --replicates 4 --seed POLICY-43 --out comparacao-nova
```

A segunda CLI executa ACO e extensão com a mesma seed em cada réplica, guarda CSVs e manifestos individuais e produz `comparacao.csv`. Réplicas diferentes recebem seeds diferentes. O protocolo registra perfil, horizonte, identidade e hash da extensão. Contagens de decisões ajudam a distinguir uma política realmente acionada de um ensaio curto sem operárias.

O exemplo favorece conforto e evita visitas repetidas. É uma hipótese de programação, não um comportamento validado por espécie. Melhorar um resultado interno não demonstra maior realismo biológico. Comparações não substituem P3.

## Reproduzir e restaurar

O plano/manifesto guarda `{schema, id, version, sourceSha256}`. O hash SHA-256 é da fonte com finais de linha normalizados para LF. Uma versão instalada não pode ser substituída por fonte diferente. Não se reutilizam registros de outra versão ou outro hash. O caminho local do arquivo não integra o manifesto.

No navegador, apenas extensões incluídas no bundle estão disponíveis. O exemplo é incluído; selecione sua referência no plano JSON do laboratório isolado. Um JSON nunca autoriza importar um arquivo ou URL. Extensões novas exigem compilação do bundle ou o argumento explícito `--extension` na CLI.

Ao restaurar um snapshot que usa extensão, a mesma identidade deve estar registrada antes de `World.restore`; identidade ausente ou alterada produz erro antes da continuação. Os módulos de desenvolvimento podem usar `loadTrustedExtension` antes da restauração. O resto do save e as colisões conservam os mesmos validadores.

## Limite de confiança

`--extension` executa código local de desenvolvedor com as permissões do processo Node. Tipos, observações congeladas e validação de pesos são um contrato do modelo, **não uma sandbox de segurança**. Use somente arquivos revisados de confiança. Importações transitivas são responsabilidade do autor; o hash do manifesto identifica apenas o arquivo indicado. Para um pacote com dependências externas, fixe também versões/fontes em seu próprio protocolo.

Para reprodução científica, funções devem ser puras e determinísticas: não use `Math.random`, relógio real, rede, arquivos mutáveis ou estado global. A amostragem é feita pelo RNG do simulador, não pela extensão. Os testes do exemplo verificam repetição e limites locais; não certificam extensões de terceiros.

## Ensaio registrado

Quatro réplicas pareadas, cinco dias, generic-demo@1 estabelecido. A escolha foi acionada de fato nas quatro execuções customizadas; resultados são internos ao modelo, sem evidência de superioridade biológica.

| Réplica | População ACO | População extensão | Decisões extensão |
| ------- | ------------- | ------------------ | ----------------- |
| 1       | 25            | 23                 | 71                |
| 2       | 23            | 25                 | 89                |
| 3       | 29            | 21                 | 88                |
| 4       | 28            | 23                 | 88                |

[Dados da comparação](../experimentos/policies-043/comparacao.csv), [protocolo completo](../experimentos/policies-043/protocolo.json) e [arquivos individuais com hashes](../experimentos/policies-043/arquivos.json).
