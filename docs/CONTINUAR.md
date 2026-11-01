# Continuação do Viveiro

Trabalhar em G:\Projetos\viveiro. Ler AGENTS.md e docs/cronograma.md antes de editar.
O usuário autorizou continuar até finalizar o cronograma, com retomada periódica após
limites de uso. Manter arquivos pequenos, dev ligado e PR por etapa.

## Estado salvo

- Site privado: https://viveiro-caos-formigueiro.everaldodev.chatgpt.site
- 0.4.0 publicada do commit ec9815c20b81de46039b97172cb610287b4e994b.
- Tag v0.4.0 aponta para essa fonte.
- Branch procedural: codex/terrario-procedural, último commit documental 260d12d.
- Seis PRs abertos: #1 → #2 → #3 → #4 → #5 → #6, com bases encadeadas.
- main permanece na versão anterior enquanto os PRs estão abertos.
- Suíte completa de 48 casos aprovada; regressões dirigidas, TypeScript e build aprovados.
- Projeto e dependências foram movidos de C para G; a cópia antiga foi removida após verificação.
- Dev Vite em http://127.0.0.1:4173/, iniciado em segundo plano. Logs em .runtime/.
- Retomada horária nesta conversa: continuar-cronograma-do-viveiro. Usa o app nativo;
  depende de máquina/app ligados e de disponibilidade de uso. Não contornar limites.

## Próxima entrega

Branch codex/genetica-e-heranca foi avançada linearmente até 260d12d, sem implementação
genética ainda. Implementar a etapa 5A: genomas persistentes, parentesco, cruzamento,
mutações reproduzíveis e efeitos limitados em corpo, velocidade, limiares e sensores.
Preservar os atributos das formigas de saves antigos; não inventar ascendência.

Depois: 5B — voo nupcial, fundação orgânica, reservas, escavação do primeiro buraco
e naníticas; 6 — simbioses e colônias vizinhas; 7 — solo granular, umidade espacial e
gases/ventilação; 8 — RL, checkpoints longos e avaliação das previsões. Usar os critérios
de aceite do cronograma e registrar modelos exploratórios sem alegar calibração.

Ao fechar cada entrega: testar, conferir no navegador, atualizar este checkpoint e
cronograma, fazer commit/push, abrir PR sobre a etapa anterior e publicar o Site privado
pelo fluxo da skill Sites. Credenciais apenas em memória/stdin. O helper exige arquivo
tar fora do checkout ou em outputs/ ignorado; usar G:\Projetos\viveiro-VERSAO.tar.gz.
Reabrir o fluxo de source no HEAD atual antes de empacotar; referências antigas podem
ser recusadas pela revisão automática. Não juntar PRs ou descartar branches para limpar.

## Cuidados de desenvolvimento

Gravar mudanças de forma atômica, já formatadas, para o Vite não reter um módulo vazio
durante uma gravação. Isso já ocorreu com renderer/environment.js e foi resolvido
invalidando o módulo e recarregando o dev. Não houve alteração no código publicado.
Só reiniciar o servidor se necessário, verificando que o processo é o Vite deste projeto.

Saves do navegador são separados por perfil. A sessão IAB de QA pode criar terrários;
não apagar ou substituir o experimento do Chrome do usuário. Para observar um novo
desenho procedural em um save anterior, é necessário Novo terrário ou reiniciar a seed.
