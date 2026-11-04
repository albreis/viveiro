# Continuação — cronograma por responsabilidade

03/11/2026. Trabalhar em `G:\Projetos\viveiro`, ler AGENTS.md e cronograma.md,
conferir Git/PRs e preservar saves, branches e tags. Última entrega: página privada de leitura do cronograma.
Não implementa as fases UX nem executa calibração longa.

## Estado preservado

Release **0.46.0**, fonte `7f4d20674206916ea443ef2f359097da5ca18731`.
P2.1–P2.7 publicados; P2.8/P5 descartados. PRs76–80 entregaram comunidade,
galeria com dez receitas internas, contraste A/B e UI/renderer em TS estrito.
474 testes completos, build460módulos, CodeQL e QA aprovados na entrega.
CSV/manifesto públicos de300ticks idênticos à CLI; ver validacoes/release-0.46.0.json.
Não reabrir essas entregas nem chamar o legado da simulação de já convertido.

PR82 integrado: Lighthouse13.6.0/Chrome156, acessibilidade97desktop/100móvel;
desempenho44/33. Aceite Lighthouse >90 concluído, API PageSpeed não usada de novo.
Os dois alertas desktop e TBT/CLS estão na fila técnica, sem certificação WCAG.
PageSpeed API: preservar429 anterior; não repetir antes de04/11 21:53:59UTC.
Usuário informou teste de zoom adequado; registrar escopo não especificado.

DOI automático **10.5281/zenodo.23932885**, versão0.46.0, conferido no registro
público e no ZIP baixado; ver validacoes/zenodo-0.46.0.json. P0.4 encerrado.
Não duplicar depósitos, publicar versões intermediárias no Zenodo ou reescrever tags.

Público: https://viveiro.ersolucoesweb.com.br/releases/v0.46.0/
Não atualizar antigo Site público ChatGPT. Site original privado preservado:
appgprj_6ae6364bc4488191b2757449ed3f7e94, custom/revisão1/um dono/zero externos.
Fonte privada2ad7611 equivalente à tag; recibo de deploy na evidência da release.
Dev4173 iniciado em G (PID15348 na última verificação); preview4189 preservado.
Não encerrar o servidor nem restaurar cenários de teste sobre saves do usuário.

## Próximo passo concreto

**Próxima implementação é T4, retomada de Buhl.** As cinco fases de UX e T3 foram validadas tecnicamente. T1 concluída em
78 estados do axe, com zero violações automáticas. Os resultados incompletos
e o roteiro manual estão em validacoes/axe-t1 e roteiro-acessibilidade.md.
Depois seguir as fases UX, desempenho e retomada Buhl. Usar branch
`codex/` nova, módulos pequenos/TS/Vite e testes adequados. Não criar nova release
apenas para estes documentos. A retomada automática continua PAUSED.

Planos: [técnico](planejamento/tecnico.md), [você sozinho](planejamento/voce-sozinho.md),
[terceiros](planejamento/com-terceiros.md), [UX](planejamento/ux-interface.md),
[Buhl](planejamento/buhl.md), [opcionais](planejamento/dados-opcionais.md).
Zoom testado não elimina regressão após alteração de layout; axe não substitui
leitor de tela. Não atribuir ao usuário trabalho de código/análise que o agente
pode executar, nem inventar participantes ou pareceres para concluir os aceites.

## P3 já iniciado em outra branch

`claude/project-thread-kazijj`, cabeça512b8c0fbe07ff015b4be85075e7457f5cf57395,
PR69 aberto/com conflitos. Não mesclar sem reconciliar com a main atual nem
modificar a branch original nesta reorganização. Relatório de continuidade e
Markdown científicos conferidos; índice contextual131arquivos. Versão científica
antiga0.41.0 não conhece todas as ferramentas P2 atuais.

Preservar anexos e trabalho temporário existente. Próxima sequência científica:
reconciliar código → testes/referência rt24b → unidades/tempo e critérios →
varreduras retomáveis/sensibilidade → ajuste justificado → dados reservados e
MAE/cobertura. Não repetir variantes descartadas. Expoente0,68 isolado não basta:
curva temporal e escala ainda erram. Dados/modelos de outras espécies não
calibram automaticamente Messor sancta; comparação NetLogo não é dado empírico.

O usuário acrescentou dados abertos como **incremento opcional**, não bloqueador
novo: oito propostas em planejamento/dados-opcionais.md, com triagem/licenças/
colunas ainda a completar. Nenhum pacote volumoso adquirido ou contato enviado.

## Entrega e limites operacionais

Fazer commit/push/PR em ordem, guardar checkpoint antes de interrupção; não iniciar
executor concorrente. Antes de3% restante da janela real de5h, enviar progresso
e parar para continuidade manual, conforme pedido. Consultar a cota real sem
expor conta/créditos; não contornar limites. Não executar benchmarks de horas
numa rodada cujo objetivo é apenas organizar o cronograma.

## Página privada do cronograma — nova entrega

Página de leitura `/cronograma.html`, gerada dos documentos existentes: busca
no plano todo, áreas por responsabilidade, UX/Buhl/opcionais/concluídos,
filtros e impressão. Interface pt/en; conteúdo do plano continua em português.
Excluída do build público; usar apenas o Site privado owner-only. Sem tag nova.
Suíte completa479/479; TS/build aprovados. Ver cronograma-privado.md e
validacoes/cronograma-privado.json para o recibo e a publicação.
A página exibe a primeira etapa técnica com itens pendentes.

Publicação da página privada concluída pelo PR84, fonte76650820087a14f7d2afbeba3d504772acd44d9e.
URL: https://viveiro-caos-formigueiro.everaldodev.chatgpt.site/cronograma.html?lang=pt-BR
Acesso após deploy: custom/revisão1/um dono/zero externos. Conferida em produção,
console limpo. Recibo atualiza somente documentação; não pede outro deploy/tag.

T1 publicado no Site privado na fonte ae989fa27ca5cc3836e87cb6f96f4d13944de813,
PR86, implantação appgdep_6aea9ea886e48191b3623df16356710b.

UX-01 a UX-06 publicados no PR87, fonte 0e4be5e807a57e6447c0dd250966cc2dc942c5e3,
implantação appgdep_6aeaa18c97b88191b19a48fb378c49d7.

UX-07 a UX-11 publicados pelo PR88, com correções de rolagem e de layout nos
PRs 90–92. Ambiente e Colônia têm altura natural no desktop, e os controles
secundários ficam depois de Análise e dados. O PR93 acrescentou a prévia
dos experimentos por mouse e teclado.

UX-12 a UX-15 validados no PR89. Build, 480 testes e 102 estados no Chrome
passaram. A cena ocupa a largura útil no tablet, e a barra permanece acessível
durante a rolagem e a navegação por Tab. Ver validacoes/ux-fase-3.json.

UX-16 a UX-20 validados tecnicamente. Build, 22 testes dirigidos e 26 estados
da auditoria passaram. A gaveta reutiliza os controles e permite intervir
direto no solo. Rolagem, órbita, pinça e primeira pessoa foram verificadas
no Chrome com toque emulado. O teste em celular físico segue na fila individual.

UX-21 validado. Os cartões de fundação, túneis, ecologia, clima e ar
mostram as métricas principais e oferecem os detalhes em Saiba mais.
A troca de A para B na aula de ventilação mudou de uma para duas entradas.
Build, 19 testes dirigidos e 38 estados no Chrome passaram.

T3 mediu o carregamento em três rodadas alternadas e transferiu a primeira
malha do solo para o worker. A mediana de TBT caiu nos dois perfis e o CLS
caiu no desktop. O ensaio de movimento registrou 58,6/59,7 FPS no hardware
local. Ver qa-desempenho.md. O teste no equipamento escolar permanece aberto.

B1 reconciliado em codex/buhl-reconciliacao. A branch original e os anexos
foram preservados. Os primeiros 600 ticks de rt24b coincidiram exatamente
com o arquivo histórico para 50, 100 e 200 operárias. O CLI agora grava
um resultado verificado por grupo e retoma com as ferramentas de P2.3.

Próximo passo: B2. Repetir rt24b com 86.400 ticks e os três grupos do
[comando em cli.md](cli.md#comparação-com-dados-publicados). Começar pelo grupo
de 50 com --limit 1. Retomar na mesma pasta com --resume e comparar a série
e os volumes finais com os anexos. Depois tratar unidades e protocolo em B3.
