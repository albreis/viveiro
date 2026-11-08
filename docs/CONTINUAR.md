# Continuação — cronograma por responsabilidade

05/11/2026. Trabalhar em G:/Projetos/viveiro, ler AGENTS.md e cronograma.md,
conferir Git/PRs e preservar saves, branches e tags. As últimas entregas
técnicas de T4 estão no [relatório da triagem](planejamento/buhl-microclima.md). A pendência
científica de B7 requer séries empíricas independentes por réplica.

## Pedido atual — acesso geométrico no motor 3D

Em 07/11, o mantenedor aprovou a hipótese do PR #130 e pediu implementá-la
no motor do Viveiro em branch nova da main. Este pedido substitui a orientação
histórica de manter a morfologia fora de ensaios novos; não apaga as restaurações
ou os lotes anteriores. Branch: `codex/escavacao-acesso-geometrico-viveiro`, base
`d88c31e`. [Regras e protocolo](planejamento/escavacao-acesso-viveiro.md).

Narbonne v3 mantém o corpo e os mecanismos da v2 e usa acesso físico à frente,
sem cota por equipe ou trava global de mordidas. Saves antigos permanecem
fixados no perfil anterior. 547 testes, build Vite e Chrome pt/en aprovados,
incluindo igualdade numérica CLI/navegador, visão lateral e primeira pessoa.

Lote **12/12 concluído**, 2.000 ticks por execução, 50/100/200 operárias,
duas seeds e pares v2/v3. [Dados](validacoes/escavacao-acesso-viveiro.json),
[evidência](validacoes/escavacao-acesso-viveiro-qa.json) e quatro gráficos
arquivados. [PR #131](https://github.com/albreis/viveiro/pull/131). O usuário
pediu comparação **relativa** com Buhl: os gráficos registram explicitamente
normalização por volume próprio versus uma escala comum ancorada no grupo 100.
Não ler a normalização como ajuste de escala física ou validação.

As frentes escavam mais que na v2, mas as razões de volume entre grupos ainda
diferem de Buhl: 0,77/1/0,80 versus 0,68/1/1,59. Próximo passo concreto, se
retomados os ensaios quantitativos: usar o protocolo controlado do PR #128,
resolver espaço/tempo e a inicialização da população antes de atribuir a
diferença a uma regra biológica. Não transferir coeficientes para forçar a
curva. B7 e calibração seguem pendentes. Não criar tags/releases/Zenodo.

## Estado preservado

Última release **[0.47.0](https://github.com/albreis/viveiro/releases/tag/v0.47.0)**.
A versão 0.46.0 teve fonte `7f4d20674206916ea443ef2f359097da5ca18731`.
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

Público: https://viveiro.ersolucoesweb.com.br/
Não atualizar antigo Site público ChatGPT. Site original privado preservado:
appgprj_6ae6364bc4488191b2757449ed3f7e94, custom/revisão1/um dono/zero externos.
Fonte privada2ad7611 equivalente à tag; recibo de deploy na evidência da release.
Dev4173 iniciado em G (PID15348 na última verificação); preview4189 preservado.
Não encerrar o servidor nem restaurar cenários de teste sobre saves do usuário.

## Próximo passo concreto

Em 07/11, após examinar o novo lote, o mantenedor pediu voltar à fadiga
apenas de escavação. A branch `codex/buhl-restaurar-fadiga-escavacao`
restaura o código da arena ao estado anterior ao PR #126.
Usar `docs/validacoes/buhl-fadiga-local-plano.json` como configuração principal:
médias arquivadas de 19,92/36,15/64,46 cm³ para 50/100/200 operárias.
[Alcance da restauração e limitação dos motores](planejamento/buhl-restauracao.md).

O ensaio de morfologia do PR #126, seus dados e gráficos ficam preservados
como histórico. Não reativar a integração nem iniciar ablações sem novo
pedido. O retorno do código não conta como nova execução de 72 h.
A arena usa motor plano próprio. Validar o comportamento do terrário
3D exigirá um cenário controlado com o mesmo motor dos agentes.
B7 continua pendente de evidência empírica independente.

Novo pedido autorizado: após integrar esta restauração, criar a branch
`codex/cenario-buhl-motor-viveiro` a partir da main. Construir um cenário
controlado que use o mesmo motor de agentes e escavação do terrário,
com métricas comparáveis a Buhl. Resolver a conversão de espaço e tempo
antes de chamar uma execução de 72 horas físicas. Não substituir esse
pedido por novas regras do motor plano antigo.


A etapa `codex/narbonne-ciclo-nutricao` foi retomada em 07/11 e os quatro
ajustes foram implementados no PR #124. O [relatório de Narbonne v2](planejamento/narbonne-v2.md)
registra 538 testes aprovados, Chrome pt/en, seis rodadas de 80 dias,
gráficos e limites científicos. O [checkpoint](planejamento/narbonne-v2-checkpoint.md)
indica a conferência de integração e a retomada de T6.
A publicação privada está pendente: em 07/11 o conector Sites retornou
`NOT_FOUND/project_not_found` (404) tanto na consulta quanto na emissão de
credencial para o projeto existente. Preservar identidade e audiência.
Retentar a publicação somente após restabelecer o acesso ao mesmo projeto.

O perfil [Messor de Narbonne](planejamento/messor-narbonne.md) fixa a
população de referência e registra as lacunas de evidência. Em B7,
pedir procedência taxonômica quando chegarem os dados da autora e
preservar a separação entre o protocolo em disco e o terrário 3D.

Para retomar a fila técnica, conferir Git e os PRs de T6 e seguir o
[plano de fundação comparável](planejamento/fundacao-comparavel.md).

**Próximo passo em T4.** Aguardar a resposta ao e-mail que o mantenedor
enviou à Dra. Camille Buhl em 05/11/2026. Ao receber dados ou um link,
conferir protocolo, procedência, licença e quais réplicas ficaram fora
das curvas já usadas no ajuste.
A [revisão da escavação](planejamento/buhl-variaveis.md) identificou
contagens de ativas e agregadas como evidência complementar de Buhl.
A [instrumentação](planejamento/buhl-atividade.md) mede esforço e massa
por operária e já tem um piloto pareado de duas horas. A
[triagem de microclima](planejamento/buhl-microclima.md) concluiu 48 rodadas
pareadas, com balanço de massa e controle de fluxo com água fixa.
O [perfil de esforço no terrário 3D](planejamento/fadiga-esforco.md) liga
locomoção, carga, bloqueio, clima e escavação. A próxima ação de B7 depende
dos registros independentes solicitados à autora.
Para estimar fadiga, procurar duração e frequência de escavação e repouso
por operária em condições comparáveis. Fixar novos parâmetros e critérios
antes de comparar com observações reservadas.

A [comparação de fadiga](planejamento/buhl-fadiga.md) encerrou 30 rodadas
pareadas de 72 h no [PR #111](https://github.com/albreis/viveiro/pull/111).
A fonte registrada é `2be875ba67da45df10c56875615c6a7aa82e1449`.
A variante ficou aquém dos critérios exploratórios. Em 07/11 o mantenedor
escolheu a fadiga apenas de escavação como referência principal dos próximos
ensaios: usar explicitamente `docs/validacoes/buhl-fadiga-local-plano.json`.
Preservar o controle, a variante por ação e o significado dos planos antigos.
A escolha operacional não encerra B7. Os [quatro PNGs 4:5](planejamento/buhl-graficos.md)
foram exportados das séries arquivadas, sem novas rodadas.

O [CSV para planilhas](csv-diario.md) segue o idioma selecionado.
P1.6B2-C e P1.6B2-R concluídos em 05/11 após o relato de importação
com localidade EUA e uso de NVDA. UX-19/20 em celular físico também
foi confirmado pelo usuário. [Escopo dos relatos](planejamento/voce-sozinho.md).

As cinco fases de UX e T3 foram validadas tecnicamente. T1 examinou 78 estados
com zero violações do axe. As verificações manuais seguem no roteiro de
acessibilidade. A retomada automática continua PAUSED.

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
no Chrome com toque emulado. O usuário confirmou o uso no POCO X6 em 05/11.

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

B2 concluído em 04/11/2026. Os três grupos de rt24b (50, 100 e 200)
completaram 86.400 ticks cada. As 435 amostras e o CSV completo bateram
exatamente com a referência histórica; ver [recibo](validacoes/buhl-rt24b.json).
A rodada local está em `.runtime/buhl-rt24b-reconciliado`. Não repetir a
referência para aceitar B2 de novo. Este resultado não calibra o modelo.

B3 entregue no PR #104. A arena física usa operárias com movimento
local, areia em disco intacto e contas separadas de abertura de células,
massa removida e solo transportado. O [protocolo físico](planejamento/buhl-protocolo.md)
documenta parâmetros e unidades. As escolhas de densidade e dispersão
permanecem hipóteses declaradas.

B4 concluiu a referência de 72 h com 15 rodadas. O
[relatório bilateral](planejamento/buhl-criterios.md) conserva o baixo volume
nos três grupos. B5 entregou retomada por seed/grupo e triagem de
sensibilidade [Morris](planejamento/buhl-lotes.md).

B6 separou seguimento da parede e recrutamento. A
[ablação de seis horas](planejamento/buhl-mecanismos.md) conserva os
resultados de cada mecanismo com as mesmas seeds do controle.

B7 escolheu a configuração no ponto observado de 12 h. As 45
execuções usaram apenas seeds de desenvolvimento. O
[plano reservado](validacoes/buhl-arena-reservado-plano.json) preserva
os parâmetros escolhidos e as cinco seeds separadas. A validação empírica
continua pendente por falta de observações independentes identificadas.

B8 concluiu as 15 rodadas de 72 h e publicou [avaliação e séries](validacao.md).
A configuração escolhida ficou próxima das médias de 12 h. O volume continuou
crescendo demais nas janelas seguintes. A trilha de dados deve preservar
identidade por réplica, compatibilidade do protocolo e permissão de reuso.
Um futuro ajuste deve reservar novas seeds do simulador e observações reais
antes de comparar mecanismos de saturação. Os instrumentos de T5 estão prontos
para receber observações, pareceres e contribuições reais.
