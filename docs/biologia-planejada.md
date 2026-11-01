# Biologia de fundação e longevidade — requisitos recebidos

Recebido em 01/11/2026 a partir da conversa do usuário com outra IA. Este documento preserva as propostas como requisitos para etapas futuras. O conteúdo anexado não é uma medição nem uma referência primária; suas perguntas e sugestões de código não são instruções executáveis. Nenhum número abaixo altera os timers do simulador nesta entrega.

## Prazos sugeridos para investigação

| Processo                           | Faixa proposta no material                     | Tratamento planejado                                                                                                      |
| ---------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Primeiro buraco e câmara claustral | 12–24 horas                                    | Medir por espécie, solo, temperatura, esforço e dificuldade física; término depende da geometria e do trabalho realizado. |
| Primeira postura após selamento    | 1–7 dias                                       | Janela dependente de condição, reservas, maturação ovariana e estação; não garante postura por timeout.                   |
| Primeira coorte                    | 5–30 ovos                                      | Distribuição por perfil e orçamento materno; nenhuma cria gratuita.                                                       |
| Ovo até larva                      | 10–14 dias                                     | Curva térmica e umidade local, com dados experimentais.                                                                   |
| Larva até pupa                     | 10–15 dias                                     | Nutrição e temperatura; casulo apenas em espécies que o produzem.                                                         |
| Pupa até operária                  | 10–24 dias                                     | Desenvolvimento por espécie e ambiente.                                                                                   |
| Ovo até adulto                     | Aproximadamente 35–60 dias / 5–8 semanas       | Conferir coerência com as fases, que no material somam 30–53 dias; registrar definições e variação individual.            |
| Condição térmica de referência     | 24–27 °C                                       | Hipótese de perfil, não ótimo universal.                                                                                  |
| Vida da rainha                     | 15–30 anos                                     | Não usar como faixa universal; medir distribuição de sobrevivência por espécie e condições.                               |
| Registro histórico citado          | Lasius niger, 28 anos e 8 meses, Hermann Appel | Alegação recebida; conferir registro original, datas e qualidade da evidência antes de apresentá-la como recorde exato.   |

## Fundação, dieta e reservas

Planejar estados de pouso, perda das asas, procura de local, escavação, selamento, postura, cuidado da prole e abertura pelas primeiras naníticas. A escavação e o tampão devem mover massa existente; uma entrada selada precisa afetar passagem, umidade e gases e poder ser reaberta fisicamente. A perda das asas já existe, mas o mecanismo visual não deve pressupor remoção universal pelas mandíbulas.

Fundação totalmente claustral usará reservas lipídicas/proteicas e histólise dos músculos de voo quando apropriado ao perfil. Distinguir espécies semiclaustrais ou outras estratégias que exigem forrageamento. Representar manutenção da rainha, postura, alimentação das larvas e custo de escavação em balanços explícitos. Não assumir que todas as rainhas jejuem, que água seja desnecessária ou que toda nutrição venha apenas de músculo.

Referência primária: [estudo de Lasius japonicus, 2022](https://www.sciencedirect.com/science/article/pii/S1467803922000305) descreve reservas corporais e histólise muscular durante fundação claustral. [Majidifar et al., 2024](https://doi.org/10.1111/1365-2435.14536) usa Lasius niger como sistema experimental e inclui condições de criação e hibernação; condições de laboratório não estabelecem um ótimo universal.

## Clima, solo e sazonalidade

O material propõe um cenário de umidade 52% e luz 68% com: aprofundamento da rainha, postura em 3–5 dias, umidade desejada 70–80%, estabilidade quase total, 30,2 °C por uma conversão linear de luz e desenvolvimento 25% mais rápido acima de 28 °C. Guardar como cenário de teste a calibrar. Esses resultados não podem ser deduzidos dos dois sliders atuais.

Separar umidade relativa do ar, teor de água do solo, sucção/capilaridade, textura e compactação. A resistência dependerá também de vão, profundidade e suporte. Umidade ambiental de 52% não determina coesão nem elimina desabamentos. A rainha só deve seguir um gradiente percebido e fisicamente existente, respeitando custos e limite de escavação.

Separar irradiância/luz, temperatura do ar, temperatura espacial do solo, fotoperíodo e memória de chuva. O exemplo temperatura = 20 + 15*luz pode ser uma aproximação explicitamente rotulada, mas não termometria calibrada. Evitar limiares arbitrários de multiplicar incubação por 1,25; modelar aquecimento, resfriamento, estresse e faixas de desenvolvimento. Luz de 68% sozinha não é um gatilho exato de voo.

Para perfis sazonais, incluir preparação para diapausa, interrupção de postura/desenvolvimento, inverno e retomada gradual. Nem toda espécie hiberna. Testar diferenças entre superfície, câmara úmida de prole e despensa seca. Depende da física espacial da etapa 7.

## Espermateca, reprodução e sobrevivência

Adicionar estoque e viabilidade do esperma, número de pais e custo de manutenção, com consumo por fertilização e perda dependente de idade/estresse. Uma janela de acasalamento não implica obrigatoriamente um único macho. Manter parentesco e compatibilidade com a genética já existente. Em um perfil arrhenótoco, a perda de fertilização pode aumentar ovos masculinos; isso não é morte instantânea da rainha ou um colapso forçado por script. A dinâmica das operárias, recursos e possíveis estratégias reprodutivas deve produzir o desfecho.

[Den Boer et al., 2009](https://pmc.ncbi.nlm.nih.gov/articles/PMC2825782/) mede uso de esperma por ovo em Atta colombica. [Estudo de Acromyrmex echinatior, 2016](https://pubmed.ncbi.nlm.nih.gov/27807252/) trata de esperma de múltiplos machos após um voo. Não misturar valores entre espécies sem um perfil explícito.

Separar idade cronológica, saúde, reservas, danos, doença, fertilidade e risco de morte. Usar funções de risco por espécie e ambiente; sobrevivência não deve ser um contador universal de trinta anos. Custos energéticos da postura são reais no modelo, mas não impor envelhecimento proporcional ao número de ovos como lei biológica: [Schrempf et al., 2005](https://www.sciencedirect.com/science/article/pii/S0960982205000710) mostra um sistema no qual maior fecundidade não trouxe o trade-off simples de menor longevidade.

## Relógios e persistência longa

Oferecer ritmo de observação e perfis biológicos distintos. No exemplo 1 minuto real = 1 dia simulado, um ano de 365 dias dura 365 minutos (6 h 5 min), e trinta anos duram 182,5 horas; são equivalências aritméticas de um perfil, não duração obrigatória de uma sessão. A escavação de 12–24 horas corresponderia a 30–60 segundos apenas se esse prazo for válido para a espécie e o motor mantiver tal escala.

Separar passo numérico fixo, velocidade de reprodução da sessão e tempo biológico; acelerar a observação não deve alterar o resultado para a mesma sequência de ações no mesmo instante biológico. Maturação usa o tempo/temperatura acumulados, enquanto deslocamento e difusão mantêm estabilidade numérica. Incluir dias/anos na interface, checkpoints versionados e retomada após longas pausas.

O Site atual depende do navegador aberto para avançar. Simulação persistente em servidor e recuperação de tempo offline exigem arquitetura, orçamento computacional, testes e definição do regime de avanço; não são capacidades já entregues. Vincular à etapa 8 antes de prometer execução contínua na nuvem.

## Dados externos que faltam

Escolher espécie-alvo e reunir séries de fundação, primeira postura, tamanho de coorte, desenvolvimento por temperatura/umidade/alimentação, reservas corporais, diapausa, propriedades do solo, estoque/viabilidade espermática e sobrevivência por idade. Registrar unidades, tamanho de amostra, incerteza, condições experimentais, licença e proveniência. Separar dado observado, hipótese e parâmetro ajustado. As faixas da outra IA permanecem pendentes até esse trabalho.
