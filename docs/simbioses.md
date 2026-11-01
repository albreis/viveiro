# Simbioses e mimetismo — etapa 6B

Extensão exploratória de ecologia. Pulgões são populações agregadas ligadas a plantas; lagartas são corpos individuais que podem ser encontrados, transportados e alimentados por operárias. Não há alegação de que uma única espécie de formiga execute todas as estratégias do terrário. As taxas, os custos, a compatibilidade e o prazo de vida ainda não foram calibrados.

## Pulgões e melaço

Um fluxo independente de aleatoriedade deriva da seed e seleciona até sete plantas hospedeiras entre arbustos, flores, gramíneas e árvores. A inicialização não consome o RNG das formigas. Os pulgões ocupam a base dos caules; o desenho mostra até oito corpos representativos por população, não uma malha por inseto.

A ingestão de seiva depende do número de pulgões, saúde da planta, umidade e luz atuais. Cada unidade abstrata de alimento corresponde a 1/25 da biomassa vegetal neste modelo. A planta perde a quantidade convertida: 60% entra em melaço e 40% em assimilação/metabolismo dos pulgões. A população cresce apenas com alimentação e é limitada pela biomassa da hospedeira; falta de alimentação e estresse a reduzem. A regeneração vegetal já existente continua dependente do ambiente; não é uma fonte fechada de massa ou carbono.

O reservatório de melaço de cada planta tem capacidade 1,2. Excesso e degradação são contabilizados; chuva aumenta a perda. O balanço verificável é seiva consumida = assimilação + melaço produzido, e melaço produzido = reservatórios + coleta + perdas, considerando os reservatórios iniciais. São unidades de orçamento do modelo, não concentrações medidas de açúcar.

Uma operária livre descobre hospedeiras dentro de 1,35 unidade. Aproxima-se pelo terreno e só coleta a menos de 0,42, na base do caule. Até 0,25 unidade sai do reservatório; uma parte cabe na inglúvia e o restante vira carga visível que pode ser levada ao ninho pelo comportamento existente. Não recebe alimento de uma planta distante.

Operárias com energia e coragem suficientes podem reagir a predadores próximos dos pulgões. A defesa custa energia e reduz a energia do atacante; este recua fisicamente por um intervalo curto. Fora desse contexto, um predador generalista próximo pode consumir pulgões. A proteção não é garantida. Os contadores registram ações, não indivíduos protegidos únicos.

## Lagartas de estratégia cuco

Até três larvas iniciais possuem um perfil químico semelhante ao perfil da colônia inicial, com variação pela seed. Isso é uma aproximação de compatibilidade de hospedeira; a geração do ambiente conhece o perfil, mas o agente só percebe o corpo próximo. Outra colônia pode recusá-las conforme a distância química e sensibilidade individual. O encontro exige proximidade tridimensional menor que 0,5 e caminho pelo ar; o solo bloqueia a percepção.

Uma operária aceita uma larva compatível, assume carga com prioridade de fluxo e usa a entrada conhecida/percebida e rotas locais. Na chegada ao berçário, caminha até um apoio de deposição. A adoção só é contada depois de terminar esse percurso. Corpo, normal e posição são preservados; não há transferência instantânea da superfície para o ninho. Se a transportadora morrer, a larva fica na última posição real. Um prazo de tentativa libera a carga e evita ocupação infinita da operária.

A larva adotada recebe pequenas quantidades de alimento líquido de doadoras compatíveis próximas. O alimento é debitado da inglúvia, nunca diretamente de um estoque remoto. Sua energia diminui durante espera e transporte; alimentação aumenta a reserva e aproxima gradualmente seu odor do de companheiras locais. A larva não ganha identidade de formiga nem altera genes. Esta entrega usa a estratégia cuco: não combina esse comportamento com predação da prole atribuída a outras espécies.

Limites explícitos: há uma população inicial de lagartas, com reserva inicial de 0,8 unidade e metabolismo/idade exploratórios. Não há reprodução, planta alimentícia específica, pupa ou borboleta adulta nesta etapa. Não é um ciclo completo de lepidóptero. O prazo de 35 dias é uma limitação do protótipo, não uma duração biológica validada.

## Atualização, apresentação e persistência

Módulos TypeScript pequenos em ecology separam geração, seiva/melaço, predação, visita da operária, reconhecimento, transporte, chegada e alimentação. O ambiente ecológico é atualizado uma vez por tick global e compartilhado pelas colônias. Estoques e inglúvias continuam individuais. Snapshots preservam populações, reservatórios, perfis, transportadoras, ferimentos e contadores; restore reconstitui as referências do habitat.

EcologyView desenha pulgões, gotas e larvas por instâncias. O painel mostra população agregada, reservas, coleta, adoções/recusas e alimento cedido. Observar relações de perto alterna entre hospedeiras e lagartas, inclusive no interior; a câmera muda, os corpos não. As vistas gerais restauram o limite normal de aproximação.

## Verificação e calibração

Testes cobrem geração reproduzível sem consumir RNG dos agentes, balanços de biomassa/melaço, coleta local conservativa, proteção contextual, reconhecimento bloqueado por solo, alimento debitado de doadoras, morte da transportadora e snapshots reproduzíveis. Um percurso integrado chegou da superfície ao berçário em 125 ticks, com maior passo 0,081991 unidade e afastamento máximo do apoio 0,000296; não são valores de velocidade reais.

Para calibração faltam espécie de formiga/hospedeira/pulgão/lagarta, taxas de ingestão e composição do melaço, condições vegetais, respostas a predadores, perfis químicos, probabilidade de adoção, tempo de integração, custo de parasitismo e desenvolvimento completo. A aranha do terrário usa uma política generalista abstrata; não é um dos predadores dos experimentos citados abaixo.

## Referências primárias

- [Herbert e Horn, 2008](https://pubmed.ncbi.nlm.nih.gov/19036205/): experimentos com Monomorium minimum e Aphis glycines observaram interferência das formigas sobre predadores e mudança na população de pulgões. Sustenta uma relação possível, não universal nem as taxas deste código.
- [Schifani et al., 2023](https://resjournals.onlinelibrary.wiley.com/doi/10.1111/een.13226): exclusão de formigas em campo mostra que atendimento a pulgões não implica necessariamente proteção de inimigos naturais. Motiva resultados dependentes do contexto.
- [Akino et al., 1999](https://pmc.ncbi.nlm.nih.gov/articles/PMC1690087/): ensaios e análises químicas em Maculinea rebeli/Myrmica schencki sustentam mimetismo, adoção e posterior aquisição de sinais da hospedeira. Não valida adoção por toda formiga ou alimentação remota.
