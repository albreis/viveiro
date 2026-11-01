# Aprendizado local — etapa 8A

Política neural opcional para escolher a próxima saída do grafo. ACO continua disponível; o modo desativado preserva exatamente o comportamento anterior. Biologia, contato, apoio físico e limites de movimento continuam no motor existente. Este experimento não é um cérebro biológico calibrado nem uma prova de desempenho superior no terrário.

## Rede e observações

A rede tem seis entradas, oito unidades tanh e uma saída escalar Q(s,a), com 65 coeficientes. Cada candidata a saída recebe apenas sinal químico local, visitas recentes, indicação de retorno, objetivo visível, conforto de ar próximo e presença de carga. Não recebe posições globais, caminhos completos ou identificadores de nós como entradas.

O modelo inicial treinado fica como referência imutável por colônia. Na primeira decisão neural, cada formiga copia seus próprios pesos. Experiências posteriores atualizam apenas aquela formiga. Memória de transição, pesos e contadores são individuais; os totais do painel não são sensores dos agentes. Colônias atuais recebem cópias independentes ao aplicar a política. Novas colônias não herdam automaticamente pesos aprendidos de suas fundadoras.

## Atualização temporal

É uma aproximação de controle on-policy por semi-gradiente SARSA:

δ = r + γ Qθ(s',a') - Qθ(s,a).

θ ← θ + α clip(δ,-1,1) ∇θ Qθ(s,a).

A rede usa saída linear, gradiente de tanh, pesos limitados a ±5 e atualização do alvo terminal sem bootstrap. γ é 0,95. Passo de aprendizado: 0,015 no treino e 0,005 no terrário. Escolha epsilon-greedy com 12% de exploração no treino, 2,5% na avaliação e 5% no terrário. Esses números são parâmetros de engenharia exploratórios.

No motor real, tempo, fome e contato persistente acumulam custo; recuar tem penalidade e alcançar o objetivo da rota recebe recompensa. Morte encerra a transição com penalidade e o estado daquele indivíduo é removido; não transmite a experiência aos sobreviventes. Não se afirma aprendizado biológico após a morte. O modelo aprende seleção de saídas, sem substituir as regras metabólicas ou a navegação apoiada por uma rede.

Quando o modo neural está ativo, a decisão considera as saídas adjacentes disponíveis em vez de forçar um caminho completo da memória. O módulo usa o mesmo deslocamento físico, sensores e mecanismo de desvio já existentes. Trocar de modo não teleporta agentes. Ao desativar, pesos individuais são preservados e a transição parcial é descartada; aplicar outro modelo reinicia os pesos individuais.

## Treino e comparação

Um Worker separado cria árvores pequenas por seed, com pistas químicas ruidosas, perigos locais e tarefa de buscar alimento e voltar. Encontrar comida vale +1, entregar +3, andar custa e exceder 100 passos encerra o episódio com penalidade. É um ambiente de treino abstrato; não replica a colisão 3D, gases, fome ou todas as tarefas da colônia real.

São 1.200 episódios por padrão, seguidos de 64 cenários reservados. Rede treinada, ACO e rede sem treino usam as mesmas seeds de topologia e recompensas. Sequências de ruído podem diferir conforme as ações; a amostra não é uma demonstração estatística de superioridade. O ACO é amostrado uma única vez por decisão no comparador.

Em uma medição isolada nesta máquina, as seeds VIVEIRO-RL-1/2/3 demoraram aproximadamente 298/353/407 ms. Rede e ACO completaram 64/64 entregas nas três; a rede sem treino fez 3/64, 0/64 e 11/64. Passos médios da rede: 5,75/6,56/5,63; do ACO: 6,03/7,09/5,78. São resultados do ambiente abstrato, sem equivalência automática com o formigueiro.

## Interface e persistência

Treinar e comparar não altera o terrário. Aplicar política registra uma intervenção validada com pesos, seed e relatório, tornando o replay reproduzível. O seletor permite voltar a ACO. Rede/castas usam somente dados locais durante a execução; o Worker não envia comandos de movimento aos indivíduos.

O painel conserva a comparação do modelo inicial após recarregar. A formiga selecionada mostra seus ajustes individuais, inclusive em primeira pessoa. No QA da seed a, dia267: duas colônias, 4.719 decisões, 4.607 ajustes, recompensa acumulada -311,40 e a operária selecionada com 38 ajustes. A comparação a:policy fez 64/64 tanto na rede quanto no ACO e 1/64 sem treino; médias de 6,1/6,7 passos. Troca ACO/neural e recarga preservaram os pesos. Não são resultados de calibração ecológica.

Snapshots guardam pesos e transições e restauram o mesmo futuro. A persistência continua em localStorage nesta entrega. IndexedDB, checkpoints extensos, migrações próprias e recuperação longa são 8B; avaliação de previsões por observação/horizonte e desempenho são 8C. Nenhuma execução continua na nuvem quando o navegador está fechado.

## Validação e limites

139/139 testes aprovados na suíte completa em 517632 ms. Nove testes de aprendizado cobrem reprodutibilidade, redução de erro, limites numéricos, comparação reservada, independência individual, feedback, baseline idêntico sem consumir RNG, intervenção validada, movimento apoiado/limitado e restore determinístico. TypeScript e Vite finais aprovados. Navegador verificou Worker, aplicação, contadores individuais, primeira pessoa, alternância e recarga; console sem erros na conferência final.

SARSA não possui aqui uma prova de convergência para esta rede não linear ou para o ambiente multiagente não estacionário. Faltam avaliação extensa no terrário 3D, múltiplas sementes/intervalos de incerteza, análise de catástrofes e transferência de domínio. Pesos limitados e testes de finitude não demonstram inteligência ou adequação biológica. O relatório inicial não mede as redes individuais já adaptadas posteriormente.

## Referências

[Sutton e Barto — Reinforcement Learning: An Introduction, segunda edição](http://incompleteideas.net/book/the-book-2nd.html), capítulo sobre controle on-policy com aproximação, descreve semi-gradiente SARSA. A implementação desta etapa é pequena e própria, sem bibliotecas de ML externas.

[Watkins e Dayan, 1992 — Q-learning](https://doi.org/10.1007/BF00992698) é uma referência de controle por diferenças temporais. A garantia tabular desse trabalho não é transferida para a rede não linear usada aqui. Não há parâmetros de cognição de uma espécie medidos nesta etapa.
