# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## Última entrega publicada — etapa14 (0.29.0)

Branch codex/ritmo-e-avanco-entre-sessoes sobre f4e6410/#38; PR #39. Fonte/tag
v0.29.0:df92cc32d58df237f6df909d41e5aaca61d1900b. Deploy appgdep_6ae800cdb6d08191b4d7fcb69400ea9e
succeeded em02/11/2026 03:17:45 UTC (02/11,00:17 São Paulo). Versão
appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_87873ae98b7c8191804d15d6c81103b3. Mesmo Site
privado, proprietário único, zero externos. Arquivo G:\Projetos\viveiro-0.29.0.tar.gz preservado.
Módulos pequenos TypeScript em src/modules/time, services/advance-client, workers/advance.worker e
app/time/advance-controls. Relógio de sessão separado de100 ticks/dia, base10/60/300/3600 s e
multiplicadores1/3/10; dívida e fração salvas. Novas instalações60 s/dia; saves sem relógio
preservam10. Replay compartilhado, A/B em passos iguais. Avanço explícito pausado em Worker:
checkpoint prévio nomeado obrigatório, orçamento10/30/120 s ativos, dias1–365, fatias8 ms/yield16
ms, resultado parcial em ticks inteiros/destino persistido, mensagens obsoletas descartadas.
Cancelar/fechar descarta tentativa não aplicada; sem checkpoints dentro dela e sem servidor
contínuo. Sem pacote novo. Ver docs/ritmo-e-continuidade.md.

284/284 testes completos em220.126 ms (.runtime/time-suite.log), sessão50079 encerrada. Depois dois
casos adicionais de filhas/perfil novo:18 dirigidos finais passaram em2.919 ms. Não afirmar
suíte286. Build final308 módulos aprovado. Nenhum processo de teste pendente; somente dev G
PID17752.

QA: usuário duplicado D62,5→63,5 por avanço1dia, ritmo60 s/dia a3× persistiu no reload.
manual-2f3f2138-7722-4ded-a2bd-e3c5e81d9d71. Cancelamento após36+ dias calculados manteveD63,5.
Orçamento aplicado48,92dias→tick11242, destino42850; manual-2d747e9f-9eda-4e81-b163-1b92db4915e8.
Reload manteve destino/ritmo; retomou316,08 dias restantes e chuva cancelou sem aplicar futuro
tardio. Original manual-2e91b636-785f-4f66-bb84-ff832aa62547 restaurado com ACK:
SEMENTE-50088/D62,5/labv5,10 s/dia a1×, pausado. Console limpo. Painel junto da cena; screenshot
viveiro-0.29.0-tempo-final.png no diretório de visualizações. IABtab4 mantida.

Próximo imediato: 0.29 publicada; não repetir. Revisão do núcleo (ordem real dos sistemas,
regressão, licenças/proveniência e limites), depoisP0–P5, P5 por último. Não repetir13B publicada.
Não desativar automação: faltam essas fases e dependências externas reais. Nenhum executor
concorrente.

