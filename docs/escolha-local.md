# Escolha local do abrigo e das câmaras

## Etapa 12A — 0.24.0

Perfil opcional generic-microclimate-demo@1, revisão de mecanismos 7. Herda reservas, tampão, prole térmica, casulos e memória sazonal demonstrativos; acrescenta sondagem antes da escavação e memória de câmaras das cuidadoras. Não atualiza nem reinterpreta os perfis e saves anteriores. Os coeficientes são escolhas do modelo, sem calibração por espécie.

## Sondagem física da rainha

Depois de perder as asas, a rainha explora a superfície por 160 passos. Sente água nos poros e temperatura numa profundidade rasa de 0,12 unidade. Compara três sondas à frente, com raio horizontal de 0,22; leituras em encostas além do alcance tridimensional são descartadas antes de consultar o campo climático. Explora preferencialmente até 1,8 unidade da origem, com escolhas probabilísticas e custo adicional de 0,0003 crédito/passo.

A utilidade é Q = max(0, 1 − |água − água preferida|/0,65 − |temperatura − 25|/25). A água preferida é 0,55 para a sondagem da rainha e 0,65 para as cuidadoras. São preferências demonstrativas, não ótimos naturais. Água significa saturação dos poros; não umidade relativa do ar da câmara.

A memória do melhor ponto é atualizada somente ao ocupar fisicamente uma posição válida sobre solo firme. Sondas próximas orientam o rumo, mas não entram na memória de lugares visitados. A rainha retorna por passos apoiados; após 240 passos de retorno pode adotar o ponto atual se ele for válido. Sem ponto válido, continua procurando e pode esgotar as reservas. Nenhuma posição corporal é atribuída diretamente pela escolha.

O ponto alcançado passa a ser a origem do abrigo planejado. O deslocamento e a profundidade prévios da galeria são mantidos, dentro dos limites do terrário; a escavação continua física e paga. A leitura superficial não revela o clima profundo nem garante temperatura, água, estabilidade ou sucesso futuros.

## Memória das cuidadoras

Cada operária registra até oito câmaras fisicamente visitadas, com leitura local e instante. Leituras expiram após 400 passos. O registro exige proximidade corporal ao nó e exclui entradas, frentes e lixo. Nenhuma câmara distante é amostrada para tomar a decisão.

Ao encontrar uma cria próxima, a cuidadora compara somente as leituras recentes da própria memória. Pode transportá-la até uma câmara conhecida mais favorável, usando as rotas físicas existentes. Uma câmara intermediária do mesmo tipo não substitui o destino escolhido. Sem memória válida, não inventa conhecimento sobre um berçário distante. Outros comportamentos legados ainda usam referências semânticas do ninho; esta entrega não afirma ter eliminado todos os atalhos cognitivos do simulador.

## Persistência e verificação

Sondagem, ponto visitado, leituras, custos e memória individual persistem. Versões incompatíveis, leituras impossíveis e tempos inválidos são rejeitados. Perfis anteriores não ganham esses campos nem chamadas aleatórias adicionais.

Cinco casos dirigidos passaram: preferências, fundação física completa, restore em sondagem, memória limitada aos lugares visitados, transporte da cria e destino preservado. No ensaio seed a, ar 25 °C e água inicial do solo 55%, a fundação terminou no passo 3567 com quatro naníticas; sondagem de 184 passos/185 leituras e maior passo corporal 0,06790 unidade. Balanços de solo e nutrientes permaneceram fechados. Suíte completa: 221/221 em 245.947 ms. O quinto caso, de transporte, foi acrescentado após seu início e passou junto dos cinco dirigidos finais; não se afirma execução completa de 222. TypeScript/Vite final aprovado, 259 módulos.

QA MICROCLIMA-QA, ar 21 °C/80%: 181 leituras, última leitura rasa 21,49 °C e 44,07% dos poros; ponto preservado no dia 18,2. Os valores não foram ajustados automaticamente para a preferência de 25 °C/55%. Catálogo com dez coeficientes conferido. A partir do mesmo ponto salvo, a conclusão foi observada em D31,1 com rainha viva, quatro naníticas nascidas e três operárias ainda vivas; o tampão foi reaberto em quatro viagens. Ponto Fundação concluída · microclima QA preservado e console sem erros. Uma execução mais longa chegou a D134,1 com perda da rainha; esse resultado foi preservado antes da recuperação e não é tratado como longevidade calibrada. O terrário do usuário SEMENTE-50088 foi restaurado em pausa no ponto D62,5 após a QA.

## Limites e restante da etapa 12

12B continua pendente: estoque alimentar com localização e preferência seca por câmara, distinção de materiais/textura/compactação e sua ligação explícita ao suporte. O estoque atual é agregado; não se afirma que sementes já estejam distribuídas por microclima. A física prévia já distingue água nos poros, umidade do ar, intensidade luminosa, temperatura e suporte reduzido. A etapa 12 inteira não está concluída.

O [experimento de aula](ensino/microclima-local.md) usa controles existentes e deixa explícitas as variáveis e limitações. Não é material revisado por professores ou associado a resultados de aprendizagem medidos; isso continua na futura fase P1. Dados externos reais são necessários para calibração.
