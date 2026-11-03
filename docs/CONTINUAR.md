# Continuação — P2 técnicos concluídos; integração pública pendente

Atualizado em 03/11/2026. Trabalhar em G:\Projetos\viveiro. Ler AGENTS.md,
docs/cronograma.md e docs/revisao-p2.md. Conferir Git/PRs antes de agir.

## Estado preservado

Branch codex/internacionalizacao, PR #68 sobre codex/editor-perfis (#67).
P2.7 está implementado, testado e publicado no mesmo Site privado. Fonte da
publicação: 7a24fd9720323cbe7f12f7b8f7175d78f2e8a7b7; recibo em
validacoes/deploy-p2.7-dev.json. Commits posteriores apenas atualizam evidências.
Audiência custom/revisão 1/um proprietário preservada. Público antigo não alterado.

Dev http://127.0.0.1:4173/ ativo em G, PID 15348 conferido. Não encerrar.
Preview 4189 pode servir dist. Servidor temporário 4190 foi desligado para QA
offline e deve permanecer parado. Logs e pacotes locais não entram no Git.

O usuário mudou a cena dev durante o trabalho para AULA-v2-heranca. Não restaurar
SEMENTE-42911, SEMENTE-50088 ou checkpoints históricos sobre o estado atual.
A QA do bundle usou origem 4189 e a de offline 4190; saves do dev preservados.
Fetch preservou atualizações de claude/project-thread-kazijj (PR #69). Não mexer
nessa branch nem incorporar seus commits nesta etapa.

## P2.7 entregue

- 1.192 mensagens por idioma pt-BR/en; catálogos, TS e JSONs menores que 250 linhas.
- Interface 3D, laboratório, painéis, 100 parâmetros, 7 aulas e tour traduzidos.
- 13 documentos do modelo e 9 fontes de ensino em inglês, licenças, README.en;
  rotas/links por idioma, alternância na mesma página e nomes de download claros.
- 459/459 testes completos, 30 dirigidos após revisão e 16 do ajuste de downloads.
  TS estrito, Vite 436 módulos e builds público/privado aprovados.
- Bundle 300 ticks: CSV/manifesto iguais à CLI/dev; locale conserva resultados,
  inputs e pausa. Tela 320 px: documento 305 px no laboratório e no terrário.
- Cache 557 arquivos: guia inglês e troca pt-BR/en funcionaram com servidor parado.
- QA do Site privado confirmou laboratório/ODD ingleses e atributo de download
  da fonte final. O evento de texto estático expirou no IAB; fonte abre direto e
  bytes/links passaram nos testes. CSV/manifesto reais baixados e comparados.
- Evidências: validacoes/i18n-p27.json; dados: public/experimentos/i18n-p27.
  Nomes do usuário, protocolo/RNG, números científicos e dados canônicos intactos.

## Todos os P2 ativos revisados

P2.1–P2.3 já estão na main e foram publicados. P2.4–P2.7 têm mecanismos/evidências
concluídos e publicação privada. Não existe outro mecanismo P2 ativo pendente.
Ver docs/revisao-p2.md para critérios, limites e integração ainda necessária.

Os PRs permaneciam abertos, em ordem: #65 → main; #66 → #65; #67 → #66;
#68 → #67. Não duplicar PRs, apagar branches ou reescrever tags. #68 já está
pronto para revisão, com título e descrição finais. Preservar revisão do usuário.

Próxima ação concreta de integração: conferir CI/revisões de #65; integrá-lo e
retargetear #66 para main, repetindo em ordem até #68. Conferir mudanças remotas
antes e resolver conflitos sem perder o trabalho do usuário. Depois executar
checks da main integrada e preparar a única versão pública consolidada.

## Política de publicação e limites

Público: https://viveiro.ersolucoesweb.com.br/ (GitHub Pages). A última tag pública
é v0.41.0. Versão 0.44.0 na branch/privado é de desenvolvimento, sem tag/release.
Não criar tag em branch parcial. Preparar pacote/changelog/CFF/.zenodo.json antes
da tag final; preservar autoria/ORCID confirmados. DOI 10.5281/zenodo.23891981 é da
0.36.0, não da versão nova. GitHub/Zenodo estão integrados automaticamente: nunca
criar depósito manual, duplicado ou versões intermediárias. Não atualizar o
antigo Site público do ChatGPT. Manter o original privado owner-only.

P2.8 e P5 foram descartados. P1/P3 dependem de pessoas/dados reais: hardware
escolar, participantes, professores, planilha/leitor de tela/Lighthouse, pilotos,
calibração e validação externa. Não inventar resultados ou declarar ciência
calibrada. Não repetir PageSpeed enquanto a cota estiver bloqueada.

Automação continuar-cronograma-do-viveiro permanece PAUSED, sem executor paralelo.
O usuário retomou esta entrega explicitamente. Ao restarem 3% na janela real de 5h,
enviar tudo ao GitHub, atualizar este arquivo e parar para continuação manual.
Não contornar limites nem retomar após reset sem novo pedido explícito.
