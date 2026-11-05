# Observações diárias e CSV · 0.36.0

P1.6A implementa a série observada, a exportação e uma tabela acessível por teclado.
P1.6B (auditoria ampla WCAG 2.1 AA/Lighthouse >90) continua pendente.

## Como usar

Abra **Dados observados · CSV diário**, sob o terrário, e escolha **Baixar CSV diário**.
A tabela mostra até dez amostras recentes de cada cenário; o arquivo inclui toda a
série retida de A e B, independentemente da câmera ativa. Enter abre o painel e
aciona o botão. Tab chega à região da tabela; setas permitem rolar as colunas.
O JSON existente continua sendo o formato completo de experimento/checkpoint.

O download usa o idioma selecionado. Em português do Brasil, a vírgula
separa as casas decimais e o ponto e vírgula separa as colunas. Em inglês,
o ponto separa as casas decimais e a vírgula separa as colunas. Ambos usam
UTF-8 com BOM e CRLF. Importe o arquivo original com a localidade do
download para interpretar os valores corretamente. Se a planilha pedir
um delimitador em português, escolha ponto e vírgula. Importe o arquivo
baixado novamente quando os decimais já tiverem virado números inteiros.

Na página de experimentos, o download para planilha e o índice da
varredura também seguem o idioma. O arquivo científico `dados.csv`
referenciado pelo manifesto tem o mesmo conteúdo do gerado pela CLI.
Em português, ele fica disponível no link de reprodução. Em inglês,
o download da planilha já tem esse formato.

## O que é medido

Uma amostra no tick zero identifica o estado inicial. Após cada tick completo
múltiplo de100, registra-se o fechamento daquele dia do modelo, depois de todos
os submodelos e novas fundações. São valores instantâneos, não médias do dia.
Uma amostra atual separada é incluída se o estado corrente difere do último
registro (por exemplo, dia fracionário ou intervenção em pausa).

- Adultos, prole total, ovos, larvas, pupas e número de colônias: totais de todas
  as colônias existentes, sem duplicar o habitat compartilhado. Estágio da prole
  usa a mesma função do modelo.
- Alimento: soma da reserva alimentar e do fundo reprodutivo de cada colônia;
  não soma comida em transporte, inglúvias ou reservas maternas. Unidade do modelo.
- Temperatura do ar: referência configurada no ambiente, não uma leitura externa.
- Temperatura do solo: média aritmética das células iguais da grade do modelo;
  não é a temperatura de cada formiga ou câmara.
- O2/CO2: soma de cada quantidade de gás dividida pelo volume total das células
  de ar, em porcentagem por volume. Não é a média simples das porcentagens locais.
  Sem grade/células, o campo fica vazio: não se inventa ar atmosférico histórico.

Versão da exportação, versão da medição, schema, seed, cenário, aula, tick,
dia e início da coleta acompanham cada linha. Previsões não entram no CSV.
Ausência é campo vazio, distinta de zero. O modelo continua exploratório,
sem calibração por espécie ou medições de um terrário real.

## Persistência e limites

`dailyObservations` é uma extensão opcional versionada do snapshot, validada
na importação e restauração. Checkpoints compactos mantêm a série e a versão de
cada amostra. Exportar ou visualizar não consome RNG, não inicializa física e
não avança o relógio. Avanço em Worker e ticks visíveis usam o mesmo observador.

Saves antigos permanecem válidos. Sem série, exportam apenas a leitura atual;
a coleta começa no próximo tick executado e nos próximos dias completos.
O histórico antigo do gráfico continua no JSON; não se atribuem a ele valores
atuais de temperatura/gases. Não há preenchimento retroativo ou interpolação.

Retenção:12.000 amostras por cenário (aproximadamente32 anos do modelo), com
contador explícito de amostras descartadas. O campo `dias_descartados` conta
registros de dias removidos, incluindo o estado inicial se tiver saído da janela.
O início da coleta original permanece registrado; dias ausentes não viram zeros.
Textos são escapados/entre aspas e recebem apóstrofo quando poderiam iniciar uma
fórmula de planilha. Valores numéricos negativos legítimos continuam numéricos.

## Validação

Em 05/11/2026, o usuário confirmou a leitura do CSV original em uma
planilha com localidade EUA. O teste no Chrome baixou o CSV diário, o
do experimento e o índice de varredura em português e inglês, inclusive
após trocar o idioma com os resultados prontos. O hash de reprodução e
o da execução dentro da retomada bateram. Um segundo leitor conferiu
as 240 linhas e 22 colunas do CSV relatado, com os mesmos valores e
vazios após a conversão. O [aceite P1.6B2-C](planejamento/voce-sozinho.md)
registra o ensaio em planilha com localidade EUA e a conferência técnica
do CSV em português.


-41 testes dirigidos: coleta, ausência, agregação, pesos por volume, retenção,
  save legado, importação corrompida, segurança CSV, aulas A/B e replay/RNG exatos.
-365/365 testes completos aprovados (207.575,6947ms), antes dos ajustes finais
  apenas na apresentação/monitoramento do Vite. Build final TS estrito:342 módulos.
- QA no IAB/4187 isolado: aula v2 entradas-ar, avanço completo de um dia em
  A/B, download por Enter, leitura independente, reload com quatro linhas e
  região da tabela navegável por Tab/setas. Console sem avisos/erros.
- Dev4173/SEMENTE-50088/D62,5 em pausa preservado; Vite agora ignora `.runtime`
  e `.sites-runtime` para não recarregar por artefatos de testes/builds isolados.

A tabela tem caption, cabeçalhos, região rotulada, foco visível e estado textual.
Isso não certifica a interface inteira. Falta auditoria real Lighthouse,
contraste, navegação completa, leitores de tela e ensaio de importação em planilha.

## Publicação confirmada

PR [#48](https://github.com/albreis/viveiro/pull/48), base #47;
fonte/tag0.36.0:0e156836bd94aaa6a408017f597b11447f065a73.
Site privado original e galeria pública publicados sem mudar as audiências.
HTTP anônimo conferiu páginas200 e27 arquivos nãoHTML por SHA256.
Na publicação real, save antigo SEMENTE-42/D2,64 em pausa exibiu zero dias
históricos e uma amostra atual. Console limpo; nenhuma leitura retroativa criada.
Ver validacoes/deploy-0.36.0.json e validacoes/publicacao-0.36.0.json.
