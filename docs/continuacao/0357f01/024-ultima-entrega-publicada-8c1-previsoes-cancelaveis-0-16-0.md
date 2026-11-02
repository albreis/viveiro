# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## Última entrega publicada — 8C1 previsões canceláveis (0.16.0)

Branch codex/previsoes-cancelaveis, base codex/checkpoints-e-recuperacao5ac9d83. Versão0.16.0
publicada: fonte80fc8235bafdcb16b7f63e0ec59ab1edd2294fb7, tagv0.16.0, PR#19
https://github.com/albreis/viveiro/pull/19 aberto sobre#18. Deploy
appgdep_6ae7536aed448191b373f9e399ee378e succeeded em01/11/2026 14:57:59UTC. Mesmo Site privado,
owner-only/zero externos. Arquivo../viveiro-0.16.0.tar.gz. Módulos pequenos
src/modules/forecast (model/run/types), serviços forecast-client/runner, WorkerTS e painel próprio.
Controller perdeu a lógica antiga; arquivo workerJS substituído. Sem mudanças biológicas. Cálculo
cooperativo8ms/pausa40ms, um tick pode exceder8ms; último pedido pendente, cancelamento e
invalidação por intervenção/reset/restore/replay/cenário. Opções1/3/7dias,6/18futuros,10/30/120s
ativos; orçamento incompleto explícito, não auto-reinicia, amostra<2não exibe intervalo.

Oito testes novos e dois existentes de forecast/restore passaram (41379ms regressão);
TypeScript/Vite e diffcheck aprovados. Não alegar execução completa161/161:153/153 foi na0.15.0.
Engine igual ao ensemble síncrono. CLI backup real97adultos:2x10passos,912,9ms,maiorfatia160,7ms.
Browser seed a/dia267 pausado preservado,2colônias/97adultos/14crias. QA
orçamento10s→3/6futuros,98–99,25s; completo6/6→97–99,44,9s/17,6s. Cancelamento, recálculo
e92→91→92%RH descartaram resultados velhos. Nenhum erro novo na QA final; dois logs de14:44:57
vieram de HMR parcial antes da recarga final. Screenshots0.16.0-previsao e-completa. DevG PID17752.
Localtab2 mantida; previsão deixada cancelada, opções1/6/120. Site tab1 intocado.

Próximo concreto: criar codex/observacao-e-validacao para8C2 para observações parciais/completas,
erros por horizonte e baselines em séries reservadas, custo e métricas explícitos. Não tratar
faixaP10–P90 sintética como confiança científica calibrada. Etapas9–14 ainda pendentes. Publicar com
helper sourceOPEN no HEAD final, archive../viveiro-0.16.0.tar.gz fora do checkout,
preservar acesso owner-only. Tags e saves antigos preservados. Push só branch/tag específicas.

