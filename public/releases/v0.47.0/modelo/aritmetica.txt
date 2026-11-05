# Aritmética portátil dos experimentos

Contrato numérico stdlib-f64-v1, introduzido na0.40.0 para P2.2B.
Continua um modelo biológico exploratório, sem calibração por espécie.

## Problema medido

Na0.39.0, mesmo motor/seed/parâmetros geraram diferenças de poucos bits já na
posição inicial e no atrito. Em dez dias, populações também passaram a divergir.
Dados brutos originais em tests/fixtures/cli-native-039; não foram apagados ou
arredondados para produzir uma aparência de igualdade.

## Contratos separados e explícitos

O serviço src/libs/model-math.ts inicia com as funções nativas do ambiente.
O terrário3D e saves legados mantêm ecmascript-native-f64-v1. Encaminhar as
operações para o serviço preservou exatamente o CSV nativo de1000 ticks,
normalizando só a versão do software para comparar com a captura anterior.
Não existe patch de Math global, nem mudança das regras biológicas ou do RNG.

CLI e página de experimentos iniciam Workers próprios. Somente nesses contextos
installPortableMath seleciona funções JavaScript do stdlib, com versões diretas
fixadas e dependências transitivas travadas no package-lock.json. O Node usa
worker_threads; o navegador usa WebWorker. Backend e buffers internos da biblioteca
ficam separados por Worker. Não alternar a política numérica de um World vivo.

O manifesto registra a política. Para reproduzir, usar mesma versão de código,
lockfile, seed, perfil versionado, parâmetros e política. Um CSV de experimento
portátil pode ter uma trajetória diferente da simulação nativa do mesmo terrário.
Não reinterpretar um save nativo como se tivesse sido gerado pelo backend portátil.
Os experimentos exportam observações, não saves portáteis completos.

## Operações e precisão

São encaminhados exp/expm1, sin/cos/tan/tanh, atan/atan2, log/log1p, cbrt,
hypot e potenciação. log é o logaritmo natural, implementado por stdlib ln.
Operadores ** do núcleo também passam por pow, inclusive expoentes fracionários.
A função hypot do stdlib aceita dois argumentos; o adaptador reduz vetores em
ordem fixa a partir de zero, respeitando a precedência de infinito sobre NaN.

Os kernels JavaScript do stdlib mantêm reduções de argumento e coeficientes
explícitos. Referências primárias: [exp](https://github.com/stdlib-js/math-base-special-exp),
[sin](https://github.com/stdlib-js/math-base-special-sin),
[tan](https://github.com/stdlib-js/math-base-special-tan) e
[hypot](https://github.com/stdlib-js/math-base-special-hypot).
Usamos suas implementações, não uma aproximação nova sem testes.

Somas, produtos, divisões e sqrt continuam operações Float64 do ambiente.
A igualdade foi medida nos runtimes efetivamente ensaiados; não equivale a provar
correção arredondada universal de todas as funções em todo motor JavaScript.
A referência ODD superficial continua autônoma, sem importar esse backend.

## Agendamento

Cada tick executa o mesmo World.step. Progresso é emitido a cada25 ticks.
O Worker do navegador não introduz timers entre blocos: a interface é outra
thread e cancela via terminate. Isso evita atrasos por throttling de timers em
abas de fundo. A renderização não escolhe quantos ticks entram no resultado.

## Evidências reproduzíveis

Quatro casos em tests/fixtures/cli-portable-040: regressão da seedQA-CLI-039,
ninho com saúde/solo/gases, fundação semiclaustral e outra seed com operárias.
Cada caso conserva plano, CSV e manifesto produzidos independentemente no Node
e no navegador real. Os dois arquivos de cada ambiente são byte a byte iguais.
Somam4400 ticks por ambiente. Não são medições de formigueiros naturais.

Regressões executam a CLI isolada e confrontam os arquivos com a captura real do
navegador. Testes analíticos conferem valores, domínios, NaN/infinito, zero assinado
e norma3D; um teste concorrente verifica isolamento dos Workers. A auditoria AST
impede voltar a funções nativas aproximadas ou ** no núcleo encaminhado.
Renderer, serviço nativo e referência ODD têm exclusões explícitas por contrato.

A suíte completa do modelo passou396 testes antes de adicionar os quatro casos
de captura como regressão. Checks dirigidos posteriores e QA do bundle constam
em docs/validacoes/paridade-0.40.0.json. Não apresentar essa verificação interna
como replicação científica externa nem como calibração ecológica.

## Dependências e distribuição

As funções numéricas e avisos de seus autores originais preservam Apache2.0,
MIT e avisos BSD/Sun aplicáveis. scripts/generate-numeric-notices.ts gera índice
e arquivos pequenos em public/notices/ a partir das dependências instaladas do
lockfile. Cada aviso de pacote tem no máximo109 linhas nesta revisão; a licença
Apache completa fica separada. Não remover avisos dos bundles distribuídos.
