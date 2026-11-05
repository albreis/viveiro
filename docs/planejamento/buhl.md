# P3 — Retomada da calibração e validação de Buhl

**Estado: iniciado, sem aceite científico.** Outra branch já contém benchmark,
resultados e diagnósticos. Não classificar todo P3 como “só falta o usuário”.

## Fonte e trabalho preservado

- Branch `claude/project-thread-kazijj`, [PR #69](https://github.com/albreis/viveiro/pull/69).
- Cabeça lida: `512b8c0fbe07ff015b4be85075e7457f5cf57395`.
- [Relatório de continuidade nessa revisão](https://github.com/albreis/viveiro/blob/512b8c0fbe07ff015b4be85075e7457f5cf57395/docs/validacoes/relatorio-continuidade-buhl.md).
- Também conferidos: `buhl-2005.md`, `analise-equacoes-escavacao.md`,
  `fluxo-tunel.md`, `anexos-buhl/README.md` e `docs/cli.md` dessa revisão.
  Inventário contextual: 131 Markdown, incluindo checkpoints históricos.
- A branch descreve modelo 0.41.0 e aguardava P2.3/P2.4, agora entregues na main.
  O PR está com conflitos; não integrar automaticamente nem descartar anexos.
  A falha antiga relatada não é falha atual: a main da 0.46.0 passou 474 testes.

## O que os resultados já mostram

Experimento Buhl: *Messor sancta*, grupos de 50/100/200 operárias, arena de areia
quase 2D, sem rainha/prole/predadores. A referência não é um terrário genérico.
Tabela e curva foram transcritas/digitalizadas; a estimativa visual de volume
é aproximadamente ±3cm³, sem observações brutas por réplica. Registrar essa limitação.

O modo padrão não reproduziu o conjunto de padrões. Variantes descartadas e a
separação entre volume de frentes e alargamento por tráfego estão documentadas.
O modo experimental de estigmergia v2 continua opcional, não padrão biológico validado.

Referência `rt24b`, seed BUHL-1, 24h, energia individual mantida: volumes finais
5,63/8,35/14,46u³ e expoente 0,68. **Isso não é calibração concluída:** grande parte
da escavação ocorreu cedo demais, e os volumes ainda não têm escala física.
Uma concordância de expoente não compensa curva temporal errada.

O teste de fluxo relatou velocidade quase constante de ~0,045u/tick de 2 a 200
agentes; o acúmulo ocorre também em câmaras. Uma comparação numérica de trânsito
é [opcional](dados-opcionais.md), não prova já existente de equivalência com a natureza.

## Ordem técnica de retomada

- [x] **B1 — Reconciliar sem perder:** integrar a branch científica numa
  branch própria, preservar o histórico e a aritmética portátil, e reutilizar
  arquivos imutáveis e o pool de P2.3 para a retomada por grupo.
  [Validação da reconciliação](../validacoes/buhl-reconciliacao.json).
  A aplicação de Morris aos parâmetros de escavação fica em B5.
- [x] **B2 — Testar e fixar referência:** a execução após a integração
  repetiu a rodada de 86.400 ticks por grupo de `rt24b` para 50, 100 e 200 operárias.
  As 145 amostras de cada grupo e o CSV completo coincidiram com os anexos.
  O volume final de 200 operárias foi 14,456723508110988 u³.
  [Recibo com fonte e hashes](../validacoes/buhl-rt24b.json) ·
  [Comando da referência e retomada](../cli.md#comparação-com-dados-publicados).
  O aceite cobre reprodutibilidade computacional.
- [x] **B3 — Unidades e protocolo:** executar a arena de disco fixo com
  operárias dispersas por seed, relógio em segundos e série em cm³.
  Registrar hipóteses do solo, remoção por frente, pelotas e balanço de massa.
  [Protocolo, fontes e comando](buhl-protocolo.md).
- [x] **B4 — Critérios antes do ajuste:** aplicar os limites bilaterais e o
  diagnóstico de escala ao controle de 72 h, com cinco seeds por grupo.
  Os três grupos ficaram abaixo das curvas observadas.
  [Critérios, resultados e série](buhl-criterios.md).
- [x] **B5 — Rodadas retomáveis:** executor por seed/grupo com plano, fonte,
  versão do Node, checkpoint e hash por rodada. Triagem Morris pareia seeds
  para densidade seca, taxa de escavação e coleta de pelotas.
  [Planos, comandos e retomada](buhl-lotes.md).
- [x] **B6 — Ajustar mecanismos justificados:** separar o seguimento da
  parede e o recrutamento em variantes e medir seus efeitos em cinco
  seeds por grupo, com abertura por escavação separada do trânsito.
  [Mecanismos e ablação às seis horas](buhl-mecanismos.md).
- [ ] **B7 — Calibrar e reservar dados:** ajuste exploratório de 12 h
  concluído. A configuração foi congelada antes de usar as seeds
  reservadas. Faltam observações empíricas independentes por réplica.
  [Método, escolha e plano reservado](buhl-ajuste.md).
- [x] **B8 — Avaliar e publicar:** 15 rodadas de 72 h com seeds reservadas.
  O ajuste melhorou o MAE, mas o volume cresceu demais após 12 h.
  [Relatório, dados e reprodução](../validacao.md). P3.2 e P3.3 seguem abertos.

A execução longa e o pós-processamento são trabalho técnico. Acesso a dados ou
hardware só exige intervenção humana quando de fato indisponível. Não estimar
“~2× mais rápido” como ganho medido a partir de uma hipótese de otimização.
Não alterar ordem/RNG de um agente dentro da rodada; paralelizar apenas rodadas
independentes com contrato determinístico e registro de versão.

## Limites científicos e dependências

Os resultados atuais de Buhl ainda não satisfazem P3.2. Registrar ≥3 padrões
observados não exige, por si só, três estudos diferentes; explicitar dependências
entre padrões. Os estudos adicionais continuam opcionais. Comparar com NetLogo
é modelo contra modelo, não replicação empírica. Dados reservados não substituem
avaliação por um grupo externo.

P3.1 mantém espécie compatível, licença/proveniência e acordo real com laboratório.
*Lasius niger* é candidata, não perfil já calibrado; Buhl usa outra espécie.
P3.3 exige dados reservados antes do ajuste. P3.4 exige preprint/pareceres reais.
Ver [terceiros](com-terceiros.md) e [dados adicionais opcionais](dados-opcionais.md).
Dados usados para fixar parâmetros não podem ser reutilizados como validação
independente do mesmo ajuste. Não declarar equivalência entre espécies sem análise.
