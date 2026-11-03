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

## P2.7 em andamento — ainda não concluído

src/i18n tem 466 mensagens por idioma em catálogos por área, seletor nas duas
páginas, bindings explícitos e fallback português no Vite. Troca sem reload nem
recriar forms. Laboratório isolado/perfis/varreduras, texto estático do terrário,
câmera, indicadores centrais, fundação, linhagem e gráficos migrados.

QA real: 300 ticks, CSV/manifesto idênticos no dev pt-BR, dev en e CLI. Brutos em
public/experimentos/i18n-p27; docs/validacoes/i18n-lab-parcial.json. Nome editado,
valor 67.5 e editor aberto preservados. Erros limpos não voltam ao trocar idioma.
15 testes dirigidos aprovados (9 i18n + 6 acessibilidade), TS/build aprovados.
Suíte completa anterior: 444 do P2.6; ainda não repetida nesta base.

## Próximo passo concreto

1. Migrar painéis especializados: clima/gases, ecologia/química, estrutura,
   granular, estoques, fertilidade, saúde, estações/desenvolvimento, biologia.
2. Tempo/desempenho/offline, previsão/checkpoints, ensino e tour ainda pendentes.
3. Traduzir estados/eventos/metadados do modelo somente na apresentação. Preservar
   IDs, seeds, dados científicos, saves, nomes e outros textos do usuário.
4. Traduzir documentos públicos/licenças e integrar os geradores de páginas.
5. QA nativa nos dois idiomas, responsivo/Workers/exportação, suíte completa/build.
   Atualizar PR/cronograma e publicar no mesmo privado após validação. Sem tag
   enquanto P2.7 não cumprir todos os aceites.

Comandos: npm run i18n:check; npm run i18n:inventory;
node --test tests/i18n*.test.mjs; npm run build.
Inventário é heurístico, não cobertura. Logs .runtime são locais/ignorados.

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
