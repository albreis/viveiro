# Selamento físico da fundação

## Etapa 10B — 0.20.0

A revisão biológica 3 acrescenta um tampão material à fundação claustral. As revisões 1 e 2 continuam selecionáveis e preservam seus comportamentos. Nenhum save anterior recebe uma entrada fechada retroativamente.

Depois de terminar o abrigo e descarregar a última viagem, a rainha retorna ao monte de terra, recolhe a carga necessária e entra novamente. Ela acomoda o material por dentro, com apoio na parede e passos limitados pela navegação existente. Não inicia a postura antes de concluir a barreira. Uma nanítica abre um furo central, leva cada carga à superfície e retorna para completar a remoção. O término da tarefa habilita a fase estabelecida. Outras operárias conseguem usar a abertura quando seu tamanho cabe fisicamente nela.

## Material e geometria

O tampão é um cilindro anular fixo, orientado pelo eixo do trecho de entrada. A construção avança das paredes para o centro; a remoção aumenta o orifício central. O volume de ar que será preenchido é estimado antes da obra por quadratura de 32 cascas radiais, 24 ângulos e oito fatias axiais. Pontos já ocupados pelo solo não recebem crédito de material. A estimativa continua discretizada, com densidade normalizada: u³ de material do modelo, não gramas ou DEM calibrado.

A mesma definição analítica da peça alimenta a colisão e a malha própria no renderer. A terra de base e a peça desenhadas juntas representam a união física; a peça não passa pela grade grosseira do terreno. A câmera de inspeção mostra a entrada pelo lado interno. A revisão do ninho invalida consultas após cada alteração.

O balanço global é:

removido + erodido = transportado + entulho solto + estoque superficial + tampões.

Estoque superficial = deposição acumulada − recolhimento acumulado. Recolher um monte transfere material existente para a formiga; fechar transfere a carga para a peça; reabrir faz a operação inversa; descarregar aumenta novamente a deposição acumulada. Esses contadores históricos não são estoques independentes. O cálculo reúne portadores de todas as colônias compartilhadas apenas uma vez.

A rainha paga 0,15 crédito materno por u³ acomodada antes da transferência, além da manutenção existente. A peça só cresce se a área estiver livre de corpos. A extração de solo compacto para desabamentos exclui os tampões já contabilizados, evitando duplicação de material.

## Navegação e trocas

A passagem é recusada se o orifício for menor que a largura corporal aproximada e sua margem. Rotas conhecidas e segmentos já iniciados respeitam esse bloqueio. Abrir uma passagem exige remoção material; não basta mudar o estado da IA.

Para fração aberta a = 1 − massa/capacidade, a difusão do trecho é multiplicada por a + (1−a)·0,08. A condutância de fluxo recebe a² + (1−a²)·0,002. Um tampão fechado é poroso, não perfeitamente hermético. O volume sólido desloca metade de seu volume em cada compartimento adjacente, com o piso numérico existente; o termo de geometria registra essa mudança no balanço de gases. Isso não resolve compressão ou o transiente físico de expulsão do ar.

Espessura 0,24 u., incremento 0,004 u³/passo, carga máxima de fechamento 0,3 u³ e fatores de troca são aproximações explícitas no catálogo. Não foram ajustados a uma espécie. O material do tampão permanece rígido até ser removido pelas formigas; desagregação por chuva e dinâmica própria de seus grãos ainda não são modeladas. Esta entrega altera gases e passagem, sem alegar isolamento de umidade do ar ou térmico calibrado.

## Verificação

- Regressão completa: 190/190 testes em 292.988 ms, antes dos ajustes finais de desenho e do endurecimento do balanço global.
- Após esses ajustes: 16 testes dirigidos aprovados, incluindo renderização analítica, importação, balanço global com portadores de colônias filhas e recuperação do futuro completo. O teste da malha do terreno também passou. TypeScript/Vite final aprovados.
- Três seeds a / RESERVAS-QA / SEMENTE-42 fecharam nos passos 2192 / 2086 / 2102 e completaram a reabertura em 3964 / 2657 / 2809, com seis / quatro / quatro viagens. Maiores deslocamentos corporais por passo: 0,100 / 0,1215 / 0,1007 u.; erros de terra menores que 3e−15. Esses são tempos demonstrativos, não durações naturais.
- No navegador, SELAMENTO-QA, preset de ar v3, 21 °C e 80%: entrada fechada com 0,15 u³ no dia 20,6; colônia estabelecida e peça totalmente removida no dia 39,3, com quatro naníticas e seis viagens de reabertura. Pontos nomeados de entrada fechada e reaberta preservados; recarga conferida e console final sem erros.
- Original do dia 267 restaurado em pausa: 97 adultos, 14 crias, duas colônias e aprendizado de 4719 escolhas / 4607 ajustes. Nenhum dado do experimento foi convertido para a revisão nova.

## Próximos itens

Etapa 11: curvas de maturação, estresse térmico e estações, com hipóteses separadas de dados por espécie. Cronologia real de fundação, mecanismos semiclaustrais e calibração continuam explicitamente pendentes. Etapas 12–14 tratam seleção de microclima, fertilidade/longevidade e relógio biológico/execução longa. Não há execução contínua no servidor do Site atual.
