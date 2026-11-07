# Buhl — transferência do perfil de operárias de Narbonne

Protocolo fixado em 07/11/2026 antes do novo lote de 72 horas. Os PRs
#123 e #124 já estão integrados. Este ensaio liga suas regras de operárias
à arena física e mede o efeito do conjunto no gráfico principal de solo
removido. Mantém cinco seeds pareadas por grupo, com 50, 100 e 200 operárias.
Usa apenas fadiga de escavação (`work-recovery`).

## O que foi transferido

- A função compartilhada de porte nominal de 4–8 mm, referência de 5 mm
  e cabeça proporcionalmente maior nas operárias grandes. A distribuição
  favorece portes menores e continua sendo uma hipótese ilustrativa.
- A mesma resposta da caminhada à temperatura, nas âncoras de Challet,
  com 24 °C fixados como condição exploratória do Viveiro.
- A penalidade de carga de terra em galerias do perfil v2, fator 0,85
  com uma carga completa. Massa por pelota e tempo por tentativa ficam intactos.
- A elipse de contato entre operárias do motor 3D, convertida em milímetros
  e projetada no plano. O porte agora afeta o espaço de encontro entre agentes.
  A regra permite sair de sobreposição existente e tenta os desvios cardinais.

A arena mantém centros na grade, geometria plana e exclusão de uma célula.
A elipse amplia a checagem entre agentes. O contato com o solo continua pela
grade; não é uma malha 3D completa de corpo e terreno. A cabeça fica registrada
no fenótipo, enquanto o contato usa a escala corporal da mesma regra 3D.
Genomas, envelhecimento e naníticas não são gerados nesse ensaio de operárias
adultas. A distribuição compartilhada é a referência anterior a esses efeitos.

O plano exige `workerProfile` e microclima explícitos. Planos sem a referência
conservam a dinâmica e a sequência aleatória anteriores. Tamanhos usam hash
independente, sem consumir o gerador das decisões. Metadados registram o perfil,
o porte por indivíduo, velocidades aplicadas e candidatos rejeitados por contato.

## Condições e critérios

O [plano](../validacoes/buhl-narbonne-operarias-plano.json) fixa 24 °C,
água relativa da areia 0,08, umidade do ar 0,8, fluxo zero e secagem desativada.
A água neutra mantém o fator de tempo por pelota em um. Esses números não
são uma reconstrução das condições ausentes do estudo de Buhl.

Serão comparadas as séries novas às séries arquivadas de controle e de fadiga
de escavação, nas mesmas cinco seeds. Relatar volume em 12 e 72 horas, MAE nos
seis tempos de 12 a 72 horas, cobertura da leitura ±3 cm³, taxa tardia,
diferenças pareadas e dispersão. Preservar resultados desfavoráveis.
A temperatura e as regras de contato/carga mudam juntas; o lote não isola
seus efeitos individuais e não encerra B7.

Todos os balanços de massa e células devem se conservar. Trânsito deve continuar
abrindo zero células de areia. Nenhum fator novo de produtividade, força de
mandíbula ou escavação por porte foi inventado. Não há ajuste para atingir
o volume de referência. A curva de 2001 e a tabela de 2005 ficam separadas.

Rainha, macho, voo, calendário e dieta de fundação não fazem parte do protocolo
com grupos fixos de operárias. Parede e teto não têm graus de liberdade na
arena plana; seu fator de marcha não é aplicado como se todas as operárias
estivessem escalando. O relógio continua em segundos físicos.

## Execução

```powershell
node scripts/sweep-buhl-arena.ts --plan docs/validacoes/buhl-narbonne-operarias-plano.json --out .runtime/buhl-narbonne-operarias-72h --jobs 6
```

O lote é retomável com `--resume` na mesma fonte. Não mudar módulos do motor
durante sua execução, substituir a pasta ou iniciar outro executor.
O próximo passo é concluir as rodadas, conferir os balanços e gerar a
comparação visual com as séries anteriores.
