# Maturação térmica da prole

## Etapa 11A — 0.21.0

A revisão biológica 4 acrescenta desenvolvimento local, nutrição parcial, variação individual e estresse persistente. Revisões 1–3 continuam usando seus modelos anteriores. O perfil fica fixado no experimento, nos saves e no replay; não se migra uma prole antiga silenciosamente.

A [síntese de Kipyatkov e Lopatina (2015)](https://doi.org/10.1111/ens.12098), consultada pelo resumo no portal da universidade SPbU, registra diferenças das respostas térmicas entre estágios, grupos e origens geográficas. Ela sustenta a necessidade de parâmetros específicos; não fornece calibração para esta implementação. O texto integral e as tabelas numéricas não foram extraídos. O modelo permanece genérico, inclusive no preset de ar de referência.

## Curvas e relógio

A resposta cardinal escolhida é r(T) = max(0, min(1, (T−10)/15, (38−T)/13)). O pico em 25 °C e os limites de 10 e 38 °C são escolhas demonstrativas, não temperaturas universais de formigas. Aquecer acima do pico reduz a taxa; ultrapassar o limite quente não aumenta o desenvolvimento.

O indicador normalizado de progresso mantém os limites anteriores: ovo até 0,35, larva até 0,9 e adulta em 1,3. Para amplitude s do estágio e duração de referência d, o avanço por passo é:

Δprogresso = s / (100d) · r(T) · r(água) · alimento · variação · (1−0,5·estresse).

As durações de referência são 0,5 / 0,8 / 0,6 dias DO MODELO para ovo, larva e pupa. Esses valores preservam um ciclo demonstrativo rápido e NÃO representam as faixas naturais de 10–14 / 10–15 / 10–24 dias recebidas de outra IA. Essas faixas continuam como hipóteses inativas no catálogo. Cem passos por dia ainda é o relógio acelerado existente; parâmetros por espécie e escala biológica coerente seguem dependências externas e da etapa 14.

A variação combina um valor determinístico por seed e identidade com o gene simbólico de eficiência. O fator inicial fica entre 0,855 e 1,155, é persistido e não consome o gerador global. Não é um modelo genético medido de crescimento.

## Sensores, alimento e estresse

A temperatura e a água são amostradas na célula da cria ou de sua portadora. Água nos poros do solo é um proxy explicitamente identificado; não é umidade relativa da câmara. A curva hídrica sobe de zero em 12% a um platô de 37–80% e cai a zero em 98%, também escolhas demonstrativas.

O fator alimentar da larva é a fração do custo coletivo efetivamente paga naquele passo, repartida uniformemente. Pagamento parcial permite crescimento parcial; falta total interrompe o crescimento larval. Os outros estágios não recebem alimentação larval extra. Não há reembolso ou criação de recursos ao perder uma cria.

Estresse acumula conforme a maior carga entre falta de alimento, inadequação hídrica e temperatura além dos limites. Há recuperação gradual em boas condições. No limite de estresse, a cria é removida, a portadora é liberada, um resíduo corporal demonstrativo é criado e a perda é contada. Não há conversão calibrada entre alimento, massa corporal e resíduos. A postura também respeita o conforto local da rainha; condições extremas interrompem a produção de novos ovos.

O painel mostra quantas crias usam o mecanismo, quantas pararam, quantas estão sob estresse, perdas e temperatura local. A cor das crias indica estresse. Coeficientes e unidades aparecem no catálogo, distinguindo aproximações ativas e hipóteses inativas. Saves incompatíveis ou incompletos são rejeitados.

## Verificação

- 19 testes dirigidos e suíte completa de 199/199 aprovados; duração completa de 268.554 ms. TypeScript/Vite finais aprovados. Após a suíte, apenas precisão numérica e pontuação do catálogo foram ajustadas e conferidas no navegador.
- Curvas limitadas, transições por estágio, alimentação zero/parcial, amostra na portadora, mortalidade sem reembolso, variação sem consumir RNG, validação de dados e futuro idêntico após restore foram testados.
- Fundação completa na seed a: quatro naníticas, tampão reaberto no passo 3310, reserva 3,15055 e erro de terra −2,44e−15. Não é tempo de uma espécie natural.
- No navegador, TERMICO-QA com preset v4: quatro crias em D23,2, com entorno de 20,9–21,2 °C. Alterar o ar para 45 °C não reescreveu as amostras locais. Após avançar a D24,4, a prole estava em 20,9–21,4 °C e quatro crias tinham estresse local; solo em 20,2–28,1 °C. O efeito combina água, alimentação e temperatura, sem atribuição causal exclusiva ao aquecimento.
- Checkpoint Prole térmica · revisão 4 QA preservado; recarga reteve o estado e o catálogo mostrou o coeficiente pequeno 0,0005 corretamente. Experimento original restaurado em pausa e confirmado: dia 267, 97 adultos, 14 crias, duas colônias, aprendizado 4719 escolhas e 4607 ajustes. Console final sem erros.

## Pendências

11B: estados sazonais, diapausa com memória e retomada gradual, além de casulos por perfil. Fundação semiclaustral continua pendente. Dados externos reais necessários incluem taxas por estágio, espécie e população, dieta, condições de câmara, amostra e dispersão. Sem esses dados, não se apresentam estas curvas como calibradas. Etapas 12–14 continuam no cronograma.
