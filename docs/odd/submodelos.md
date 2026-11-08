# Mapa dos submodelos

Parte7 do [ODD](../odd.md). Esta página organiza acoplamentos e equações centrais;
a especificação numérica completa desta entrega é a do campo superficial.
Os demais blocos continuam com detalhes no código e nas notas técnicas da fonte.

## Química, decisão e memória

[Reação-difusão superficial](reacao-difusao.md): difusão conservativa,
advecção a montante e decaimento exponencial em grade X/Z. Umidade do ar modula
D/lambda; vento transporta o campo. Depósito é limitado, transporte não tem
saturação artificial. O grafo subterrâneo usa outro solver e canais de referência.

Odor de grafo: quantidades por nó; fluxos proporcionais à diferença de
quantidade/volume. Fontes dos tipos de câmara são repostas até a referência;
evaporação e emissão têm contadores. Essas marcas são parte imposta do ambiente.

ACO: peso proporcional a tau^alpha × eta^beta, com piso1e-6 nos sinais,
normalização logarítmica e mistura uniforme epsilon. Defaults da função:
alpha1,4/beta2/epsilon0,05; chamadores podem modular valores. A função amostra,
não escolhe sempre o maior. Estímulo/limiar usa S²/(S²+theta²), com limites
numéricos e fatores de idade, casta e atividade; tarefas são reconsideradas em
intervalos. Roteamento usa percepção adjacente e memória limitada de visitas.

## Corpo, terreno e escavação

Movimento combina desejo, repulsão social, contato antenal, prioridade de carga,
recuo e recuperação. Apoio é consultado no campo implícito e em obstáculos;
uma rota não autoriza teletransporte. A câmera é uma apresentação desse corpo.

Escavação remove material local, carrega e deposita; alargamento/ramificação e
reparo dependem de tarefas. Agregados representam parcelas de solo. Repouso,
umidade, composição, compactação, vão e dano modulam deslizamento/suporte por
heurísticas. Não é DEM de todos os grãos nem cálculo geotécnico calibrado.

### Acesso físico às frentes — Narbonne v3

`messor-narbonne@3` mantém porte, marcha, nutrição e calendário da v2 e
substitui a cota abstrata de equipe por contato geométrico. Uma frente é
amostrada em 13 raios locais (centro e anel) até encontrar solo efetivamente
exposto. O agente precisa alcançar o apoio, estar ao alcance do corpo e ter
espaço livre de outras formigas. Vidro e posições sem apoio não autorizam
mordidas. O deslocamento até o contato usa a navegação apoiada existente.

Cada operária em contato pode completar uma mordida a cada quatro ciclos de
trabalho, com guarda própria por tick. O bloqueio anterior de uma mordida por
projeto/tick não se aplica à v3. A ordem sequencial dos agentes continua
importando: uma mordida move o apoio consultado pelo próximo agente. Se não
há lugar, a formiga recua ou leva sua carga, em vez de escavar à distância.
Transportadoras ausentes da frente não ocupam uma vaga abstrata de escavação.
Recrutamento, tarefas, capacidade de carga, comprimento por mordida e balanços
continuam usando as regras existentes. A estigmergia opcional mantém sua
probabilidade de adesão; só sua cota `perFront` é substituída na v3.

A discretização da face, alcance de meia malha corporal e tolerâncias do
apoio são hipóteses numéricas, não medidas de mandíbula ou contato da espécie.
O material removido ainda usa o volume aproximado de cápsulas. Não foi
introduzido um multiplicador de produção, uma conversão para cm³, o relógio
físico da arena ou seus coeficientes de fadiga. Narbonne mantém a fisiologia
que já tinha no terrário; a fadiga por ações continua no perfil experimental
que a habilita. V1/v2 e perfis sem `excavationAccess` preservam suas regras.
Ver [implementação e ensaios](https://github.com/albreis/viveiro/blob/main/docs/planejamento/escavacao-acesso-viveiro.md).

## Água, calor e gases

Água do entorno poroso troca conservativamente entre células por gradiente de
saturação e um termo gravitacional reduzido. Fluxo limitado por doadora/capacidade;
chuva/lago/evaporação/plantas entram nos balanços. Calor difunde e troca na
fronteira; não é solver completo de Richards, vapor, gelo ou termodinâmica.

Gases usam uma rede de volumes e fluxo Q_ab=G_ab×(p_a−p_b+H_ab). A condutância
escala com raio^4/comprimento e abertura; pressão de entrada depende de vento.
Difusão/advecção e fronteiras transportam quantidades; respiração consome O2 e
produz CO2 em uma razão ilustrativa0,8. Células novas registram troca geométrica,
sem contar isso como ventilação. Um gargalo afeta o solver na atualização seguinte.

## Vida coletiva e reprodução

Nutrição transfere alimento de fontes finitas, reservas e inglúvias; contatos
compartilham, em vez de clonar recursos. Prole/resíduos têm transportadora e destino.
Estoques por câmara, deterioração e transporte dependem do perfil.

Fundação: voo, encontro, perda de asas, seleção/escavação do abrigo, tampão e
naníticas. Claustral e semiclaustral têm orçamentos distintos. Reservas maternas,
maturação térmica, memória de diapausa/casulos, espermateca e risco de morte são
opcionais/versionados; não somar indiscriminadamente regras de perfis antigos.
Genes/parentesco e mutações alteram fenótipos, com limites e custos demonstrativos.

## Ecologia, aprendizado e observador

Plantas respondem a água/temperatura/luz; materiais têm umidade/decomposição.
Predadores usam movimento e perseguição limitados. Pulgões/melaço, proteção,
lagartas miméticas e relações de odor/território usam regras exploratórias locais.
Não há cadeia alimentar completa ou diversidade taxonômica realista garantida.

RL opcional tem recompensas definidas pelo projeto e comparação com baselines.
Previsões copiam o mundo ou extrapolam contagens; nunca alteram o passado
observado. CSV guarda leituras reais do tick, não valores dos futuros simulados.

## Proveniência e limites

Parâmetros de demonstração, condições experimentais de referência e propostas
não implementadas são categorias diferentes no catálogo. O uso de uma equação
conhecida não transfere automaticamente seus parâmetros ou validação empírica.
A documentação deve mudar quando fórmulas, fronteiras, ordem ou perfis mudarem.
