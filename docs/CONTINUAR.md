# Continuação do Viveiro

Atualizado em02/11/2026 após publicar P1.6B1 /0.37.0.
Ler AGENTS.md e docs/cronograma.md. Trabalhar em G:\Projetos\viveiro.
Manter dev4173 em G; preservar saves, branches, tags e privacidade.
Não iniciar executor concorrente. Modelos continuam exploratórios/não calibrados.

## Git e publicação atual

Branch codex/acessibilidade, PR https://github.com/albreis/viveiro/pull/49,
base codex/csv-diario/#48. PRs32–49 encadeados na última conferência; main15781d2.
Conferir Git/novos merges antes de agir, sem duplicar PRs nem sobrescrever refs.
Fonte/tag v0.37.0:30cc14ea82d8c7a20d0541641e07e5e3ad0cb432.
Metadados/checkpoint posteriores à tag. Não retag/recriar a mesma release.

Privado: https://viveiro-caos-formigueiro.everaldodev.chatgpt.site/
Projeto appgprj_6ae6364bc4488191b2757449ed3f7e94, custom/revisão1, owner único,
zero visitantes externos. Identidade/static dist preservados.
Deploy appgdep_6ae8aa1f0df0819195e2a4c2900b9167, succeeded15:20:22UTC.
Arquivo G:\Projetos\viveiro-0.37.0.tar.gz preservado.

Público: https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/
Projeto appgprj_6ae80cd45fdc8191be8315696a383393, public/revisão2.
Espelho G:\Projetos\viveiro-publico, fonte0e14edb930411c3e5cc7e04b94d9f4e21e2d7028.
Deploy appgdep_6ae8aa4cd1b481918d5fb29f97559869, succeeded15:21:01UTC,
versão8, arquivo G:\Projetos\viveiro-publico-0.37.0.tar.gz,
215 arquivos/12.554.240bytes. Galeria acrescentou0.37.0 preservando as anteriores.
HTTP sem cookies/Authorization: páginas200 e27 arquivos nãoHTML de hashes exatos.
QA real: SEMENTE-42/D2,64 em pausa, foco por atalho,264 textos sem candidatos
abaixo do limiar da checagem limitada; console limpo. Não repetir save/deploy.
IDs/hashes em validacoes/deploy-0.37.0.json e publicacao-0.37.0.json.
Nunca publicar o Site privado como público ou reaproveitar seu ID no espelho.

## P1.6B1 entregue / limites

Módulos pequenos: app/accessible-interventions, app/chart-summary,
renderer/keyboard-camera e styles/accessibility. Contraste auxiliar unificado,
foco visível em controles/summary/regions, atalhos para conteúdo/câmera/dados,
glyphs decorativos ocultos, ajuda nomeada e cena com imagem nomeada/grupo focável.
Setas/+/-/Home na câmera; primeira pessoa transfere foco, sair devolve; vistas e
A/B expõem aria-pressed. Espaço pertence a controles/summary/listas; modais e
combinações Ctrl/Alt/Meta não alteram a simulação. Home sincroniza a vista.
Intervenções por coordenadas usam o mesmo callback/replay do mouse, com limites
reais. Resumo textual do gráfico descreve o mesmo recorte de censos.
Nenhum submodelo biológico/navegação/persistência alterado.

28/28 testes dirigidos finais em6.387,6789ms; TS estrito/build345 módulos.
QA IAB4188: Espaço em painéis manteve pausa, ação X1/Z1 apareceu no diário,
X99 inválido recebeu foco; primeira pessoa/setas/foco, Esc da ajuda preservou
primeira pessoa; saída devolveu foco; atalho focou viewport e Home mudou estado.
320×800: largura útil305=scrollWidth305, sem overflow horizontal da página.
Viewport normal restaurado. QA principal259/ajuda272/catálogo367 textos sem
candidatos abaixo do limiar de contraste calculado em fundos sólidos.
Não é Lighthouse nem certificação WCAG. Ver docs/acessibilidade.md e evidências.

P1.6B2 permanece pendente: abrir CSV em aplicação de planilha, leitor de tela,
zoom/estados restantes e Lighthouse >90. Inventário não mostrou planilha e não
havia sessão Excel conectada. Nenhum software instalado/conta Google criada.
Tentativa oficial PageSpeed de base0.36.0 respondeu429/cota diária esgotada.
Não houve nota; não repetir nesta janela nem contornar por outra conta/chave.
retryNotBefore consta em validacoes/acessibilidade-0.37.0.json (24h após registro).
Só retentar em execução permitida; não substituir por pontuação fabricada.
Enquanto ferramentas/ensaios externos aguardam, avançar itens independentes P2.

## Entregas anteriores preservadas

P1.6A/0.36.0/#48: série diária opcional v1,12.000 amostras/cenário, medição após
100 ticks, estado inicial e leitura atual distintos, A/B e versão por amostra.
CSV22 colunas UTF-8/BOM/vírgula/CRLF/ponto decimal, proteção de fórmulas.
Saves antigos não ganham temperatura/gases retroativos. Exportar não usa RNG.
365 testes completos e41 dirigidos passaram naquela etapa; não repetir por
rotina se o núcleo não mudar. Ver docs/csv-diario.md.
CSV real preservado em C:\Users\conta\Downloads\viveiro-diario-AULA-v2-entradas-ar.csv,
SHA256be603c33805fa95ea6a74719e46a819eb65664569e71e4a29974e976edf2cad6.

PWA público por release na0.35.2/#47,34 arquivos, cache íntegro, sem skipWaiting
ou apagar saves. Privado/dev online e sem worker/manifesto. Offline com servidor
indisponível/redirects já testado. Cache0.35.2 preparado;0.37.0 não preparado naQA.
Tags0.35.0/.1 eram previews sem config completa no Git, nunca na galeria; preservar.

## Citação e Zenodo

CFF/.zenodo.json para tag0.37.0 real. Autoria “Viveiro contributors” confirmada
pelo usuário, que também informou já possuir conta. Não repetir essas perguntas.
Esquema oficial válido, PythonZIP conferiu517 membros/hashes, módulos e config.
.runtime/deposits/deposit-A1Ldu4/viveiro-v0.37.0-source.zip,
1.464.006bytes, SHA256
2f80f3318c601574534b435ea4b55a81fc605bd4388e38d085107d412ca9195b.
4/4 testes do depósito. Sem upload/DOI. Pacotes/tags anteriores preservados.
Fonte da tag + metadados posteriores; nove Markdown públicos de ensino incluídos;
saves, docs operacionais, credenciais e identidade de hospedagem excluídos.

A tentativa de abrir zenodo.org/uploads foi REJEITADA pela revisão automática:
possível exposição de registros privados; ter conta não foi autorização suficiente.
Pergunta assíncrona de acesso/preparo do rascunho0.36.0 está pendente. Aguardar
resposta antes de acesso dependente, sem retry, outro navegador ou outro caminho.
Pacote0.36.0/03c497454a51e4d5aad6297490288d8e05b58b84575ad3fc2824f5145f1a67b2
continua em.runtime/deposits/deposit-WhwuRb; usar a versão autorizada na resposta.
Não pedir senha/token/ORCID nem inferir nome. P0.4C ainda depende de merge.

## Ambiente e limpeza

DevPID17752/G/4173 HTTP200; aba IAB20 marcada como entrega, SEMENTE-50088/D62,5,
14 adultos em pausa/perfil leve preservados. Aguardar release-label/inicialização
se aparecer apenas HTML inicial. Vite ignora.runtime/.sites-runtime.
Saves manuais preservados, incluindo manual-2e91b636-785f-4f66-bb84-ff832aa62547.
Preview4188/session7037 encerrado por Ctrl+C; abas25/26 deQA fechadas. Helpers,
testes eHTTP concluídos. Portas4185–4187 já estavam encerradas. Não encerrar4173.
Capturas viveiro-0.37.0-acessibilidade.png, teclado-320.png e publicado.png no
diretório de visualizações autorizado. Arquivos de contraste antes/depois também.

Cua reportou browser.user indisponível no início deste turno. Após consultar a
documentação e testar APIs documentadas, UM reset e getTab20/browser2 recuperou.
Não inspecionar internals nem usar browser automation externa. Abas4/16 antigas
em erro não devem ser reutilizadas. Não reinstalar npmci com dev aberto sem
necessidade (DLL pode estar bloqueada). Escrever JSON/config atomicamente.

## Próximo passo concreto: P2.1 / ODD

1. Conferir Git/PRs; nova branch codex/ sobre #49 se aberto.
2. Ler docs de arquitetura/modelos e código de advanceFamily/initial-world,
   estados, escalas e equações. Criar docs/odd.md no protocolo ODD, com links a
   documentos curtos por submodelo para evitar um arquivo gigante.
3. Documentar propósito, entidades/variáveis/unidades, agendamento exato, desenho,
   inicialização, dados de entrada e submodelos. Distinguir hipóteses de medições.
4. Escolher um submodelo suficientemente definido (por exemplo reação-difusão),
   descrever algoritmo/condições de contorno/parâmetros a ponto de reimplementar
   apenas pelo ODD e conferir com vetores determinísticos. Não alegar auditoria
   independente por criar teste que só importe a própria implementação.
5. Testes adequados, QA de uma apresentação navegável se incluída na entrega,
   commit/push/PR/tag/publicação, mantendo os Sites e o dev.

P1.1B/hardware, P1.2B/participante novo, P1.4B/revisão docente eP1.7/turmas/SUS,
P3/calibração e Zenodo têm dependências reais. Sem dados/pessoas fictícios.
P5 por último. Ainda há itens implementáveis: manter a retomada ativa.
