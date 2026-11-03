# Continuação — CodeQL corrigido; release 0.45.0 em publicação

03/11/2026. Usuário retomou explicitamente e autorizou publicação da release.
Trabalhar em G:\Projetos\viveiro; branch codex/release-p2-consolidada, PR #71.
Nenhuma tag/release criada ainda neste checkpoint. Dev4173 preservado em G.
Automação PAUSED; transferir novamente aos3% se necessário, sem contornar limites.

## Segurança resolvida

CodeQL js/xss-through-dom detectou DOM→href em src/i18n/dom.ts:39. Correção real
em d693915: registro de rotas internas, rejeição de destinos não registrados,
componentes de query/fragmento codificados e atualização só em âncoras.
18 testes dirigidos e TS/build438 módulos aprovados. QA nativa do bundle confirmou
alternância pt-BR/en e abertura da ODD inglesa. CI41710258215: todas as análises e
CodeQL SUCCESS, título "No new alerts". Sem supressão, dismissal ou regra relaxada.
Evidência validacoes/codeql-0.45.0.json. Ajuste posterior só em metadados/docs.

## Consolidação e publicação pendentes

P2.1–P2.7 técnicos concluídos. #65–#68 foram mesclados em bases intermediárias;
main ficou só em P2.4. PR #71 reúne o conteúdo completo e prepara0.45.0, pacote,
lock, changelog, licenças, CFF e .zenodo.json ANTES da tag. CFF referencia versão
por URL da tag, sem SHA autorreferente. O empacotador resolve o SHA da tag; commits
explícitos em CFF continuam sujeitos à igualdade estrita. Autoria/ORCID preservados.

Suíte completa atual (sem deposit-archive.test.mjs) executando, sessão22924:
.runtime/release-045-fixed-tests.txt. Esse único teste precisa da tag local e será
executado antes de enviar a tag. Três testes novos de segurança somam aos459 prévios.
Não alegar teste concluído antes de conferir o rodapé. Build/18 dirigidos aprovados.

1. Aguardar suíte e CI do head atual; integrar #71 sem apagar branches.
2. Atualizar main local por fast-forward. Criar tag LOCAL v0.45.0 no merge integrado.
3. Rodar node --test tests/deposit.test.mjs tests/deposit-archive.test.mjs; gerar
   espelho de teste com build-public-release.ts em .runtime, sem publicar Site antigo.
4. Enviar tag e criar UMA GitHub Release com .runtime/release-045-notes.md. CFF e
   Zenodo já atualizados; nenhum depósito manual ou versão intermediária.
5. Conferir pages.yml: tag grava site-publico, que dispara deploy na main. Verificar
   https://viveiro.ersolucoesweb.com.br/releases/v0.45.0/ no navegador e registrar.
6. Usuário pediu revisar/apagar #70 se redundante: é redundante, head5e5f39e já é
   ancestral de #71. Fechar #70 após integrar #71, se GitHub não o fechar sozinho.
   Preservar a branch codex/editor-perfis. Não alterar #69/trabalho do usuário.
7. Atualizar cronograma/checkpoint/recibos e Site privado owner-only se necessário.

O conector GitHub lê mas não pode escrever (403); gh configurado funciona.
Última tag públicav0.41.0. P2.8/P5 descartados. Calibração, revisão docente e
outros aceites externos P1/P3 continuam abertos. Saves e privacidade preservados.
