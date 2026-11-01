# Continuação do Viveiro

Trabalhar em G:\Projetos\viveiro. Ler AGENTS.md e docs/cronograma.md. O usuário autorizou continuar até finalizar o cronograma, com retomada horária nesta conversa após limites. Automação continuar-cronograma-do-viveiro ativa. Não criar executores concorrentes nem contornar cotas/aprovações.

## Trabalho em andamento — 6A

Branch codex/odores-e-territorio, base codex/colonias-filhas. Versão 0.8.0 preparada, ainda NÃO publicada. Perfis químicos, campo territorial, encontros/dano/recuo, camuflagem e infiltração conservativa implementados. Dez testes novos aprovados. TypeScript/build aprovados. Suíte completa: 87 testes aprovados em 435617 ms; após o ajuste final da contagem química de vizinhas, os dez testes direcionados também passaram. TypeScript/build final aprovados. Navegador: dia 107,9 da seed a; 20 intimidações, 14 recuos, 14 ataques em duas colônias. Odor aplicado à operária #305, anel visível, primeira pessoa e retorno conferidos; console sem erros. Prova: viveiro-0.8.0-encontros.png. Dev PID 13196 no G permanece ativo.

Próximo passo imediato: coletar a suíte completa, commit/push restrito da branch, abrir PR #10 se ainda não existir com base codex/colonias-filhas, publicar 0.8.0 no Site privado pelo helper com fonte atual, tag v0.8.0 e registrar os IDs retornados. Então criar branch para 6B pulgões/melaço/proteção e lagartas miméticas. Não repetir etapas já publicadas.

## Última entrega publicada

- Branch codex/colonias-filhas, base codex/voo-e-fundacao.
- Versão 0.7.0 publicada: fonte e6e4790185fab8788cccdaf35dcc8f243e397c35, tag v0.7.0. Deploy appgdep_6ae6cbf2a92081919d188fb4cca26b47 concluído em 01/11/2026.
- PRs #1 a #9 abertos e encadeados. 5C: https://github.com/albreis/viveiro/pull/9, base codex/voo-e-fundacao. Não duplicar.
- Publicação anterior confirmada: 0.6.0, fonte 0aec356a9a9d3ef8cbce227dae5577dd9874a34d, tag v0.6.0.
- Versão 0.5.0 preservada: e149fe8944b315bbff078a4f1be7a471c3297145, tag v0.5.0.
- Site privado: https://viveiro-caos-formigueiro.everaldodev.chatgpt.site
- Projeto Site appgprj_6ae6364bc4488191b2757449ed3f7e94. Preservar acesso só do proprietário.

## Implementado na 5C

Colônias em src/modules/colonies, com habitat compartilhado e estoques, genes, prole, saúde e RNG próprios. Ambiente integrado uma vez por tick global. Sensores físicos veem vizinhas de todas as colônias; trofalaxia respeita identidade. O campo e a malha do solo são comuns, com entradas/frentes dinâmicas por proprietária.

Colônias maduras poupam alimento de forma conservativa e pagam princesas/zangões; a reserva é devolvida durante crise ou ao atingir o limite de fundações. A dupla amadurece, caminha para fora e aguarda janela após chuva. A filha usa os mesmos IDs adultos, genomas herdados e oito unidades já pagas de reserva; não há teleporte ou casal gratuito. Fundação 5B reutilizada no habitat comum. Modelo exploratório e limitações em docs/colonias-filhas.md: até quatro registros de colônia e 450 adultos/crias; dupla da mesma coorte, sem escolha de parceiros externos, sem calibração por espécie.

Correções de navegação: saída de poço raso quando centros coincidem; reconhecer um corpo já sobre a superfície mesmo se o centro lógico ficou atrás; recuperação de bloqueio também nos alados; limpar memória de acesso da antiga colônia ao fundar a filha. Migração da 0.6 reconhece o abrigo existente pelos IDs, sem escavar uma cópia.

## Validação

- Suíte completa: 76 testes aprovados em 423814 ms.
- Após os últimos ajustes de cache/limite/balanço, 19 testes direcionados de chegada, colônias, orçamento e solo passaram (16556 ms). Há um teste novo adicional de restituição da poupança no limite de colônias.
- TypeScript e build aprovados; módulos novos pequenos. A fábrica de agentes e o passo da família foram extraídos de World.
- Filha: 2248 ticks, 16 viagens, quatro naníticas, geração 2 e maior deslocamento 0,075 unidade na regressão.
- Navegador: seed a, umidade inicial 68; alados surgiram naturalmente; esperaram nova chuva após perder a primeira janela. Duas rainhas, outro abrigo e operária de geração 2 confirmados. Primeira pessoa e retorno conferidos; sem erros recentes de console.
- QA IAB local pausada no dia 105,8, umidade 80, 72 formigas em duas colônias. Operária #255 da colônia 2: mãe #103, pai #104. Deixar o dev rodando. Perfil do Chrome do usuário intocado.
- Screenshots salvos no diretório autorizado do Codex: viveiro-0.7.0-colonias-filhas.png e viveiro-0.7.0-resumo.png.

## Próximo passo concreto

A 0.7.0 está publicada e o PR #9 aberto. A 6A está em implementação na branch codex/odores-e-territorio, conforme o checkpoint acima. Depois de publicar, seguir com 6B: pulgões/melaço/proteção e lagartas miméticas. Não repetir 5A/5B/5C ou 6A.

Depois: 7 solo granular, capilaridade e gases; 8 RL, persistência longa e avaliação. Não declarar calibração científica: faltam espécie-alvo e dados reais. Os snapshots atuais ainda repetem habitat no JSON das subcolônias, embora o restore reconstitua referências comuns; compactação/armazenamento longo é etapa 8.

## Ambiente, Git e publicação

Dev em http://127.0.0.1:4173/ no G, PID 13196 na última conferência; logs .runtime/. Não encerrar. Escrita atômica e já formatada. Normalizar CRLF ao editar por scripts para que substituições de várias linhas funcionem. Evitar gravação parcial, que já fez o HMR guardar módulo vazio.

Push apenas das refs da entrega e tag específica; push --all já foi rejeitado por escopo amplo. Main permanece anterior com os PRs para revisão. Não mesclar sem instrução.

Seguir Sites: reabrir source helper no HEAD atual antes de empacotar, credenciais só em memória/stdin, tar fora do checkout (G:\Projetos\viveiro-0.7.0.tar.gz). Fonte, tag, PR e deploy da 0.7.0 já registrados acima. Nenhum processo de testes pendente.
