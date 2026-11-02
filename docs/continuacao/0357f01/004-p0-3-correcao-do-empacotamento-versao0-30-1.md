# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## P0.3 — correção do empacotamento, versão0.30.1

Branch codex/publicacao-por-tag, PR #41.0.30 privada já publicada/tag a8c95f9, não reabrir nem mover
tag. Site separado registrado: appgprj_6ae80cd45fdc8191be8315696a383393, URL esperada
https://viveiro-laboratorio-publico.everaldodev.chatgpt.site. Acesso ainda custom/owner, available
custom/public; nenhum acesso foi alterado. Manifesto em
G:\Projetos\viveiro-publico\.openai\hosting.json ainda static.directory public, precisa corrigir
para dist pelo set-project-id oficial com MESMO ID. NUNCA recriar.

A primeira abertura do espelho retornou commit_sha null; package gerou/pushou fonte e3641fd (Update
Site source) mas falhou com Invalid static configuration, sem archive/versão/deploy retornados. Essa
falha é o uso de public fora dos diretórios estáticos suportados; não alterar validadores. Fonte
e364 preservada. Credencial de criação em memória public030-credential; renovar se expirar. Reabrir
helper no SHA atual após o conserto, não usar a abertura antiga null.

Patch0.30.1 preparado: scripts/mirror-static-build.ts é standalone/copiado como build-static.ts no
espelho. Exige marker/CWD conhecido, recusa junctions e saídas extras, copia public→dist sem remover
arquivos. Exportador gera o script e ignora dist. Catálogo recusa desaparecer tag já indexada.18
testes combinados passaram em1.893 ms,11 novos de publicação; sem skip. Nenhuma mudança biológica.
Arquivos do patch ainda precisam de commit, build final e export031. Preservar0.30 existente no
espelho e no candidato.

Próximo concreto: commit/push patch e build310. Gerar0.30.1 no candidato
G:\Projetos\viveiro\.runtime\public-candidate-030 e no espelho definitivo
G:\Projetos\viveiro-publico a partir da fonte limpa. Modelo da0.30 anterior permanece intacto.
Corrigir somente o manifesto do espelho novo para static.directory dist pelo set-project-id; node
build-static.ts em cwd do espelho, conferir arquivos. Preview4174/sessão98236 serve candidato/public
e está ativo; IABtab7 está em licença030, pode ir à raiz e abrir031 para QA. Dev4173/PID17752 e
IABtab4 preservamoriginal62,5 em pausa.

Depois publicar0.30.1 no MESMO Site privado original (appgprj_6ae6364bc4488191b2757449ed3f7e94), tag
exata após sucesso. No espelho novo, abrir fonte atual com helper oficial (Git HEAD antes era
e3641fd), empacotar com commands:[["node","build-static.ts"]] e archivePath
G:\Projetos\viveiro-publico-0.30.1.tar.gz. Guardar MirrorSHA/arquivo e save_site_version, preservar
version_id. Só ao final update_site_access PUBLIC para o ID novo; deploy_site_version, conformeP0.3
e aprovações nativas normais. Acessar sem cookies/login raiz, duas URLs por tag, manifestos e
assets. Se houver restrição legítima, preservar progresso e IDs; não contornar. Atualizar
PR41/cronograma; fechar QA7 e apenas preview4174, manter dev4173. Não desativar retomada; faltamP0.4
eP1–P5. Nenhum outro executor ou teste pendente.

