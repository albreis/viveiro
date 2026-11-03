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

## P2.7 em andamento — interface migrada, documentos pendentes

src/i18n tem 1.131 mensagens por idioma, registradas em index.ts de cada locale.
Seletor compartilhado sem reload, bindings explícitos, lookup de mensagens
canônicas só na apresentação e fallback português. Templates HTML em fragmentos
src/templates (maior ~150 linhas). Experimentos/perfis/varreduras, tela 3D,
painéis especializados, catálogo com 100 parâmetros, 7 aulas e tour migrados.

Validação atual: 25 testes dirigidos de i18n/acessibilidade/tour, TS estrito e
build Vite aprovados. QA nativa dev nos dois idiomas preservou seed em edição,
nome de checkpoint, perfil/grupo consultado e estado pausado D11,3. Tour mudou
idioma sem perder passo e entrou realmente em primeira pessoa. Evidência
parcial docs/validacoes/i18n-ui-parcial.json. Não alegar suíte completa atual.

QA científica anterior nesta mesma etapa: 300 ticks, CSV/manifesto idênticos em
dev pt-BR, dev en e CLI; public/experimentos/i18n-p27 e evidência lab-parcial.
.gitattributes preserva todos os bytes desses arquivos; testes conferem hashes.
Mensagens/estados do modelo e nomes escritos pelo usuário continuam canônicos;
somente a UI os apresenta traduzidos. Nenhuma regra de física/IA foi alterada.

## Próximo passo concreto

1. Tradução integral de 13 documentos públicos do modelo + 9 arquivos de ensino
   e página de licenças, em src/i18n/locales/en; preservar fontes portuguesas.
2. Integrar rotas en/modelo e en/ensino nos geradores, alternância de idioma e
   navegação/links/downloads corretos, incluindo subdiretórios do Pages e offline.
3. Rever mensagens restantes de serviços/erros, códigos de protocolo e dados do
   usuário; inventário é heurístico, não prova cobertura. Verificar tamanho de módulos.
4. QA nativa responsiva e bundle compilado em ambos os idiomas, salvar evidências;
   suíte completa/paridade/builds público e privado. Só então concluir P2.7/PR #68.
5. Publicar no mesmo Site privado. Uma única tag consolidada apenas depois de
   todos os P2 ativos concluírem e dos metadados CFF/Zenodo alinhados previamente.

Comandos: npm run i18n:check; npm run i18n:inventory;
node --test tests/i18n*.test.mjs; npm run build. Logs locais em .runtime ignorado.

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
