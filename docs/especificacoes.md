# Especificações recebidas

Registro das solicitações. Requisito proposto não significa funcionalidade
implementada nem comprovação científica.

## Mundo e observação

- Terrário Three.js com vegetação, água, predadores e presas.
- Fundação com indivíduos reprodutivos; crescimento da colônia.
- Entradas reais, túneis junto ao vidro e vista lateral.
- Primeira pessoa de qualquer formiga por lista ou duplo clique.
- Corpos e câmera respeitam piso, paredes e outros corpos.
- Pausa, velocidades, intervenções, replay e comparação por seed.

## Autonomia e navegação

- Sensores locais de alimento, química, contato, perigo e ambiente.
- Força de desejo, repulsão suave e prioridade para alimento/prole.
- Contato antenal persistente aciona desvio probabilístico de 30–90 graus.
- Esperar, ceder, recuar, mudar de acesso e aliviar congestionamentos.
- Movimento em X/Y/Z com apoio em uma superfície válida.
- Evitar bloqueio permanente, sobreposição e movimento sem apoio.

## Feromônios, tarefas e aprendizagem

- Reação-difusão: dC/dt = D laplaciano(C) - lambda C.
- D e lambda parametrizados por condições ambientais.
- ACO: probabilidade proporcional a feromônio e heurística local.
- Limiar de estímulo: estímulos crescentes recrutam indivíduos menos sensíveis.
- Polietismo etário, personalidade, energia e memória alteram a resposta.
- RL: alimento/sobrevivência recompensados; fome/colisões penalizadas.
- Versionar políticas, recompensas, seeds e avaliações.

## Interior do ninho

- Câmaras de estoque; resíduos e cadáveres longe da prole.
- Transporte visível de ovos, larvas e pupas.
- Trofalaxia e estômago social em rede local de contatos.
- Trocas conservam energia. Dividir metade é uma hipótese parametrizável,
  não uma regra universal de todas as espécies/situações.
- Operárias menores e soldados maiores; diferenças físicas e comportamentais.
- Reorganizar prole e estoques segundo condições locais de umidade/mofo.

## Genética e reprodução

- Genes para velocidade, tamanho, mandíbulas, fome, sensibilidade química,
  exploração e resistência.
- Herança, cruzamento, mutação e expressão física/comportamental.
- Produção de alados, gatilhos ambientais e voo nupcial.
- Acasalamento, perda observável das asas e fundação de novos ninhos.
- Reservas maternas e naníticas em espécies claustrais.
- Espécies semiclaustrais exigem parâmetros e comportamentos distintos.

## Ecologia e química social

- Pulgões fornecem melaço e podem receber proteção.
- Lagartas miméticas exploram reconhecimento químico.
- Assinaturas de hidrocarbonetos identificam colônias.
- Distância química influencia tolerância, intimidação, fuga e ataque.
- Camuflagem, território e competição entre colônias.

## Solo e atmosfera

- Escavação remove material, seguido por transporte e depósito.
- Partículas/parcelas granulares com massa, atrito, suporte e ângulo de repouso.
- Umidade espacial, água por capilaridade e infiltração.
- Erosão, obstrução, desabamento e reparo.
- Temperatura, O2, CO2, metabolismo e ventilação passiva.
- Resolução e parâmetros dependem de benchmarks e calibração.

## Experimentos e manutenção

- Distinguir caos de aleatoriedade.
- Comparar cenários próximos e medir erro/horizonte das previsões.
- Não usar conhecimento oculto da seed futura nas previsões.
- Persistir snapshots, intervenções, eventos, genótipos e versões.
- Branches separadas, arquivos pequenos, módulos por responsabilidade.
- Origem em src; bundle compilado em dist.
