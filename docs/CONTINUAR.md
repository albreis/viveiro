# Continuação do Viveiro — P2.7 retomado

Atualizado em 02/11/2026, horário local. Trabalhar em G:\Projetos\viveiro.
Ler AGENTS.md e docs/cronograma.md; conferir Git/PRs antes de alterar arquivos.

## Estado atual — 03/11/2026

Retomado por pedido explícito na branch codex/internacionalizacao. Automação
continua PAUSED para evitar executor concorrente. Ao restarem 3% na janela de
5h, enviar tudo ao GitHub, atualizar checkpoint e parar para continuação manual.
Não retomar após reset sem novo pedido explícito nem publicar dados da conta.

PR #68 permanece rascunho, base codex/editor-perfis. Fetch conferido: origin/main
não tem novidades desde a base. Branch remota do usuário claude/project-thread-kazijj,
PR #69 de escavação, preservada sem integrar nesta entrega.

Dev http://127.0.0.1:4173/ reiniciado em G (PID15348). Não parar. QA pausou a cena
existente SEMENTE-42911 em torno de D11,3; não restaurar estados históricos sobre
o trabalho recente do usuário. Preservar branches, tags, saves e privacidade.

## Entregas concluídas nesta sequência

- P2.4: PR #65 contra main, codex/sensibilidade-morris, 0.42.0 de desenvolvimento.
  432/432 testes, 104 simulações reais Morris, dados brutos e limites honestos.
  Fonte privada publicada 7b3b4f9; recibo validacoes/deploy-p2.4-dev.json.
- P2.5: PR #66 sobre #65, codex/extensoes-tipadas, 0.43.0 de desenvolvimento.
  438/438 testes, API local tipada, política nova em um arquivo e comparação
  real com ACO. CSV/manifesto iguais no bundle e CLI; fonte privada f4f9a39.
  Recibo validacoes/deploy-p2.5-dev.json; dados public/experimentos/policies-043.
- P2.6: PR #67 sobre #66, codex/editor-perfis, 0.44.0 de desenvolvimento.
  444/444 testes, editor de 12 entradas com unidade/faixa/fonte, versões locais
  imutáveis, exportação/reimportação e aplicação à varredura. CSV/manifesto
  iguais na CLI, dev antes/depois da importação e bundle compilado (300 ticks).
  Fonte privada ec7fc47; recibo validacoes/deploy-p2.6-dev.json. Dados brutos
  public/experimentos/profile-044 e evidência validacoes/perfis-0.44.0.json.

Os PRs estavam abertos e encadeados na conferência de transferência; não duplicar.
Preservar ACO padrão, paridade portátil e trajetória nativa. Os modelos e as
faixas são exploratórios, sem calibração por espécie.

## P2.7 — implementação e validação concluídas, publicação pendente

1.192 mensagens por idioma, módulos/JSONs de i18n menores que 250 linhas.
Interface completa, 100 parâmetros, 7 aulas, tour e texturas da cena traduzidos.
Documentos públicos: 13 do modelo + 9 fontes de ensino em inglês; rotas en/modelo,
en/ensino e licenças, alternância na mesma página e fontes para baixar. README.en.
IDs, arquivos científicos e nomes do usuário permanecem canônicos.

459/459 testes completos; após o ajuste final do link de licença, 30/30 dirigidos
(incluindo builds público/privado e todos os hashes offline), TS e build aprovados.
Bundle com 436 módulos. QA nativa do bundle: 300 ticks, CSV/manifesto idênticos à
CLI/dev; locale conserva resultados e inputs. Tela 320px: largura de documento
305px no laboratório e no terrário; pausa em D0,6 preservada. Dados/evidências:
public/experimentos/i18n-p27 e validacoes/i18n-p27.json. O evento de download de
texto estático expirou no IAB; links/fontes conferidos em testes. CSV/JSON reais
baixados com sucesso. Sem alegar aprovação externa ou calibração.

O usuário mudou o terrário dev durante o trabalho: agora há uma aula de herança
AULA-v2-heranca em andamento. Não restaurar SEMENTE-42911 ou checkpoints antigos
sobre ele. QA compilada usou outra origem (4189), preservando o dev em 4173.
Fetch recente preservou novas mudanças remotas em claude/project-thread-kazijj.
Não integrar nem sobrescrever o trabalho dessa outra branch.

## Próximo passo concreto

1. Terminar QA nativa do pacote público com base /releases/v0.44.0/ e guias em
   inglês no cache; servidor temporário 4190, PID25456. Dev4173 segue ativo.
2. Publicar o commit validado no mesmo Site privado owner-only, registrar recibo.
3. Atualizar P2.7 no cronograma e PR #68 para pronto. Revisar TODOS os P2 ativos
   conforme pedido novo: P2.1–P2.6 já têm mecanismos/evidências; P2.8 descartado.
4. Reconciliar a integração dos PRs encadeados #65 → #66 → #67 → #68. Não criar
   tag em branch parcial nem duplicar PR. Uma única release consolidada após a
   integração e preparação dos metadados CFF/Zenodo; nenhuma publicação manual.

## Política de publicação

Nenhuma nova tag ou GitHub Release até TODOS os P2 ativos terminarem. O público
é GitHub Pages em https://viveiro.ersolucoesweb.com.br/; não atualizar o antigo
Site público do ChatGPT. Última tag pública desta sequência: v0.41.0. O original
owner-private está na entrega P2.6, com audiência custom/rev1/um proprietário.

GitHub está ligado automaticamente ao Zenodo. Não criar depósitos manuais,
duplicados ou versões intermediárias. CFF/.zenodo ainda referenciam a 0.41.0:
alinhar metadados antes da única próxima publicação consolidada. Autoria e ORCID
confirmados devem ser preservados. DOI 10.5281/zenodo.23891981 pertence à 0.36.0,
não à versão atual. Preservar todas as tags existentes.

P2.8 e P5 foram descartados, não são pendências. Aceites externos P1/P3 continuam
abertos; não inventar dados, pareceres ou calibração. PageSpeed recebeu cota 429:
não repetir antes de 2026-11-03T15:16:57 UTC nem contornar a restrição.
