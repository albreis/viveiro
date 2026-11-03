# Continuação — release 0.45.0 publicada; P2 encerrado

03/11/2026. Trabalhar em G:\Projetos\viveiro. Ler AGENTS.md e cronograma.md;
conferir Git/PRs antes de qualquer alteração. Não repetir entregas concluídas.

## Publicação concluída

P2.1–P2.7 implementados e publicados. #65–#68 foram consolidados pelo #71;
merge e tag v0.45.0: f433f805444d762d301f8babc365a83930982272. O #70 foi marcado
MERGED automaticamente pelo GitHub ao integrar o #71. Não apagar suas branches.

Release https://github.com/albreis/viveiro/releases/tag/v0.45.0 publicada.
GitHub Pages https://viveiro.ersolucoesweb.com.br/releases/v0.45.0/ conferido.
Workflows 41711790692(tag) e 41712001832(main) concluídos com sucesso, preservando
as proteções do ambiente. Não reescrever tags nem criar release intermediária.

Site privado original também atualizado, fonte f433f80, audiência custom/revisão 1/
um proprietário mantida. Recibo validacoes/release-0.45.0.json. O Site público
antigo do ChatGPT não foi alterado. A versão pública usa GitHub Pages.

## Segurança e dados

CodeQL alto js/xss-through-dom em src/i18n/dom.ts foi corrigido em d693915.
Links da tradução usam registro de rotas internas, componentes codificados e
atualização só em âncoras. CI 41710258215 e 41711103434 verdes, sem suprimir regra.
Evidência validacoes/codeql-0.45.0.json; fonte final inclui essa correção.

461 testes da integração + 1 teste do pacote real após a tag local = 462 únicos
aprovados. 18 dirigidos; TS estrito/build 438 módulos e público versionado aprovados.
QA pública executou 300 ticks no Worker; CSV/manifesto iguais à CLI 0.45.0, preservados
em tests/fixtures/release-045. Logs em .runtime/release-045-*.txt, ignorados no Git.

CFF/Zenodo preparados antes da tag, autoria/ORCID preservados. A integração
GitHub–Zenodo é automática; nenhum depósito manual/duplicado foi criado. Falta
conferir DOI 0.45.0 e botão de citação (P0.4). DOI 10.5281/zenodo.23891981 é 0.36.0;
não reutilizar para a versão nova nem inventar DOI. CFF sem commit explícito usa
a tag imutável para resolver a fonte; commits explícitos ainda exigem igualdade.

## Estado de trabalho e próximo escopo

Registro pós-publicação em codex/registro-release-0-45-0, separado da tag.
Dev http://127.0.0.1:4173/ ativo em G (PID 15348 conferido durante a entrega).
Preview 4189 serve dist 0.45.0. Servidor temporário 4190 permanece desligado.
Não reiniciar, sobrescrever ou restaurar saves históricos sobre o terrário atual.
Preservar #69/claude/project-thread-kazijj e outros trabalhos do usuário.

Não há mecanismo P2 ativo restante. Cronograma ainda tem:
- Migração gradual da UI e do renderer legados para TypeScript.
- P0.4: conferência da citação e DOI automático da release consolidada.
- P1: ensaios reais de desempenho/tour, revisão docente, acessibilidade e pilotos.
- P3: parceria/dados licenciados, calibração, validação reservada e publicação.
- P4: contribuição externa, galeria pública 20 experimentos (10 externos) e oficinas.
- Dependências materiais/espécie e longevidade ainda sem calibração externa.

P2.8 e P5 descartados. Não retomar sem pedido explícito. Não apresentar modelos
exploratórios como calibrados ou inventar resultados/participantes/contribuições.

Automação continuar-cronograma-do-viveiro segue PAUSED para evitar concorrência.
Retomar apenas conforme novo pedido do usuário. Ao restarem 3% da janela real de 5h,
enviar tudo ao GitHub, atualizar checkpoint e parar para transferência manual;
não contornar limites. A execução foi retomada explicitamente nesta entrega.
