# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## Próximo passo concreto

Criar codex/agua-e-calor a partir da 7A para 7B1: campo tridimensional coarse de água nos poros e
temperatura, independente da umidade relativa do ar. Proposta ainda NÃO implementada: grade de cerca
de 20x8x13 amostras sob o relevo, fluxos conservativos locais de água (diferença de
saturação/capilaridade reduzida + gravidade), chuva/infiltração e evaporação com balanço explícito,
condução de calor e fonte solar exploratória. Novo controle independente de temperatura do ar;
umidade atual passa a ser rotulada como relativa do ar. Amostrar o entorno das plantas e das
formigas para leitura/resposta local. Evitar apresentar água nos poros como umidade do ar da câmara
ou resolver inundação sem modelo.

Executar o campo global uma vez por tick/família, preferencialmente com subpassos e frequência
reduzida para não tornar o ABM caro; conservar água e calor nos testes fechados, contabilizar
fronteiras e manter valores finitos. Coeficientes exploratórios e perfil inicial explícitos, sem
deduzir estado do solo de 52% de RH. Medir custo e incluir snapshots/replay e visualização
observável. Não reexecutar 6/7A já publicadas.

Depois 7B2 gases O2/CO2 e ventilação no grafo com condutância dependente de geometria, respiração e
balanços; 7C suporte estrutural; 8 RL/persistência/avaliação; novas 9–14 conforme dependências.
Referências primárias já localizadas: Richards 1931 DOI 10.1063/1.1745010
(capilaridade/gravitacional, não confundir aproximação com solver completo); PMC8611346
(experimentos de ventilação/CO2 em Acromyrmex, efeitos de difusão, vento e convecção dependentes de
arquitetura). Modelos e taxas precisam de dados para calibrar.

Dados reais continuam necessários para calibração. O Site avança no navegador; não há executor
contínuo em nuvem. JSON das colônias ainda repete habitat; persistência longa/compactação é etapa 8.
Previsões de populações maiores são computacionalmente caras, a medir na etapa 8.

