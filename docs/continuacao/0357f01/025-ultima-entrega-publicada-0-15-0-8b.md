# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## Última entrega publicada — 0.15.0 (8B)

Branch codex/checkpoints-e-recuperacao, base codex/aprendizado-local bd3b64f.
Fonte0868ca68042065212163995282400205bc788d18, tagv0.15.0. PR#18
https://github.com/albreis/viveiro/pull/18 pronto, encadeado ao#17. Deploy
appgdep_6ae74f5a580881919755d62158dda0c2 succeeded em01/11/2026 14:40:39UTC. Mesmo Site privado:
proprietário, zero externos. Arquivo../viveiro-0.15.0.tar.gz. Commits3b1f14b e0868ca6
enviados; main intocada.

IndexedDB com transação atômica,8autoslots, pontos manuais preservados, fila serial e coalescência
de autosaves pendentes. Compactação do habitat compartilhado, checksumCRC para corrupção acidental,
importação legada, fallback independente e proteção contra sobrescrita de dados ilegíveis. Sem
colaboração multitab/garantia de encerramento brusco. docs/persistencia.md. Novos módulos focados em
TypeScript, sem dependências novas. Modelo biológico inalterado.

Validação:153/153 testes em250853ms, TypeScript/Vite aprovados; não repetir sem alteração relevante.
UI real: criação de ponto,92→91%RH,restauração92 com backup anterior, importação do JSON original e
recarga. Dia267,4719escolhas/4607ajustes e formiga#647 com38ajustes conservados. Console vazio.
Screenshot viveiro-0.15.0-checkpoints.png. Backup original
~/Downloads/viveiro-a-dia-267.json e cópia
.runtime/before-checkpoints-dia-267.json preservados.806285bytes checkpoint
vs1847316exportformatado; decode igual à sessão normalizada, diferença inclui formatação/campos
derivados.

CUA export/import tiveram latência longa do provedor mas concluíram; evitar repetir sem necessidade.
Reconectar documentação após compaction. Credenciais só em memória/stdin, nunca persistir.
Publicação usa site-workflow.mjs, sourceOPEN no HEAD exato e arquivo fora do checkout. Push somente
branch e tag explícitas.

