# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## P0.3 — versão0.30.1 privada publicada; finalizar o Site separado

Fonte/tag v0.30.1:d61a439980d32dcbae61bba5d2aeb274fbb75341, branch codex/publicacao-por-tag, PR #41
sobre #40. Deploy privado appgdep_6ae811f8a364819185b8aa71e710ac29 succeeded em02/11/2026 04:31:02
UTC (01:31 São Paulo). Versão
appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_d7e6344067dc8191a838595a42f579d9. Arquivo
../viveiro-0.30.1.tar.gz preservado. Site privado original
appgprj_6ae6364bc4488191b2757449ed3f7e94 não teve audiência alterada;0.30 e tag a8c95f9 também
preservadas. Não repetir publicações privadas concluídas.

Site SEPARADO já registrado: appgprj_6ae80cd45fdc8191be8315696a383393. URL esperada
https://viveiro-laboratorio-publico.everaldodev.chatgpt.site ainda não publicada. NUNCA recriar.
Acesso inicial custom/owner, available custom/public, zero externos. Espelho
../viveiro-publico tem .openai/hosting.json CORRIGIDO pelo set-project-id oficial com MESMO
ID e static.directory dist. Fonte de assets em public/, build-static.ts gera dist/ por cópia exata;
dist ignorado. Duas releases:0.30.0 origem a8c95f9 e0.30.1 origem d61a439;13 arquivos cada, hashes
verificados no dist. O build copia30 arquivos no total. Não copiar histórico/saves/credenciais.

Primeira preparação do espelho com static.directory public falhou na configuração DEPOIS de
gerar/pushar fonte e3641fd, sem versão/deploy retornados. Essa fonte foi preservada. Usar
configuração dist suportada, sem relaxar validadores; reabrir helper no HEAD atual, não reutilizar
abertura antiga null. Adaptador e correção agora rastreados no GitHub/d61a.11 testes novos/18
combinados passaram, build310 módulos; nenhum modelo biológico mudou.

QA031 nativa em IABtab7/localhost4174/releases/v0.30.1/: retomou mesmo save D1,1 em pausa e Worker
avançou1dia→D2,1; console limpo. QA030 antes cobriu primeira pessoa, mesh/forecast/advance Workers,
relatório/download, licenças e checkpoint/reload. Candidato
.runtime/public-candidate-030/public tem mesmos bytes do espelho definitivo
para031; preview temporário sessão98236 ainda ativo4174. Dev G17752/4173 e IABtab4 preservam
original SEMENTE-50088/D62,5/labv5 pausado. Sem teste/helper pendente.

PRÓXIMO: abrir fonte do espelho já registrado com helper oficial e credencial via stdin (renovar
para ID NOVO se precisar). Current Git HEAD do espelho antes dos consertos era e3641fd; public031,
script e manifesto corrigidos estão modificados/não commitados, helper fará commit/push. Package
commands:[["node","build-static.ts"]], archivePath ../viveiro-publico-0.30.1.tar.gz.
Guardar MirrorSHA e archive do resultado, salvar versão nativa e preservar version_id. Como último
passo deP0.3, update_site_access public APENAS para o ID novo, conforme pedido do cronograma, com
aprovações normais; depois deploy_site_version para versão salva. Conferir sem cookies/login a raiz,
ambas URLs por tag, manifestos e assets; QA visual e screenshot. Registrar URL real/versão/status no
PR41 e cronograma. Se bloqueio legítimo, preservar progresso/IDs e aguardar, nunca contornar. Fechar
QA7 e só o preview4174, manter dev4173. P0.4 eP1–P5 seguem; P5 último. Automação necessária, nenhum
executor concorrente.

