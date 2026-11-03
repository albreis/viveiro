# Continuação do Viveiro — transferência manual

Atualizado em 02/11/2026, horário local. Trabalhar em G:\Projetos\viveiro.
Ler AGENTS.md e docs/cronograma.md; conferir Git/PRs antes de alterar arquivos.

## Estado de transferência

O desenvolvimento desta execução foi encerrado no critério de limite solicitado
pelo usuário. O usuário continuará manualmente. Não retomar automaticamente
após reset sem novo pedido explícito. Automação continuar-cronograma-do-viveiro
está PAUSED; o prompt já registra essa orientação. Não consumir resets nem
contornar limites. A janela deve ser consultada por get_usage_limits quando
houver novo pedido; não publicar dados privados da conta no repositório.

Branch atual: codex/internacionalizacao, upstream origin/codex/internacionalizacao.
PR de rascunho: https://github.com/albreis/viveiro/pull/68, base codex/editor-perfis.
Último commit de código desta base: 1d83c4f; o commit de transferência é posterior.
Código, evidências e checkpoint enviados ao GitHub. Logs em .runtime/ são locais;
os inventários podem ser regenerados pelos comandos abaixo.

Dev http://127.0.0.1:4173/ continua em G, PID17752 na última conferência. Não parar.
O preview 4189 foi usado apenas para QA; não depende dele para continuar.
Preservar branches, tags, saves, IndexedDB e privacidade do Site original.

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

A pedido do usuário, internacionalização fica em src/i18n, em arquivos pequenos:

- locales/pt-BR e locales/en: common.json e experiments.json, 32 mensagens por idioma.
- catalogs.ts: registro de idiomas e tipos derivados; core.ts: interpolação pura.
- controller.ts: estado de idioma, assinaturas e números de apresentação.
- browser.ts: preferência viveiro.locale.v1 e query lang, sem reload ou acesso a saves.
- validation.ts: paridade de chaves/variáveis e rejeição de mensagens vazias.
- README.md: como adicionar catálogos/idiomas e continuar a integração.

Validação desta base: seis testes de i18n e TypeScript estrito; build Vite com
checagem de traduções. A suíte completa anterior tem 444 testes do P2.6; não
atribuir uma execução completa de 450 testes à base atual. A interface ainda
não usa o controlador e a documentação ainda não foi traduzida. Não marcar
P2.7 como entregue, não liberar o rascunho como concluído e não criar tag.

Comandos úteis:

```sh
npm run i18n:check
npm run i18n:inventory
npm run i18n:inventory -- --json
node --test tests/i18n.test.mjs tests/i18n-controller.test.mjs
npm run build
```

Inventário heurístico atual: 902 candidatos em 100 arquivos; também encontra
falsos positivos e não mede cobertura. Saída local .runtime/i18n-inventory.json.

## Próximo passo concreto

1. Conectar um controlador compartilhado e seletor de idioma em src/main.ts e
   src/app/experiment-page.ts; manter português como padrão e trocar idioma
   sem recriar o World, recarregar a página ou perder entradas do usuário.
2. Usar primeiro as 32 mensagens já preparadas no laboratório de experimentos;
   migrar HTML/aria-labels/estados, perfis e varreduras para catálogos por área.
   Depois cobrir index.html, demais controles, tour, diálogos, erros e gráficos.
3. Traduzir na apresentação os eventos/estados e metadados do modelo. Preservar
   IDs, seeds, valores científicos, CSV, snapshots e textos escritos pelo usuário.
   Evitar que o idioma da UI altere mensagens persistidas ou decisões do modelo.
4. Traduzir documentação pública modelo/ensino e licenças; integrar as versões
   e links nos geradores scripts/lib/model-doc-pages.ts e teaching-pages.ts.
5. Verificar todas as telas nos dois idiomas com Cua, inclusive acessibilidade,
   dados do usuário e Workers. Rodar testes de paridade, suíte completa e build.
   Atualizar o PR #68, cronograma e evidências só após os aceites reais.

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
