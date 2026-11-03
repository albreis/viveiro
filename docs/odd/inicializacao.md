# Inicialização e dados de entrada

Partes5 e6 do [ODD](../odd.md). Reconstruir a condição inicial exige versão do
modelo, seed, parâmetros, perfil e modo; seed sozinha não define o experimento.

## Fundação nova

A interface usa SEMENTE-42 e parâmetros iniciais de referência: umidade58%,
luz72%, aleatoriedade28%, repouso36° e ar24°C, antes de ajustes do perfil.
O perfil genérico atual da interface é explicitamente versionado; um World
legado sem perfil não adota automaticamente a última revisão biológica.

A inicialização fixa seed/RNG, resolve o perfil, prepara composição do solo,
IDs, contadores e coleções. Gera paisagem/relevo, ninho-base e campos; cria os
dois fundadores e, no modo de fundação, converte a cena para solo intacto e
estados de voo/abrigo conforme a estratégia. Depois cria plantas,14 fontes
externas associadas a elas e tenta colocar até dois predadores fora de obstáculos.
A rejeição de posições pode mudar a quantidade de sorteios: não usar um número
fixo presumido de chamadas ao RNG.

Reservas, fertilidade, sazonalidade e saúde são inicializadas pelo perfil. O
valor intermediário de food no construtor não deve ser confundido com uma
reserva final gratuita de uma rainha claustral. A fundação pode redefinir o ninho
e o orçamento antes do registro do estado inicial.

No modo estabelecido, mantém-se o ninho-base e o caminho biológico legado
apropriado. Não se inventa uma história natural de crescimento anterior.

## Receitas de aula e restore

Aulas versionadas preparam populações/ambiente e tratamentos A/B; a versão2
inicializa também água/calor e gases sem executar ticks. População preparada não
é prole gratuita nascida por dinâmica natural. Seed inclui a versão da receita.
Estado inicial, pergunta e tratamento são identificados no experimento.

Restore parte dos arrays, perfis e RNG do snapshot, executa migrações/validações
e recompõe compartilhamento/caches. Não refaz o mundo chamando o construtor com
a seed. Campos antigos ausentes podem iniciar na primeira atualização permitida;
não se reconstrói retrospectivamente seu histórico.

## Entradas e intervenções

- Seed textual, parâmetros numéricos, modo e referência biológica schema/id/version.
- Intervenções com tick, tipo, coordenadas e valor, na ordem em que foram gravadas.
- Receita de aula ou snapshot/checkpoint completo, quando utilizados.
- Opções de treino/previsão e informação observada, separadas do estado do mundo
  que se pretende prever. Alterar qualidade gráfica não deve alterar o modelo.

Perfis de ar de referência têm proveniência no catálogo, mas inicializam apenas
condições declaradas. Nenhuma espécie completa foi calibrada. Textura/água do
solo, temperatura do ar, intensidade de luz e fotoperíodo são variáveis distintas.

A execução atual não consulta clima, geolocalização ou bancos de laboratório
pela rede a cada tick. Clima real da localização foi retirado do escopo ativo pelo usuário em 02/11/2026. Metadados de
exportação/data do checkpoint não são fonte de ruído para os agentes.

## Reproduzir uma trajetória

Preservar versão do código/regras, perfil, estado inicial ou snapshot, estados
RNG, ticks e ordem das ações. Usar o mesmo contrato de passo fixo e domínio
numérico. Não prometer identidade entre motores/versões JavaScript arbitrários
apenas porque usam os mesmos números de seed.

Relógio, pause e orçamento alteram quando ticks são executados; não autorizam
agrupar o tempo em um único passo físico maior. A cópia de um cenário A no meio
da execução tem a história/RNG daquele instante, diferente de um terrário novo.
