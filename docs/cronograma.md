# Cronograma de entregas

Atualizado em 03/11/2026. Plano operacional dividido por responsabilidade.
Os IDs P0–P4 continuam válidos. `[x]` indica aceite registrado; `[ ]` indica
trabalho pendente, inclusive quando a implementação já existe.

## Situação atual

**Última release: [0.46.0](https://github.com/albreis/viveiro/releases/tag/v0.46.0).**
P2.1–P2.7 implementados e publicados. UI/renderer em TypeScript estrito;
474 testes e build aprovados na entrega. [Recibo](validacoes/release-0.46.0.json).
O modelo continua exploratório, sem calibração biológica concluída.

- [x] P0.1–P0.3: licenças, integração e publicação pública separada.
- [x] P0.4: CFF, botão de citação e DOI real da versão consolidada conferidos.
  P0.4A/C já entregues; P0.4B encerrado com a **0.46.0**, não com DOI antigo:
  [10.5281/zenodo.23932885](https://doi.org/10.5281/zenodo.23932885).
  [Arquivo, hashes e conferência](validacoes/zenodo-0.46.0.json).
- [x] P1.3/P1.5: experimentos de um clique e PWA offline.
- [x] P1.6B2-L: Lighthouse de acessibilidade 97 desktop/100 móvel;
  [relatórios](lighthouse.md). Não substitui leitor de tela nem certifica WCAG AA.
- [x] P1.6B2-Z: usuário informou que testou o zoom e está adequado em 03/11.
  Navegador/percentuais não informados; regressão de layout será reavaliada.
- [x] P4.1A/P4.2A: estrutura de contribuições e dez receitas da equipe.
- [ ] P3: calibração **já iniciada** na branch `claude/project-thread-kazijj`;
  resultados ainda não satisfazem o aceite científico. [Retomada Buhl](planejamento/buhl.md).
- [x] UX: 21 melhorias implementadas em cinco fases. A confirmação dos gestos em celular físico segue na fila individual.
- [ ] Dados adicionais: **opcionais**, para ampliar evidências depois; não bloqueiam Buhl/UX.

- [x] [Página privada de leitura do cronograma](cronograma-privado.md): busca,
  filtros e áreas por responsabilidade; gerada destes documentos, fora do build público.

## Três filas de trabalho

| Fila | O que contém | Plano detalhado |
| --- | --- | --- |
| Técnica | Código, testes automatizados, métricas e análise dos dados | [Trabalho técnico](planejamento/tecnico.md) |
| Você sozinho | Verificações manuais e decisões sem depender de outra pessoa | [Tarefas individuais](planejamento/voce-sozinho.md) |
| Com terceiros | Participantes novos, docentes, turmas, laboratório e revisão externa | [Dependências externas](planejamento/com-terceiros.md) |

Ter dados produzidos por outro grupo não exige uma nova parceria quando o reuso
já é permitido. Rodar axe-core é trabalho técnico; usar um leitor de tela real
é uma verificação manual que você pode fazer sozinho, com orientação.

## Próximas entregas técnicas

1. **T1 — Acessibilidade entregue.** Axe-core e Playwright examinaram 78 estados.
   Os dois achados do Lighthouse e o contraste durante a troca A/B foram corrigidos.
   [Relatório e pontos de inspeção manual](validacoes/axe-t1/resumo.json).
2. **T2 — UX entregue:** fases 1–4 e explicações das métricas, com regressão a cada fase.
   [UX-01–UX-21 e aceites](planejamento/ux-interface.md).
3. **T3 — Desempenho técnico entregue:** [TBT, CLS e ensaio de FPS](qa-desempenho.md).
   O ensaio em equipamento escolar segue no aceite P1.1B.
4. **T4 — Buhl/P3:** reconciliar a branch científica com a main atual,
   conferir testes e uma referência antes de retomar varreduras longas.
   [Ordem, resultados e impedimentos reais](planejamento/buhl.md).
5. **T5 — Apoio às validações humanas:** instrumentos e relatórios reproduzíveis
   para docentes, piloto, contribuições e publicação.

A triagem documental de Buhl já foi feita; a ordem acima trata das entregas de
implementação. Não iniciar um executor concorrente. Não rodar novamente os
experimentos longos sem antes incorporar as ferramentas P2 e permitir retomada.

## Aceites que continuam abertos

| ID | O que falta para concluir | Responsabilidade |
| --- | --- | --- |
| P1.1B | ≥30 FPS em Chromebook/notebook de entrada identificado, em movimento e sob carga | Técnico + você; terceiros apenas se precisar de equipamento emprestado |
| P1.2B | Pessoa nova entra em primeira pessoa em <2 min sem ajuda | Terceiros |
| P1.4B | Seis roteiros com pareceres reais de Biologia/Física e correções | Terceiros + técnico |
| P1.6B2 | CSV em planilha, leitor de tela e demais estados rumo à WCAG 2.1 AA; zoom/Lighthouse registrados acima | Você + técnico |
| P1.7 | Piloto em 2–3 turmas, SUS médio >70 e pré/pós-teste com relatório | Terceiros + técnico |
| P3.1 | Perfil/espécie, dados licenciados compatíveis e acordo com laboratório | Técnico + você + terceiros para o acordo |
| P3.2 | ≥3 padrões observados, parâmetros guiados por sensibilidade, fonte/amostra/incerteza | Técnico; dados/revisão externa quando necessários |
| P3.3 | Dados reservados antes do ajuste, MAE e cobertura reais, inclusive resultados ruins | Técnico; replicação independente separada |
| P3.4 | Preprint disponível e aceite JOSS; relato do piloto quando realizado | Você + técnico + terceiros para parecer/aceite |
| P4.1B | Primeira contribuição externa real integrada | Terceiros + técnico |
| P4.2B | Dez receitas externas revisadas: total 20, metade de fora da equipe | Terceiros + técnico |
| P4.3 | Uma oficina/minicurso por semestre, com gravação publicada | Você + terceiros |

## Incrementos opcionais após o escopo atual

[**P3-OP — Dados abertos adicionais**](planejamento/dados-opcionais.md): trânsito,
escavação 3D, crescimento, tarefas e redes de contato. Inclui fontes de parâmetro
separadas dos dados de validação. Planejado, sem implementação ou downloads
volumosos nesta reorganização. Não é requisito novo para encerrar o escopo ativo.

## Entregas anteriores e histórico

Etapas 0–14 concluídas como mecanismos/protótipos: navegação e apoio, túneis vivos,
estoques/prole/trofalaxia, reação-difusão/ACO, genética/fundação, ecologia,
solo/água/calor/gases, aprendizado local, persistência, previsões e ritmo biológico.
Calibração por espécie e revisão docente das etapas 7/9/12/13 seguem em P1/P3.
Não se declara validada a longevidade de 15–30 anos nem o relato de 28a8m.

[Resumo das entregas](planejamento/entregas-concluidas.md).
[Histórico integral anterior à reorganização](https://github.com/albreis/viveiro/blob/17d5f70070a4e32df6ce1a6bf68dd9b8f5861fbd/docs/cronograma.md).
O histórico mantém critérios, PRs, seeds e evidências sem transformar este índice
novamente em um diário gigante. Notas antigas de ranking são opiniões editoriais,
não prova de superioridade sobre outros simuladores.

## Fora do escopo e regras de entrega

**P2.8 descartado; P5.1–P5.7 descartados por enquanto**, conforme pedido de 02/11.
Não retomar sem novo pedido. Um servidor contínuo também não é requisito atual.

Usar branches `codex/`, arquivos pequenos em `src`, TS para módulos novos, Vite,
testes adequados, conferência no navegador e PRs em ordem. Preservar saves, tags,
branches e o Site privado. Público: GitHub Pages; não atualizar o Site público
antigo. Manter dev em `http://127.0.0.1:4173/` a partir de G.

Esta reorganização não gera tag/release/depósito Zenodo. A integração automática
já está ativa; próximas versões consolidadas precisam de metadados atualizados.
[Checkpoint operacional](CONTINUAR.md).
