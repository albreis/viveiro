# Viveiro v0.44.0: revisão de UX por tela

Nov 2, 2026 · @Everaldo Reis

O maior problema é o mesmo nas três larguras: o terrário 3D, que é o produto, aparece tarde e a página vira uma coluna de texto muito longa. Só sugestões; nada foi alterado no código.

## Prioridades

Ordenadas por impacto. As quatro primeiras resolvem a maior parte do atrito.

| # | Mudança | Onde | O que medi |
| --- | --- | --- | --- |
| 1 | Colocar o terrário 3D antes dos "Experimentos de um clique" | Todas | No desktop o terrário começa a 670px do topo, com só \~230px visíveis na primeira tela. No mobile começa a 966px, fora da primeira tela. |
| 2 | Recolher a coluna da direita em abas ou acordeões | Desktop | A coluna direita tem 4.380px de altura; esquerda e centro acabam por volta de 2.300px. Sobram \~2.300px de vazio ao lado. |
| 3 | Texto mínimo de 12px | Todas | 127 trechos de texto entre 7px e 10px (6 em 7px, 26 em 8px, 51 em 9px, 44 em 10px). |
| 4 | Fazer botões parecerem botões | Todas | "Observar entrada por dentro", "Observar crias de perto", "Abalar uma galeria vazia" e "Treinar e comparar" aparecem como texto cinza claro e parecem desativados. |
| 5 | Alvos de toque de 44px | Mobile | 69 controles abaixo de 44px de altura; a maioria tem 32px, os interruptores têm 13px e a área dos sliders tem 3px. |
| 6 | Controles do terrário numa gaveta inferior | Mobile | Os sliders do ambiente começam a 2.512px e as intervenções logo depois, longe do solo onde se deve clicar. |
| 7 | Play e velocidade fixos ao rolar | Mobile e tablet | O play e 1×/3×/10× somem assim que se rola para os controles. |
| 8 | Cartões da direita com altura natural | Tablet | Na grade de 3 colunas, "A colônia" ocupa \~730px com conteúdo em \~250px. |
| 9 | Slider "Duração diária da luz" no estilo do app | Todas | É o único slider com estilo nativo azul do navegador. |

## Desktop (1440px)

No desktop o problema é de proporção: a coluna da direita sozinha tem quase o dobro da altura do resto da página, e o terrário fica abaixo da primeira tela.

&#91;image: Desktop 1440px, primeira tela. O terrário quase não aparece, e o guia inicial cobre o topo da coluna direita.\]

&#91;image: Desktop 1440px, página inteira (4.656px). Esquerda e centro terminam na metade; a direita segue sozinha.\]

**Layout e densidade**

- **Terrário primeiro.** Os 7 cartões de "Experimentos de um clique" ocupam \~440px no topo da coluna central. Mova-os para baixo do terrário ou para um botão "Experimentos (7)" que abre uma gaveta. O terrário passa a começar a \~230px do topo.
- **Coluna direita sticky com rolagem própria.** Hoje são 11 cartões em sequência (A colônia, Fundação, Túneis, Relações, Água e calor, Ar, Aprendizado, Experimentos salvos, Vida ao longo do tempo, Um olhar adiante). Sugestão: manter "A colônia" sempre visível e agrupar o resto em abas como Colônia, Solo e ar, Dados, Laboratório.
- **Usar o espaço vazio.** Blocos de análise mais longos (Vida ao longo do tempo, Um olhar adiante, Experimentos salvos) podem ir para uma faixa de largura total abaixo do terrário, onde há \~2.300px sem nada ao lado.
- **Coluna esquerda mais larga.** Ela tem 218px; os textos de ajuda dos sliders quebram em 3 linhas e o seletor de perfil corta o nome ("Genérico · sazonal com ca…"). 280 a 300px resolve, tirando da coluna central.

**Descoberta dos controles**

- Os 4 ícones no canto do terrário (◇ ▦ ▤ ⛶) não têm rótulo. Um tooltip e um rótulo curto ao lado do ícone ativo ("Vista 3D", "Corte", "Tabela", "Tela cheia", ou os nomes reais) ajudam.
- "Ver túneis internos" e "Feromônios" são interruptores pequenos e de texto 10px, mas são as camadas mais interessantes. Vale transformá-los em botões de camada junto aos ícones do terrário.
- O guia "Uma habitante, outro ponto de vista" abre no canto superior direito, por cima de "A colônia", longe do terrário de que fala. Ancorá-lo ao terrário deixa claro o que observar.
- O seletor de "Perfil do próximo terrário" tem 17 opções numa lista só. Agrupar com `optgroup` (Genérico, Ar de referência, Sazonal, Microclima, Solo, Saúde) facilita a escolha.

## Tablet (820px)

No tablet o layout vira duas colunas (195px + 560px) e a coluna direita desce para o fim como uma grade de 3 cartões por linha. As duas coisas desperdiçam espaço.

&#91;image: Tablet 820px, primeira tela (captura feita enquanto o terrário ainda carregava). A coluna de controles tem só 195px.\]

&#91;image: Tablet 820px, cartões da coluna direita em grade. Todos ficam com a altura do maior.\]

- **Terrário em largura total no topo.** Com 560px, o terrário fica estreito ao lado de uma coluna de 195px apertada. Melhor: terrário com os 780px úteis, e Ambiente e Intervenções em duas colunas logo abaixo.
- **Cartões com altura natural.** "A colônia" e "Túneis vivos" esticam até a altura de "Fundação e vida coletiva". Usar `align-items: start` ou 2 colunas tira o vazio.
- **Play e velocidade fixos.** Ao rolar para os controles, o play e 1×/3×/10× somem. Uma barra fixa no rodapé com play, dia e velocidade mantém o relógio à mão.
- **Botões do cabeçalho.** No tablet aparecem "Modelo exploratório" e "Como funciona", mas não "Tour guiado", que aparece no mobile e no desktop. Vale manter o mesmo conjunto nas três larguras.

## Mobile (390px)

No celular a página tem 8.229px, quase 10 telas de rolagem, e a ordem separa o terrário dos controles que agem sobre ele. É a largura que mais precisa de mudança.

Ordem atual: cabeçalho, título, Novo terrário, 7 experimentos, terrário (966px), Ambiente (2.512px), Intervenções, Perfil, tempo e desempenho, e por fim os 11 cartões da direita (4.108px até o fim).

| Primeira tela | Terrário | Controles | Painel de dados |
| --- | --- | --- | --- |
| &#91;image: Mobile 390px, primeira tela: só experimentos, nenhum terrário.\] | &#91;image: Mobile 390px, terrário com a ajuda de teclado logo abaixo.\] | &#91;image: Mobile 390px, sliders do Ambiente, 1.500px abaixo do terrário.\] | &#91;image: Mobile 390px, cartão de fundação: botões cinza na mesma linha e slider azul nativo.\] |

- **Terrário no topo, experimentos recolhidos.** Os 7 experimentos empilhados ocupam a primeira tela inteira. Um acordeão "Experimentos de um clique (7)" ou uma fila com rolagem horizontal libera o espaço.
- **Controles numa gaveta inferior.** "Escolha um elemento e clique no solo" pede um clique num solo que está 1.500px acima. Uma gaveta fixa com abas (Ambiente, Intervir, Tempo, Dados) sobre o terrário deixa ver o efeito de cada slider na hora.
- **Terrário fixo ao rolar.** Se a gaveta não vier, uma versão pequena do terrário presa ao topo cumpre parte do papel.
- **Gestos.** O terrário pede "Arraste para orbitar". No celular isso disputa com a rolagem da página. Opções: orbitar com dois dedos e rolar com um, ou um toque para "entrar" no terrário. Não testei com toque real; vale conferir num aparelho.
- **Esconder a ajuda de teclado no toque.** "Na câmera: setas giram ou olham, +/− aproximam…" não serve no celular. Com `@media (pointer: coarse)` dá para trocar por "Pinça aproxima · dois dedos giram".
- **Alvos de toque.** 69 controles têm menos de 44px de altura. Os principais: botões de 32px (Tour guiado, Como funciona, ícones do terrário, 1×/3×/10×, Rainha #1), interruptores de 13px e sliders cuja área clicável tem 3px de altura. Subir para 44px, aumentando a área sem precisar aumentar o desenho.
- **Botões colados.** "Observar entrada por dentro" e "Observar crias de perto" ficam na mesma linha, sem separação, e parecem texto desativado. Precisam ser botões de largura total, um por linha.

## Em todas as larguras

- **Tamanho de texto.** Rótulos de seção, legendas dos sliders ("Seco", "Úmido"), unidades ("plantas", "u.") e o rodapé estão entre 7px e 10px. 12px como piso, e 11px só para rótulos em maiúsculas com espaçamento.
- **Contraste.** Os botões de ação secundária em cinza claro sobre o creme parecem desativados. Mesmo quando estão de fato desativados ("Observar teto com menor suporte" sem galerias), falta dizer por quê, por exemplo "disponível quando houver galerias".
- **Botões com cara de botão.** Borda ou fundo leve, como "Fazer chover" e "Observar o terrário" já têm, para todas as ações dos cartões.
- **Frases de status viram números.** Linhas como "1 colônia(s) · 1 rainha(s) · 0 alado(s) para o próximo voo. 0 u. reservadas para alados." são difíceis de varrer. O formato de "A colônia" (número grande + rótulo) funciona bem e pode se repetir nos outros cartões, com a frase explicativa recolhida em "Saiba mais".
- **Plural correto.** Trocar "colônia(s)", "rainha(s)", "intimidação(ões)" por plural calculado ("1 colônia", "2 colônias").
- **Slider da luz.** "Duração diária da luz" usa o slider azul nativo do navegador, diferente dos outros cinco sliders verdes.

## Como foi medido

Abri a prévia local (http://127.0.0.1:4173/, v0.44.0) no navegador do app com janelas de 1440×900, 820×1180 e 390×844, e medi posições, alturas e tamanhos de fonte via JavaScript. As capturas de página inteira e de primeira tela do desktop e do tablet vieram do Edge sem interface; as do celular, do navegador do app. A simulação estava rodando, então os números mudam um pouco entre as capturas. Não testei com toque real nem com leitor de tela. Nada foi alterado no código.

## Tarefas de desenvolvimento

Quatro fases e uma etapa final, da mais barata e de menor risco para a mais estrutural. Cada tarefa traz onde mexer (conferido no repositório, commit 9a2324f) e quando conta como pronta. Os números entre colchetes apontam para a tabela de Prioridades.

### Fase 1: ajustes de estilo, sem mudar layout

- [ ] **T1. Piso de 12px para texto** \[3\]
  - Onde: `src/styles/base.css` e os CSS por módulo (`colony.css`, `soil.css`, `environment.css`, `time.css`, `forecast.css` etc.).
  - Pronto quando: nenhum texto visível abaixo de 12px, exceto rótulos em maiúsculas com espaçamento (mínimo 11px). Medir com o mesmo script de tamanhos de fonte.
- [ ] **T2. Botões secundários com cara de botão** \[4\]
  - Onde: estilos dos botões de cartão ("Observar entrada por dentro", "Observar crias de perto", "Abalar uma galeria vazia", "Observar relações de perto", "Treinar e comparar").
  - Pronto quando: todos têm borda ou fundo como "Fazer chover"; um por linha; o estado desativado tem contraste distinto e um texto curto dizendo o motivo.
- [ ] **T3. Slider "Duração diária da luz" no tema** \[9\]
  - Onde: o mesmo estilo de `input[type=range]` usado em `environment.css`.
  - Pronto quando: os seis sliders têm a mesma aparência.
- [ ] **T4. Plural calculado no lugar de "(s)"**
  - Onde: `src/app/family-status.ts`, `src/app/status-view.js` e `src/app/learning-controls.ts`, usando o catálogo de `src/i18n` (plural por `Intl.PluralRules`).
  - Pronto quando: nenhum "(s)" ou "(ões)" na interface.
- [ ] **T5. Rótulos nos ícones do terrário**
  - Onde: barra ◇ ▦ ▤ ⛶ do terrário (`scene.css` e o template correspondente).
  - Pronto quando: cada ícone tem `aria-label` e tooltip; o modo ativo mostra o nome ao lado.
- [ ] **T6. Perfis agrupados no seletor**
  - Onde: seletor "Perfil do próximo terrário" (`biology.css` e o módulo de perfil).
  - Pronto quando: as 17 opções aparecem em `optgroup` por família.

### Fase 2: desktop (acima de 1180px)

- [ ] **T7. Terrário antes dos experimentos** \[1\]
  - Onde: ordem dos blocos na coluna central (`index.html` / montagem do centro) e `experiments.css`.
  - Pronto quando: em 1440×900 o topo do terrário fica a no máximo 260px do topo da página; os experimentos viram um botão "Experimentos (7)" com gaveta, ou uma faixa abaixo do terrário.
- [ ] **T8. Coluna esquerda mais larga**
  - Onde: `src/styles/layout.css:95` (`grid-template-columns: 218px minmax(360px, 1fr) 269px`).
  - Pronto quando: coluna esquerda com 280 a 300px; o nome do perfil aparece inteiro no seletor.
- [ ] **T9. Coluna direita com abas e rolagem própria** \[2\]
  - Onde: `layout.css` (`.right-panel`) e os cartões do painel.
  - Pronto quando: "A colônia" fica sempre visível; o resto entra em abas (Colônia, Solo e ar, Dados, Laboratório); o painel é `position: sticky` com altura da janela; a diferença de altura entre colunas fica abaixo de 300px.
- [ ] **T10. Faixa de análise em largura total**
  - Onde: `layout.css` e `responsive-1600.css`.
  - Pronto quando: "Vida ao longo do tempo", "Um olhar adiante" e "Experimentos salvos" ficam abaixo do terrário, ocupando as colunas da esquerda e do centro.
- [ ] **T11. Guia ancorado ao terrário**
  - Onde: `src/styles/tour.css` e o posicionamento do guia.
  - Pronto quando: o primeiro passo do guia aponta para o terrário e não cobre "A colônia".

### Fase 3: tablet (650 a 1180px)

- [ ] **T12. Terrário em largura total**
  - Onde: `responsive-1180.css` e `responsive-980.css`.
  - Pronto quando: em 820px o terrário usa toda a largura útil; Ambiente e Intervenções ficam em duas colunas abaixo dele.
- [ ] **T13. Cartões com altura natural** \[8\]
  - Onde: grade da coluna direita em `responsive-980.css`.
  - Pronto quando: `align-items: start` (ou 2 colunas) e nenhum cartão com mais de 100px de espaço vazio.
- [ ] **T14. Barra fixa de tempo** \[7\]
  - Onde: controles de play/dia/velocidade (`time.css`).
  - Pronto quando: play, dia e 1×/3×/10× ficam fixos no rodapé ao rolar, em tablet e celular.
- [ ] **T15. Mesmo cabeçalho em todas as larguras**
  - Pronto quando: "Tour guiado" e "Como funciona" aparecem em 1440, 820 e 390px.

### Fase 4: celular (até 650px)

- [ ] **T16. Terrário no topo, experimentos recolhidos** \[1\]
  - Onde: `responsive-650.css`.
  - Pronto quando: em 390×844 o terrário aparece inteiro na primeira tela; os experimentos ficam num acordeão fechado.
- [ ] **T17. Gaveta inferior de controles** \[6\]
  - Onde: novo componente sobre `responsive-650.css` e `interaction.css`, reaproveitando os painéis existentes.
  - Pronto quando: abas Ambiente, Intervir, Tempo e Dados abrem sobre o terrário; dá para mover um slider ou escolher um elemento e tocar no solo sem rolar a página.
- [ ] **T18. Alvos de toque de 44px** \[5\]
  - Onde: `responsive-650.css` e `accessibility.css` (já tem regra para 480px).
  - Pronto quando: o script de medição não acha nenhum controle abaixo de 44px; sliders com área de toque de 44px; interruptores com área de 44×44.
- [ ] **T19. Gestos do terrário no toque**
  - Onde: controle de câmera da cena e `touch-action` do canvas.
  - Pronto quando: um dedo rola a página, dois dedos giram e pinça aproxima; testado num celular real.
- [ ] **T20. Ajuda de toque no lugar da de teclado**
  - Onde: o texto "Na câmera: setas giram ou olham…" e `@media (pointer: coarse)`.
  - Pronto quando: no toque aparece "Pinça aproxima · dois dedos giram"; no desktop nada muda.

### Depois: leitura dos cartões

- [ ] **T21. Status como números**
  - Onde: cartões Fundação, Túneis, Relações, Água e calor, Ar.
  - Pronto quando: cada cartão abre com 2 a 4 números no formato de "A colônia"; a frase explicativa fica em "Saiba mais".

**Verificação ao fim de cada fase:** repetir as capturas em 1440×900, 820×1180 e 390×844 e as medições de "Como foi medido".
