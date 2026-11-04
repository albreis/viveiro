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
- [ ] **B2 — Testar e fixar referência:** rodar testes dirigidos do benchmark e
  suíte pertinente; executar uma referência `rt24b` após a integração para
  verificar se a trajetória mudou. Não reutilizar resultados como se fossem
  da nova fonte quando o código mudou. A verificação de 600 ticks coincidiu
  com a série histórica nos três grupos. Ela cobre somente o início da rodada.
  [Comando da referência e retomada](../cli.md#comparação-com-dados-publicados).
- [ ] **B3 — Unidades e protocolo:** definir tick↔tempo físico, comprimento/volume,
  taxas biológicas e condições experimentais. O atual “1 tick = 1 segundo” do
  benchmark não está reconciliado com o dia de 100 ticks do modelo.
  [Bases de B3 e fontes separadas](buhl-protocolo.md).
- [ ] **B4 — Critérios antes do ajuste:** incluir limites inferiores/superiores
  para curva temporal e escala, incerteza de digitalização e replicação por
  grupo. Os antigos limites apenas inferiores aceitaram saturação precoce.
  Não comparar horizontes de 8/16h com alvos de 24/48h sem correspondência.
- [ ] **B5 — Rodadas retomáveis:** adaptar varreduras/sensibilidade às entradas
  de escavação; salvar por execução, fonte, seed, parâmetros e progresso.
  Rodadas BUHL-2/n1c30 de 72h foram preparadas, mas não concluídas no relatório;
  não rodar cegamente nem repetir variantes já descartadas.
- [ ] **B6 — Ajustar mecanismos justificados:** abertura precoce das frentes,
  densidade inicial, recrutamento e limites geométricos; separar volume de
  construção do alargamento de tráfego. Não afrouxar o verificador para passar.
- [ ] **B7 — Calibrar e reservar dados:** sensibilidade aponta parâmetros;
  separar observações/colônias antes de ajustar e manter seeds reservadas.
  Usar várias réplicas (meta inicial ≥5 seeds), reportar incerteza e perdas.
- [ ] **B8 — Avaliar e publicar:** MAE, cobertura, padrões que falham e limites,
  com dados/manifestos brutos em `docs/validacao.md` ou documento ligado a ele.
  Fechar P3.2/P3.3 só quando seus critérios reais forem atendidos.

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
