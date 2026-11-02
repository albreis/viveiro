# CLI e experimentos isolados

Entregas P2.2A /0.39.0 e P2.2B /0.40.0. A execução sem interface usa uma
política numérica portátil em Workers isolados. Quatro casos reais produziram
CSV e manifesto idênticos byte a byte no navegador e Node24.22.1. Não confundir
repetição na mesma implementação/runtime com portabilidade científica.

## Uso com Node24

Na fonte desta versão, instalar dependências com npm ci quando necessário:

```text
npm run experiment -- --seed SEMENTE-42 --days 3 --out resultado-novo
npm run experiment -- --seed TESTE --days 10 --start established --profile generic-demo@1 --humidity 68 --wind-x 0.25 --wind-z -0.15 --out outro-resultado
npm run experiment -- --plan configuracao.json --out resultado-do-plano
npm run experiment -- --help
```

A pasta de saída deve ser nova e seu pai precisa existir. Não há sobrescrita,
remoção recursiva, reset de Git ou alteração de saves. Argumentos desconhecidos,
repetidos, sem valor e planos inválidos falham antes da simulação. --plan só
combina com --out: não há precedência silenciosa de parâmetros.

Ctrl+C interrompe o processo. A gravação começa após completar os ticks; se o
sistema de arquivos falhar durante a gravação, não tratar pasta incompleta como
resultado. O manifesto é gravado por último e permite conferir o CSV.

## Configuração versionada

Schema viveiro-experiment-v1. A página experimentos.html inicia com exemplo
editável e oferece baixar a configuração canônica depois de uma execução.
Campos omitidos recebem padrões explícitos; null não é número nem omissão.

- seed:1–128 caracteres, sem controles. Padrão SEMENTE-42.
- days: inteiro0–365; cada dia equivale a100 ticks.0 exporta só o estado inicial.
- startMode: founding por padrão, ou established. Established usa o construtor
  existente com ninho e dois reprodutores, não inventa operárias preparadas.
- biologicalProfile: schema1, id e versão obrigatórios quando informado.
  Padrão generic-demo@5 fixado, sem seguir automaticamente versões futuras.
- parameters: humidity/light/randomness0–100; reposeAngle15–55°;
  temperatureC5–45°C; windX/windZ−4 a4 unidades do modelo.

Padrões numéricos:58/72/28/36/24/0/0, nessa ordem. Estes limites são os de
controle da experiência, não faixas naturais validadas. O perfil escolhe
submodelos; este runner usa os parâmetros explícitos do plano, sem aplicar
silenciosamente o preset climático de um perfil de laboratório.

## Motor, agendamento e isolamento

runExperiment cria um World real com a seed e a configuração, chama seu step
uma vez por tick e usa dailyCsv, o mesmo exportador de observações do terrário.
Não usa Three.js, desenho, consultas de clima ou tempo real para escolher passos.
A ordem de advanceFamily continua a do ODD. Filhas usam o habitat compartilhado
pelas mesmas regras. Não altera regras biológicas, navegação ou RNG.

Navegador: experimento em Worker próprio, sem IndexedDB nem terrário salvo.
Cancelar encerra só esse cálculo e invalida seus resultados. Downloads anteriores
não são apagados. No Node, cada comando inicia um processo sem interface.
Callbacks a cada25 ticks servem a progresso/agendamento; não escolhem o tempo
biológico. A página não continua calculando depois de ser fechada.

## Saídas

- dados.csv: schema diário v1,22 colunas, UTF-8 com BOM, vírgula, CRLF e ponto
  decimal. Inclui estado inicial e fechamento a cada100 ticks; não médias nem
  previsões. Sem temperatura/gases, campos vazios continuam ausências.
- manifesto.json: schema viveiro-run-v1, versão real, plano canônico, intervalo,
  contrato aritmético versionado, bytes/hash SHA-256 do CSV e RNG final da colônia raiz.
  Filhas podem ter RNG próprio; esse único número não é hash do estado completo.
- configuracao.json: download da página; a CLI usa o mesmo plano no manifesto.

Manifesto e CSV não incluem data, duração de CPU, caminho local ou identificador
aleatório da execução. Os hashes mudam se os dados mudarem. O número de versão
permite localizar a tag da fonte após publicar; não certifica checkout sem edits.
O comando não cria checkpoint/replay completo nem aceita saves como estado inicial.
Varredura/retomada pertence aP2.3; aulas A/B continuam na interface existente.

## Histórico da divergência nativa na0.39.0

Node24.22.1 e IAB real executaram QA-CLI-039,10 dias, established, generic-demo@1,
humidity68/light72/randomness28/repose36/temperature24/windX0.25/windZ−0.15.
Planos iguais, sem arredondar ou ocultar observações. CSV coincide até D6; emD7,
Node registrou38 adultos/16crias e navegador37adultos/17crias. EmD10:51/8 e56/4.

Comparação de estados obtidos pelo mesmo fluxo de diagnóstico nos dois runtimes
localizou uma diferença já na posiçãoY de um predador ao inicializar:
0.0233727329392504 contra0.023372732939250403. No tick1, atrito granular:
0.7265425280053608 contra0.7265425280053609. RNG ainda igual até tick600, distinto
no tick650. Isso é evidência de divergência computacional, não de caos natural
validado. O diagnóstico não alterou o CSV nem a ordem de draws do experimento.

Não basta formatar ou arredondar o CSV: a população inteira também divergiu.
A0.40.0 introduziu a política stdlib-f64-v1 em cálculos isolados, preservando
a política nativa dos saves e do terrário3D. Funções e múltiplas trajetórias foram
conferidas com navegador REAL e Node. Ver [contrato numérico](aritmetica-portatil.md). Limitações observadas
não são selo de validação científica nem garantia entre motores arbitrários.

Dados brutos sintéticos preservados em tests/fixtures/cli-native-039/ (plano e
CSVs reais de ambos os ambientes). Hashes e resultados em
docs/validacoes/cli-0.39.0.json; nenhum dado do terrário pessoal foi usado.
