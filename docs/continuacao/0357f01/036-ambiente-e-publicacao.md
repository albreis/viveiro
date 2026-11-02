# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## Ambiente e publicação

Escritas atômicas e já formatadas; normalizar CRLF antes de substituições multilinha. Código em src
e dist gerado pelo Vite. Usuário pediu dev ligado na máquina local; não encerrar. Logs .runtime/ ignorados.

Push apenas da ref da entrega e tag específica: push --all já foi rejeitado por escopo amplo. Não
enviar branches alheias nem mesclar main. Cada etapa tem testes, navegador, commit/push e PR sobre a
base anterior.

Sites: get_site e credencial, helper de abertura no HEAD corrente antes de empacotar. Credenciais só
em memória/stdin. Arquivo tar fora do checkout; ../viveiro-0.9.0.tar.gz e
../viveiro-0.10.0.tar.gz já publicados. Guardar literalmente project_id/commit_sha/archive
retornados. Fonte publicada é a tag, enquanto o checkpoint posterior contém os IDs do deploy.
