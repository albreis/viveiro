# Continuação do Viveiro

Trabalhar em G:\Projetos\viveiro. Ler AGENTS.md e docs/cronograma.md.
O usuário autorizou continuar até finalizar o cronograma, com retomada horária
nesta conversa após limites de uso. Automação: continuar-cronograma-do-viveiro.
Não criar executores concorrentes nem contornar cotas ou aprovações.

## Entregas e Git

- Site privado: https://viveiro-caos-formigueiro.everaldodev.chatgpt.site
- Publicada: 0.5.0, fonte e149fe8944b315bbff078a4f1be7a471c3297145, tag v0.5.0.
- A 0.4.0 permanece preservada na tag v0.4.0.
- Branch atual: codex/genetica-e-heranca, baseada em codex/terrario-procedural.
- Código funcional da 5A: commits 7d3a879 e 563fd42.
- PRs #1 a #7 estão abertos e encadeados; main permanece na versão anterior.
- Genética 5A: https://github.com/albreis/viveiro/pull/7, base codex/terrario-procedural.
- Cada entrega: branch própria, testes, navegador, commit, push, PR e publicação
  no mesmo Site privado. Preservar branches, tags e saves.

## Etapa 5A validada — versão 0.5.0

Genomas e fenótipo em src/modules/genetics. Herança haplodiploide digital,
recombinação, mutações e parentesco persistentes do ovo ao adulto. Efeitos limitados
em corpo, velocidade, sentidos, metabolismo e tarefas. Saves antigos preservam
atributos e recebem procedência inferida, sem inventar ascendência histórica.

A validação encontrou gargalos de navegação e foram corrigidos:

- entrada lenta pelo apoio real da borda do poço;
- recuperação por progresso físico, além das células da grade;
- aproximação física da frente mesmo quando o nó lógico já indica chegada;
- avanço limitado de mordidas e uma atualização por frente e tick.

Resultado final: 57 testes aprovados, TypeScript e build aprovados.
Fluxo: 30 saídas reais e maior estagnação de 113 ticks na regressão.
Apoio: gap máximo 0,0105 e deslocamento dentro do limite por velocidade.
Navegador conferido: seed nova, pais de uma operária, caminhada, primeira pessoa
e retorno. Screenshot de QA no diretório de visualizações autorizado do Codex.
Se a CUA retornar browser.user indisponível após horas parada, reiniciar a REPL e
vincular de novo a aba IAB existente resolveu; não trocar para outro mecanismo.

A 0.5.0 foi publicada com sucesso em 01/11/2026 e o PR #7 está aberto.
A próxima tarefa é implementar 5B, sem repetir testes ou publicação da 5A.

## Próxima implementação

Criar codex/voo-e-fundacao a partir da branch genética atual para a etapa
5B — voo nupcial, perda das asas, fundação orgânica, reservas maternas,
escavação do primeiro buraco e naníticas. Usar uma branch codex/ própria após 5A.
Atualmente o protótipo ainda começa com câmaras e um casal já reprodutivo;
não dar a etapa 5 completa antes de implementar a fundação e novas gerações.

Depois: 6 — simbioses e colônias vizinhas; 7 — solo granular, umidade espacial,
gases e ventilação; 8 — RL, checkpoints longos e avaliação das previsões.
Registrar limitações e dependências de dados reais; os modelos são exploratórios.

## Ambiente e publicação

Dev Vite em http://127.0.0.1:4173/, a partir do disco G, em segundo plano.
Logs em .runtime/. Não encerrar o servidor; só reiniciar se necessário e após
confirmar que o processo pertence a este projeto. Código editável em src; arquivos
novos pequenos, TypeScript no modelo e migração gradual dos módulos legados.

Gravar arquivos de forma atômica e já formatados. Uma gravação parcial já fez o
Vite reter um módulo vazio; invalidar o módulo e recarregar resolveu.
Não apagar o experimento do Chrome do usuário. O perfil IAB de QA é separado.

Seguir a skill Sites. Reabrir o source helper no HEAD atual antes de empacotar.
Credenciais apenas em memória e stdin. O tar deve ficar fora do checkout:
G:\Projetos\viveiro-VERSAO.tar.gz. A source antiga pode ser rejeitada pela
revisão automática; confirmar HEAD e remoto antes de corrigir a referência.

## Retomada seguinte

Não há processo de testes pendente. Prosseguir pela fundação orgânica;
não encerrar a automação enquanto 5B, 6, 7 e 8 tiverem implementação possível
pendente. Preservar o dev rodando e limitar pushes às refs da entrega corrente.
