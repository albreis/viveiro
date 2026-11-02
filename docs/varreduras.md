# Varreduras reproduzíveis e retomada

P2.3, introduzida na versão 0.41.0. Experimentos exploratórios, não calibrados
por espécie. A varredura executa o mesmo World e exportador da CLI individual,
com política numérica stdlib-f64-v1; não acessa o terrário salvo ou seu relógio.

## Exemplo: cinco valores e dez réplicas

Na fonte desta versão, com Node 24 e dependências do lockfile instaladas:

```text
npm run sweep -- --out resultado-novo --jobs 2
```

São 50 execuções: humidity [40,50,60,70,80], dez réplicas, um dia do modelo,
ninho estabelecido e perfil generic-demo@1. A configuração completa, inclusive
seed de origem VARREDURA-41, fica em varredura.json. --plan arquivo.json aceita
um plano personalizado do schema viveiro-sweep-v1, com base, parameter, values
e replicates. A página experimentos.html permite editar o mesmo plano.

Um único parâmetro varia por lote. Parâmetros aceitos: humidity, light,
randomness, reposeAngle, temperatureC, windX e windZ. Faixas são as da CLI
individual. Máximo de 50 valores distintos, 100 réplicas e 1.000 execuções.

## Seeds pareadas e ordem

Cada seed de réplica é SWEEP- seguido do SHA-256 de JSON.stringify de
["sweep-replica-v1", seed original, número da réplica a partir de 1]. A mesma
réplica usa a mesma seed entre valores. Isso permite comparações pareadas;
não significa independência estatística entre tratamentos. Réplicas diferentes
recebem outras strings de seed. O World continua usando seu RNG de 32 bits;
SHA-256 na derivação não elimina a possibilidade de colisões desse RNG.

Identificadores v001-r001 etc. seguem a ordem explícita de valores/réplicas.
Os resultados são ordenados assim mesmo quando os Workers terminam fora de
ordem. Alterar --jobs de 1 a 8 afeta agendamento, sem mudar seeds ou ticks.
No navegador o seletor oferece 1, 2 ou 4 Workers. Não há trabalho em servidor.

## Arquivos e retomada

Cada diretório vNNN-rNNN contém dados.csv e manifesto.json. Resultados completos
são publicados por renomeação de diretório; temporários .partial-* incompletos
não contam como resultados e não são apagados durante uma retomada.

```text
npm run sweep -- --out resultado-novo --jobs 2 --limit 7
npm run sweep -- --out resultado-novo --jobs 4 --resume
```

A primeira chamada conclui sete execuções e grava retomada-7.json; a segunda
verifica e reutiliza esses resultados, calculando os 43 restantes. Com plano
personalizado, repita também --plan com a mesma configuração. Só --resume
permite abrir uma pasta existente. Plano, versão, política, IDs, configuração
de cada execução, tamanho e SHA-256 do CSV são conferidos antes do trabalho.
Arquivos diferentes não são sobrescritos. Mudar a ordem dos valores muda o plano.

Ao concluir: resumo.csv é um índice com valor, réplica, seed e hash do CSV;
concluido.json registra os hashes; retomada.json inclui todos os CSVs/manifestos
para transporte. Métricas biológicas continuam nos CSVs diários individuais.
Hashes detectam corrupção; não são assinatura de autenticidade científica.

Ctrl+C encerra os Workers e conserva os diretórios concluídos. .sweep.lock
impede dois comandos na mesma pasta. Após encerramento abrupto do processo/SO,
o bloqueio pode permanecer: confirme que não há executor ativo e remova apenas
esse arquivo antes de retomar. Não há remoção automática de bloqueios incertos.

## Navegador e transporte

A página de experimentos roda o mesmo lote em Workers independentes. Pode-se
interromper, continuar e baixar o JSON de retomada a qualquer momento após a
validação dos resultados. Antes de fechar a página, baixe o arquivo: a varredura
não é persistida automaticamente no IndexedDB e não altera saves do terrário.

Limites no navegador: 200 execuções, 10.000 observações diárias previstas e
importação de JSON até 20 MiB. A CLI aceita planos maiores. O JSON inclui CSVs
individuais como texto, preservando BOM/CRLF; o índice CSV não substitui esses dados.

```text
npm run sweep -- --checkpoint retomada.json --out resultado-importado --jobs 2
```

Resultados importados são verificados antes de iniciar Workers. A retomada
exige mesma versão do modelo e política. Em fontes alteradas localmente sem
mudar a versão, esse identificador não prova igualdade do código: não misture
builds diferentes sob a mesma versão publicada. Não migramos saves nativos
para a política portátil nem atribuímos calibração aos resultados deste lote.
