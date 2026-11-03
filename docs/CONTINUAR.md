# Transferência manual — release 0.45.0 preparada, NÃO publicada

03/11/2026. Parada solicitada pelo usuário quando restarem 3% da janela de 5h;
a consulta já retornou 2%. Progresso commitado/enviado. Não retomar automaticamente
após reset sem novo pedido explícito. Automação permanece PAUSED.

## Estado exato

Trabalhar em G:\Projetos\viveiro, branch codex/release-p2-consolidada.
PR https://github.com/albreis/viveiro/pull/71 aberto contra main.
Usuário autorizou publicar a release única. Nenhuma tag v0.45.0, GitHub Release
ou depósito Zenodo foi criado. NÃO anunciar como publicada.

O usuário mesclou #65–#68, mas nas bases encadeadas. origin/main ficou em
f09fc4f (só P2.4), origin/codex/editor-perfis contém o merge final 5e5f39e (#68).
A branch de release partiu de origin/main e mesclou origin/codex/editor-perfis
sem conflitos, com árvore idêntica à branch completa. Preserva todos os merges,
branches/tags e o trabalho separado em claude/project-thread-kazijj (#69/#70).

Commits desta branch:
- Consolidação dos P2.4–P2.7 em merge próprio, sem alteração funcional.
- 794848d872c72bfb67c1dd41c4e628dbe6853993: pacote/lock/licenças/changelog 0.45.0.
- 1fe6f05: CFF/Zenodo preparados ANTES da tag; suporte a CFF sem commit explícito.
  CFF usa versão/URL da tag, evitando hash autorreferente. O empacotador resolve
  SHA pela tag; se CFF traz commit explícito, continua exigindo igualdade exata.
  Testes rejeitam SHA inválido. Autoria/ORCID preservados; DOI antigo não reutilizado.

## Validação e bloqueios antes de publicar

Build estrito/Vite aprovado: .runtime/release-045-build.txt.
Três testes de metadados aprovados: .runtime/release-045-metadata-tests.txt.
QA nativa compilada em 4189 confirmou "Viveiro 0.45.0" e laboratório em inglês.
A suíte completa da consolidação AINDA estava executando, sessão 33114:
.runtime/release-045-tests.txt. Conferir o rodapé real antes de alegar resultado.
Suíte anterior do P2.7 passou 459/459, sem mudança nas regras biológicas agora.

O teste real de depósito foi tentado antes da tag e falhou porque v0.45.0 não
existe. A tag local pode ser criada APÓS validar/integrar o PR, sem enviar ainda;
rodar node --test tests/deposit.test.mjs tests/deposit-archive.test.mjs antes do
push da tag. Não criar tag temporária nem reescrever tags. Não fazer depósito
manual: GitHub/Zenodo integrados automaticamente.

CI PR #71: Analyze(actions) e Analyze(javascript-typescript) passaram; check CodeQL
falhou. Detalhes em .runtime/release-045-codeql.json e Actions 41707958532.
Investigar/corrigir essa falha antes do merge/publicação; não ignorar proteção.

## Próximos passos concretos

1. Ler logs da suíte e CodeQL, resolver pendências e atualizar o PR #71. Preservar
   o dev 4173 e saves do usuário. Publicação já autorizada, não pedir outra vez.
2. Integrar #71 na main após validação. Atualizar main local sem perder branches.
3. Criar tag local v0.45.0 no commit integrado; conferir pacote 0.45.0, CFF/Zenodo
   e rodar o teste do pacote real. Só então enviar a tag e criar UMA GitHub Release
   com notas P2.4–P2.7. gh release create --verify-tag ... --notes-file ... .
4. A tag dispara pages.yml: grava site-publico e dispara deploy pela main, como
   exige a proteção github-pages. Acompanhar até sucesso e conferir
   https://viveiro.ersolucoesweb.com.br/releases/v0.45.0/ no navegador.
5. Integração Zenodo automática: não duplicar depósito. Registrar DOI só se real.
   Atualizar cronograma/recibos após sucesso; manter Site privado owner-only.

GitHub connector lê mas nega escrita com 403 Resource not accessible by integration.
gh já configurado funciona e foi usado para criar o PR. Não expor credenciais.
Dev 4173 ativo em G; preview 4189 serve dist 0.45.0. Não reiniciar/resetar o terrário
atual. Site privado está no P2.7 publicado (fonte 7a24fd9), versão de desenvolvimento
0.44.0, sem mudanças na audiência. P2.8 e P5 descartados; P1/P3 externos abertos.
