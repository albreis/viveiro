# Continuação do Viveiro

Atualizado em 02/11/2026, após publicar P1.6A /0.36.0.
Ler AGENTS.md e docs/cronograma.md. Trabalhar em G:\Projetos\viveiro.
Manter dev4173 em G, sem executor concorrente; preservar saves, tags e privacidade.

## Git e entrega atual

Branch codex/csv-diario; PR https://github.com/albreis/viveiro/pull/48
sobre codex/pwa-offline/#47. PRs32–48 ainda encadeados na última conferência;
main15781d2. Conferir novos merges antes de agir; não duplicar ou integrar sem
considerar a ordem. Cada nova entrega deve ter branch codex/ própria.

Fonte/tag v0.36.0:0e156836bd94aaa6a408017f597b11447f065a73.
Metadados/checkpoint posteriores à tag; não retag ou recriar a mesma release.
Todas as tags e arquivos anteriores ficam preservados. A0.35.2 contém o PWA
completo;0.35.0 e0.35.1 são previews apenas no Git, não publicados na galeria
(a configuração Vite não tinha sido incluída naqueles commits).

## P1.6A / CSV diário entregue

Módulos pequenos src/modules/observations, app/daily-controls.ts e daily.css.
Observador após tick completo, dia a cada100 ticks e estado inicial no tick0.
Totais da família, estágios reais da prole, reserva+fundo reprodutivo, ar de
referência, média da grade do solo e gases ponderados pelo volume. Sem grade,
leitura vazia; sem RNG, inicialização física ou avanço ao ler/exportar.
Série opcional v1 persistida e validada. Saves antigos não ganham passado falso.
Retém12.000 amostras por cenário com início/descartes explícitos.
CSV22 colunas, UTF-8/BOM, vírgula/CRLF/ponto decimal, A/B, versões, seed/aula,
estado inicial/fechamento diário/amostra atual. Texto protegido de fórmulas.
Tabela sob o terrário: caption, cabeçalhos, região rotulada, Tab/setas/Enter.
Isso não certifica WCAG da aplicação inteira.

365/365 testes completos em207.575,6947ms. Após ajustes apenas visuais/watch,
41/41 dirigidos finais em3.489,8603ms e build TS estrito/342 módulos.
QA IAB/4187 isolado: AULA-v2-entradas-ar, tick100, duas amostras por cenário;
download via Enter, CSV real lido por Python (quatro linhas/22 colunas), reload,
foco daily-table/rolagem por teclado, console limpo.
Arquivo baixado em C:\Users\conta\Downloads\viveiro-diario-AULA-v2-entradas-ar.csv,
SHA256be603c33805fa95ea6a74719e46a819eb65664569e71e4a29974e976edf2cad6.
Ainda NÃO foi aberto em aplicação de planilha. Não alegar Lighthouse/WCAGAA.
Ver docs/csv-diario.md e validacoes/csv-0.36.0.json.

## Sites publicados

Privado original: https://viveiro-caos-formigueiro.everaldodev.chatgpt.site/
Projeto appgprj_6ae6364bc4488191b2757449ed3f7e94, custom/revisão1,
proprietário único, zero visitantes externos, ID/static dist preservados.
Deploy appgdep_6ae8a08188948191b907528d3dc4a35b, succeeded14:39:12UTC.
Arquivo G:\Projetos\viveiro-0.36.0.tar.gz preservado.

Público: https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/
Projeto appgprj_6ae80cd45fdc8191be8315696a383393, public/revisão2.
Espelho G:\Projetos\viveiro-publico, fonte bcdb5a613f201590c2de4bcd509b33992a25caf2.
Deploy appgdep_6ae8a0a20378819187f8792e188b1360, succeeded14:39:44UTC,
versão7, arquivo G:\Projetos\viveiro-publico-0.36.0.tar.gz,
178 arquivos/11.079.680bytes. Galeria acrescentou0.36.0 mantendo as anteriores.
HTTP sem cookies/Authorization: páginas200,27 arquivos nãoHTML com hashes exatos.
QA real: SEMENTE-42/D2,64 pausada preservada, zero dias históricos e uma amostra
atual; console limpo. Não iniciar outra save/deploy desta versão concluída.
IDs/hashes completos: validacoes/deploy-0.36.0.json e publicacao-0.36.0.json.
Nunca mudar a audiência privada nem reutilizar sua identidade no espelho público.

PWA público mantém escopo por release,34 arquivos, cache íntegro, remoção sem
apagar saves e ausência de skipWaiting. Privado/dev sem worker/manifesto.
QA offline com servidor indisponível e redirects foi concluída na0.35.2.
Cache público da0.35.2 ficou preparado; da0.36.0 não foi preparado nesta QA.
Não é necessário repetir a entrega offline. Ver docs/pwa-offline.md.

## Citação e pacote local

CFF/.zenodo.json apontam a tag0.36.0 real, autoria coletiva mantida.
Esquema oficial validado e PythonZIP conferiu membros/hashes/configuração Vite.
.runtime/deposits/deposit-WhwuRb/viveiro-v0.36.0-source.zip,
512 arquivos/1.445.248bytes, SHA256
03c497454a51e4d5aad6297490288d8e05b58b84575ad3fc2824f5145f1a67b2.
Quatro testes do depósito aprovados; nenhum DOI/upload. Fonte da tag e metadados
posteriores, nove textos públicos de ensino incluídos para o build. Operacionais,
saves e credenciais excluídos; detector preservado.
Conta/autoria perguntadas antes, sem resposta; não inferir nome/ORCID ou pedir
token. P0.4B/C continuam externos/merge. Ver citacao-e-deposito.md.

## Ambiente e limpeza

Dev PID17752, G/4173, HTTP200. Aba IAB20 marcada como entrega, SEMENTE-50088,
D62,5/14 adultos em pausa e perfil leve preservados. Ao observar só HTML inicial,
aguardar a inicialização/release-label antes de concluir que o estado mudou.
Vite agora ignora .runtime e .sites-runtime; artefatos dos testes provocavam
recargas. Probe .runtime/csv-watch-check.html não gerou reload após esse ajuste.
Saves existentes não foram apagados; manual-2e91b636-785f-4f66-bb84-ff832aa62547
continua preservado. Abas antigas4/16 em erro não devem ser reutilizadas.
Preview4187 (session31123) encerrado por PID/linha de comando verificados,
abas23/24 de QA fechadas. Testes/helpers/HTTP terminaram. Dev nunca encerrado.
Capturas viveiro-0.36.0-csv-diario.png e viveiro-0.36.0-csv-publicado.png no
diretório de visualizações autorizado. Não usar npmci com dev aberto sem
necessidade (DLL nativa pode ficar bloqueada). JSON/config por escrita atômica.

## Próximo passo concreto: P1.6B / acessibilidade

1. Conferir Git/PRs; criar nova branch codex/ sobre #48 se ainda aberto.
2. Abrir o CSV real em aplicação de planilha disponível com UTF-8/vírgula/ponto
   decimal; registrar importação e dados sem alegar um ensaio que não ocorreu.
3. Auditar teclado, foco, rótulos, estados dinâmicos, landmarks, contraste,
   zoom/reflow, tabelas e alternativas textuais a gráficos/mapas. Priorizar
   problemas observados; manter módulos pequenos e não alterar o modelo/RNG.
4. Descobrir ferramenta permitida para medição Lighthouse real >90. Usar as
   ferramentas nativas de navegador/computador; não improvisar automação externa
   ou afirmar conformidade WCAG AA só por testes estáticos/uma pontuação.
5. Registrar evidências/limites e publicar uma nova versão imutável, com PR
   encadeado, testes adequados e o dev preservado. Não rodar build-public da
   mesma versão após commit só de metadados, pois a fonte da release é imutável.

Depois: P1.7 exige turmas reais; seguir os itens implementáveis P2 em ordem sem
fabricar pilotos. P1.1B/hardware escolar, P1.2B/aluno novo, P1.4B/revisão docente,
P1.7/SUS, calibração e Zenodo dependem de pessoas/dados/contas reais. P5 por último.
Ainda há trabalho implementável: manter a retomada ativa e respeitar limites.
