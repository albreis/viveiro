# Continuação — quatro entregas autorizadas após P2

03/11/2026. Trabalhar em G:\Projetos\viveiro. Ler AGENTS.md/cronograma.md e
conferir Git/PRs antes de agir. Preservar saves, branches e tags.

## Concluído

P2.1–P2.7 publicados na v0.45.0, fonte f433f80. P2.8 e P5 descartados.
Correção CodeQL d693915 incluída, sem suprimir regra. PR70 marcado MERGED
pelo GitHub após71. PR69 é trabalho do usuário: preservar.

- Comunidade: PR76 integrado; CONTRIBUTING pt/en, formulários, Discussions,
  tarefas73–75. P4.1A feito; primeira contribuição externa ainda necessária.
- Galeria: PR77, dez receitas da equipe, filtros, idiomas, planos versionados e
  abertura isolada. 25 testes, build446 módulos, QA320px e paridade CSV/manifesto
  em300ticks CLI/Worker. Recibos validacoes/galeria-0.46.0.json e
  deploy-galeria-0.46.0.json. Site privado original atualizado, owner-only mantido.
  P4.2A feito; dez contribuições externas reais ainda necessárias para20receitas.

## Próximos passos concretos

1. PR77 integrado. Galeria já publicada no privado, sem nova tag.
2. PR78 integrado e correção publicada no privado. Branch codex/auditoria-interface: auditoria nativa concluída e contraste A/B corrigido.27testes/build aprovados. Publicar correção e integrar PR antes de migrar. A checagem cobriu nomes,
   contraste, teclado, reflow e desempenho real em movimento no preview4189;
   corrigir problemas encontrados. Tentativa oficial PageSpeed em03/11 21:53UTC
   recebeu429, nenhuma nota. Não repetir antes de04/11 21:53:59UTC nem contornar
   a cota. Medição local não substitui Lighthouse, leitor de tela ou hardware escolar.
3. Migrar13JS legados da UI/renderer para TypeScript estrito, separando controller
   (665linhas) e scene(319linhas) em módulos focados. Sem any amplo/ts-nocheck.
   Branch(es), testes, navegador, commit/push/PR e Site privado por entrega.
4. Revisão final; uma próxima versão pública consolidada, sem tags intermediárias
   ou depósitos manuais. Preparar CFF/Zenodo antes da tag final. DOI automático
   0.45.0 ainda por conferir; DOI23891981 pertence apenas à0.36.0.

Dev4173 PID15348 em G deve continuar ativo. Preview4189 serve dist para QA isolada.
Não restaurar snapshots de teste sobre o terrário atual do usuário.
Site privado original appgprj_6ae6364bc4488191b2757449ed3f7e94 preservado.
Público em https://viveiro.ersolucoesweb.com.br/; não atualizar Site público antigo.
Pacote0.46.0 é desenvolvimento sem tag. Automação permanece PAUSED, sem executor
concorrente. Ao restarem3% da cota real de5h, push/checkpoint e parar para o usuário.

Pendências externas não podem ser inventadas: dados/licença/parceria, calibração,
pilotos/docentes/participantes, contribuição externa e medições de serviços/hardware.


## Migração em curso

codex/renderer-typescript migrou10JS do renderer, com scene-core/scene-input/
scene-dispose e contratos RenderWorld/RenderAgent. Cena208linhas, núcleo162,
LandscapeView198. Build estrito aprovado;3 regressões novas e2 Morris aprovados.
QA nativa em4189: vista lateral alternada, primeira pessoa/setas/saída com foco,
sem erro de console. Suíte completa em.runtime/renderer-suite.txt ainda rodando;
Morris teve CRLF em104manifestos recuperados pelos hashes publicados e atributo
-text adicionado; segunda falha foi mudança da fonte durante a rodada, corrigida
reexecutando com fonte estável. Não voltar a editar módulos durante teste Morris.
Próxima etapa: concluir UI(controller/chart/status) em branch própria e depois
revisar suíte/privado/PRs. Sem nova tag intermediária.
