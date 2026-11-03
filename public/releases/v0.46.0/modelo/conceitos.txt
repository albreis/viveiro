# Conceitos de desenho

Parte4 do [ODD](../odd.md). Os conceitos abaixo descrevem mecanismos concretos,
sem atribuir intenção humana aos agentes ou validação científica às analogias.

## Princípios, emergência e adaptação

Princípios: decisões por percepção limitada, regras probabilísticas, recursos
finitos e balanços explicitados. Conservação numérica não implica química,
geotecnia ou fisiologia realista. O cenário combina traços de demonstração.

Emergem trilhas, congestionamentos, distribuição de tarefas, tráfego de cargas
e desfechos populacionais. Papéis, castas, fontes de odor dos tipos de câmara,
funções de recompensa, limites e regras fisiológicas são impostos pelo modelo;
não emergem todos do zero nem foram todos inferidos de dados.

Adaptação: a seleção de tarefa responde ao estímulo local e a limiares
individuais; a escolha de saída pesa sinais, heurística e exploração. Rotas
podem ser reconsideradas e gargalos podem estimular alargamento/recuperação.
A seleção de local/câmara tem custos e memórias quando o perfil a habilita.

## Objetivos, aprendizado e previsão

Objetivos implementados são coletar/entregar, alimentar/cuidar, manter o abrigo,
defender/fugir e reproduzir sob custos. Não há função global de maximização
consultada por todas as formigas nem planejamento da população futura por elas.

Aprendizado: ACO e regras locais são o padrão. Uma política pequena de RL pode
ser treinada em grafos e aplicada opcionalmente, com traços/atualizações
individuais. Recompensas e baselines são escolhas do experimento; treino em
geometrias sintéticas não comprova generalização biológica ao terrário.

A previsão é ferramenta do observador, sem acesso dos agentes ao seu resultado.
Réplicas de estado completo e extrapolação por contagens são métodos diferentes.
Intervalos exploratórios e erros em continuações sintéticas não são cobertura
empírica de uma colônia natural.

## Percepção e interação

O adulto tem alcance limitado para alimento, perigo, química e contatos. No
forrageamento superficial, alimento é procurado até2,3 unidades e três rumos de
feromônio são amostrados a0,7. São alcances de demonstração, não visão real.

O motor mantém o grafo completo para física e campos; a política de bifurcação
usa saídas adjacentes, odor próximo e memória de até64 arestas percorridas.
Conhecer uma entrada visitada não equivale a conhecer todo o mapa. A rotina
nestPath existe para ferramentas/testes, não como oráculo padrão da operária.

Contato, trofalaxia, transporte e encontros químicos exigem condições locais.
Reconhecimento por distância entre assinaturas pode gerar intimidação, fuga ou
conflito; camuflagem e mimetismo são hipóteses demonstrativas. Predadores,
plantas e simbiontes também interagem por regras próprias, não por um LLM.

## Estocasticidade e coletivos

Seed inicializa estados pseudoaleatórios. A sequência de chamadas do RNG de
cada colônia é parte da trajetória; paisagem, atributos e alguns campos usam
seeds derivadas. Não há aleatoriedade criptográfica ou ruído externo por frame.

Escolhas de direção/tarefa, reprodução e riscos usam sorteios condicionais.
Genes e diferenças de atividade/coragem/exploração geram heterogeneidade.
Mutação e seleção no modelo não comprovam evolução calibrada de uma espécie.

A colônia agrupa parentesco, recursos e odor. Filhas têm estado próprio num
habitat comum. Não há uma mensagem central dizendo a cada operária para onde ir;
há coordenação do motor para compartilhamento, limites, física e registro.

## Observação

Contagens/diário/CSV são resultados do modelo; os painéis de campo mostram
amostras ou faixas definidas, não leituras de sensores reais. Uma câmera em
primeira pessoa muda apresentação. A pessoa pode intervir e comparar A/B.
A seleção da informação disponível para previsão pertence ao experimento e
precisa ser registrada, junto com versão, seed, perfil e intervenções.
