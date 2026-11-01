# Odores, encontros e território — etapa 6A

Protótipo exploratório. Os quatro canais químicos são números normalizados, não hidrocarbonetos identificados nem concentrações medidas. Nenhuma taxa ou limiar foi calibrado para uma espécie. A etapa 6B acrescentará pulgões e lagartas; esta entrega implementa a base dos encontros entre colônias.

## Reconhecimento e contexto local

Cada colônia recebe pela seed e pelo genoma materno um perfil p com soma 1. O corpo expõe b = (1-s)p + s*m, onde m é uma máscara temporária e s sua intensidade. O observador compara a distância euclidiana d = sqrt(sum((p_i-b_i)^2)) com 0,095/sensibilidade. Esse critério pode aceitar um visitante disfarçado ou rejeitar uma companheira tratada. Identidade, genoma e parentesco não mudam com o odor.

Os encontros usam índice espacial, alcance 0,65 e teste de caminho pelo ar; não atravessam solo. Ameaça considera vizinhas reconhecidas ou rejeitadas, energia, coragem, proximidade física do próprio abrigo e marca territorial na célula atual. A contagem de vizinhas também exige contato pelo ar. Não há busca global por inimigos. Primeiro há postura; contato persistente pode produzir recuo ou dano. Saúde física é separada da energia: alimento não apaga ferimentos. Saúde zero remove o agente e encaminha seu corpo para o sistema de resíduos. Uma rainha morta não produz prole.

Uma dupla é processada uma vez por tick, com intervalos de resposta. O número de contatos perde efeito após um período sem encontro. A postura não impõe velocidade zero permanente: o recuo usa a mesma consulta de apoio contínuo, passo limitado e normal do terreno da navegação. O modelo não resolve forças de mandíbula ou biomecânica de combate.

## Marcas e camuflagem

Cada colônia possui um campo superficial de 40 x 26 células. Operárias externas depositam marca; difusão e evaporação reutilizam o integrador conservativo de reação-difusão. O balanço registra depósito, massa presente e evaporação. Umidade altera a taxa exploratória; não há concentração física calibrada. O gráfico colorido aparece na opção Feromônios e acompanha a altura real da superfície. Verde, ocre, azul e amarelo identificam as colônias; a legenda mostra quais existem.

Uma operária vazia, faminta e exploradora pode detectar outra entrada a menos de 1,3 unidade e passar tempo adquirindo seu odor. A aproximação é local e probabilística. O revestimento custa energia, expira e se dissipa gradualmente. A rota interna usa apenas arestas adjacentes e odores locais do abrigo visitado, sem consultar um caminho completo. Ao alcançar fisicamente a despensa, retira no máximo 0,35 unidade do estoque existente, preservando um piso de 0,2; o mesmo valor aparece na carga. Não há alimento criado pelo roubo. Depois retorna à entrada estrangeira e recupera a memória do próprio acesso. Prazo ou saúde baixa acionam a retirada.

A estratégia de infiltração é uma hipótese de comportamento para exploração do simulador. A transferência de odor pelo solo tem evidência experimental; isso não demonstra que todas as espécies planejem roubos desse modo. A máscara também pode permitir trofalaxia com outra colônia, sempre conservando a quantidade transferida e exigindo contato físico.

A ferramenta Odor estranho aplica um tratamento temporário somente ao corpo superficial próximo do clique. Ela registra a intervenção no replay e permite observar rejeição entre companheiras. Anel âmbar indica máscara; vermelho indica reação ativa. Sem corpo próximo, não altera agentes distantes.

## Estrutura e persistência

Os módulos pequenos em social-chemistry separam perfil, campo territorial, encontro, deslocamento, revestimento, chegada e rota de infiltração. O loop global atualiza campos e encontros uma vez; o loop individual executa a resposta apoiada. Estoques continuam pertencendo à colônia; um registro em WeakMap permite debitar a proprietária visitada sem serializar ciclos de objetos. Restore recompõe esse registro. Perfis, máscaras, danos, campos, contadores e tarefas são preservados no snapshot.

TrailView e ChemicalContactView mantêm a renderização fora do modelo. chemical-status apresenta contagens acumuladas, não taxas ou probabilidades observadas. O limite de quatro colônias e 450 adultos/crias continua vigente. A política de encontro não representa diplomacia institucional ou guerra estratégica.

## Verificação e dados necessários

Testes cobrem seed/perfil, desaparecimento da máscara, contato bloqueado por solo, intimidação/dano/recuo, apoio e limite de passo, balanço territorial, trofalaxia sob disfarce, restore reproduzível, revestimento local e transferência de estoque apenas após chegada física. O teste integrado percorre entrada, despensa e saída estrangeira sem teleporte e confirma a carga e a restauração da memória doméstica.

No navegador, a seed a com duas colônias produziu espontaneamente 20 intimidações, 14 recuos e 14 ataques até o dia 107,9. O tratamento na operária #305 foi registrado e apareceu com anel na superfície. Esses números descrevem essa execução do modelo e não são frequências biológicas validadas.

Para calibrar: espécie-alvo, perfis químicos medidos, variabilidade dentro/entre colônias, curvas de aceitação por composto e dose, transferência pelo solo, duração da máscara, dependência de dieta/idade, velocidades e desfechos de encontros observados. A distância euclidiana não reproduz necessariamente reconhecimento assimétrico por presença de compostos. Dieta ainda não modifica o perfil.

## Referências primárias

- [Brandt et al., 2009 — The scent of supercolonies](https://pmc.ncbi.nlm.nih.gov/articles/PMC2775022/): alterações experimentais de hidrocarbonetos podem provocar agressão, com resposta dependente da colônia, em Linepithema humile.
- [Guerrieri et al., 2009 — Ants recognize foes and not friends](https://pmc.ncbi.nlm.nih.gov/articles/PMC2690455/): resultados em Camponotus herculeanus mostram limites de um simples reconhecimento simétrico por semelhança. O critério numérico deste protótipo é uma aproximação.
- [Bos, Grinsted e Holman, 2011 — Wax On, Wax Off](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0019435): experimentos químicos e comportamentais em Camponotus aethiops sustentam transferência indireta de sinais pelo solo do ninho. A política oportunista de infiltração é uma inferência de projeto, não um resultado medido desse estudo.
