# Versões

## Em desenvolvimento — navegação local (4B)

- Política de saída separada do mundo físico, com observações adjacentes.
- Memória de até 64 arestas efetivamente percorridas e custos aprendidos.
- Odores internos com fontes, difusão e evaporação contabilizadas.
- Retorno por entrada já visitada ou percebida localmente.
- Propostas de frentes feitas por operárias sob estímulo de densidade local.
- Roteamento global removido das decisões dos agentes.


## Em desenvolvimento — campos e tarefas (4A)

- Difusão, evaporação e advecção conservativas com subpassos estáveis.
- Escolha ACO por amostragem, com exploração residual.
- Limiares individuais, estímulos locais e modulação por idade/casta.
- Trofalaxia bloqueada por paredes de solo.
- Correção de destinos após desvios e regressão de retorno à escavação.
- Casos matemáticos, regressões e build validados; navegador ainda pendente.


## Em desenvolvimento — organização da colônia

- Trofalaxia conservativa, reserva social e alimentação pela despensa.
- Transporte físico de ovos, larvas, pupas e resíduos.
- Castas e traços individuais reproduzíveis; papéis ligados à idade.
- Proteção da entrada e visualização de cargas e estágios.
- Recuperação de posições antigas junto ao tronco e nova rota após tarefas internas.
- 29 testes e build aprovados; conferência visual pendente.


## Em desenvolvimento — túneis vivos

- Frentes de escavação, transporte e depósitos de terra.
- Erosão exploratória e remoção de bloqueios por viagens reais.
- Saída pela borda da entrada, sem procurar apoio no ar.
- Balanço de material, retomada após recuo e testes de recuperação completa.
- Malha do terreno calculada em Worker.
- Inicialização, migrações e previsões separadas em módulos pequenos.


## Em desenvolvimento — recuperação nas laterais

- Busca de caminho apoiado e desvio lateral durante transições bloqueadas.
- Detecção de oscilação, tolerância de chegada e escolha de outros setores da parede.
- Regressão longa de saída do ninho e travessia de um poço.
- Projeto transferido para G:\Projetos\viveiro; dev mantido em segundo plano.
- Verificação visual final pendente por limite de uso da ferramenta de navegador.

## 0.3.0

- Terreno arredondado por campo implícito e malha ajustada à mesma superfície.
- Movimento tangente, apoio contínuo e limite de deslocamento por passo.
- Regressões para saltos, afastamento do solo e limites do vidro.
- Forças sociais locais, contato antenal, carga, recuo e alargamento experimental.
- Apoio no piso/parede e câmera orientada pela superfície.
- TypeScript estrito na navegação e controles de câmera; módulos legados isolados.
- Bundle Vite e CSS/renderer separados por responsabilidade.
- Cronograma, especificações e arquitetura registrados.

## 0.2.1

- Duplo clique em uma formiga visível entra em primeira pessoa; Esc retorna à câmera externa.
- Seleção considera a oclusão pelo solo e uma tolerância para organismos pequenos.
- Pernas acompanham a distância percorrida; a pausa congela o movimento.
- Operárias e aranhas contornam a água em vez de insistir na direção bloqueada.
- Estado de pausa preservado ao recarregar e indicação explícita para retomar.

## 0.2.0

- Cavidades reais no solo, entradas, túneis e câmaras junto ao vidro.
- Operárias percorrem o subsolo para entregar alimento e sair do ninho.
- Vista lateral e câmera em primeira pessoa pela lista de formigas.

## 0.1.0

- Primeiro terrário 3D autônomo e previsão por cenários.
