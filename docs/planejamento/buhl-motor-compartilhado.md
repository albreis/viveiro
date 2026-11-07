# Cenário com o motor real do Viveiro

Pedido de 07/11/2026. Branch `codex/cenario-buhl-motor-viveiro`, criada
diretamente da main `d88c31e`, depois da restauração no PR #127.

## Já implementado nesta branch

- Uma fábrica de coortes de 50, 100 ou 200 operárias adultas usa a classe
  real `World`, `makeAnt`, `World.step` e o mesmo livro de solo do terrário.
- Rainha, macho, prole e predadores são excluídos do piloto.
- CLI coleta solo escavado, erosão, transporte, depósito, balanço e população.
- Não há regras de escavação da arena plana copiadas para o piloto.
- A saída declara `buhlComparable: false` e lista os impedimentos físicos.

`node scripts/run-terrarium-study.ts BUHL-WORLD-PILOTO 50 100`

Esse é um piloto de infraestrutura no terrário existente, com 100 passos
do modelo. Não é um ensaio de 72 horas e não deve gerar uma comparação
empírica como se a réplica do experimento já estivesse pronta.

## Próximos passos concretos

Atualização de 07/11: manter a morfologia do motor real e seguir
[K0–K6](buhl-parametrizacao.md), com fontes individuais e [TRACE](buhl-trace.md).
A preferência anterior pelo lote que mais se aproximou dos volumes foi revista;
os ensaios antigos continuam preservados e Buhl não volta a ser independente.

1. Separar o tempo físico do relógio biológico acelerado. Hoje 100 passos
   representam um dia do modelo. Não converter esse dia em 24 horas reais.
2. Criar o ambiente controlado do experimento, com dimensões em milímetros,
   solo de espessura definida e sem galerias iniciais. Os limites atuais
   do terrário são fixos; não apenas comprimir a geometria mudando as formigas.
3. Conferir volume físico de solo, carga por operária e taxa de escavação
   usando os módulos reais do terrário. Separar hipóteses de medidas.
4. Usar apenas fadiga de escavação no protocolo, sem recriar um segundo
   cérebro de agentes. Comparar a execução com o mesmo estado no app.
5. Só depois executar os grupos pareados por 72 horas físicas, arquivar
   os balanços e apresentar as curvas, inclusive se piorarem.

A arena antiga permanece restaurada e independente. A meta desta branch
é validar o comportamento realmente executado pelo terrário; o trabalho
não deve ser substituído por novas variantes da arena antiga.

## Checkpoint inicial

Dois testes dirigidos e TypeScript/Vite passaram. O piloto de 50 operárias
por 100 passos preservou a população e o balanço, com zero escavação nesse
trecho. Não interpretar esse piloto como curva do estudo. A montagem do
ambiente deve ativar os estímulos reais de escavação do World, sem trocar
o agente por uma regra especial criada para ajustar a referência.
