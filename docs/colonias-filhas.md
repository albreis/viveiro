# Colônias filhas — etapa 5C

A geração seguinte pode produzir alados, sair fisicamente do ninho e fundar outro abrigo no mesmo habitat. Não são criadas rainhas gratuitas nem reposicionados corpos para iniciar a filha. O ID de cada alado adulto permanece quando muda de colônia. A identificação entre ovo e adulto ainda usa IDs distintos; o genoma e o parentesco permanecem.

## Recursos e reprodução

Uma colônia com rainha saudável de pelo menos 25 dias simulados e 12 operárias pode poupar alimento para uma coorte reprodutiva. A reserva ordinária conserva um piso de 1,2 unidade; o excedente disponível é transferido para uma reserva reprodutiva. Em escassez ou crise de saúde da rainha, parte volta ao estoque ordinário. O balanço da transferência é conservativo.

Uma princesa custa 9 unidades, incluindo 8 unidades que serão sua reserva de fundação. O zangão custa 1,2 unidade. A reserva reprodutiva é debitada ao produzir os ovos; larvas também consomem alimento. Não há estoque coletivo criado para a nova colônia. Os limiares, custos, maturação, mortalidade e intervalo de 3.000 ticks entre coortes são parâmetros exploratórios, sem espécie calibrada.

Fêmeas herdam duas cópias digitais; zangões nascem de uma cópia materna sem pai. A princesa leva seu genoma e a nova rainha armazena o genoma do macho que a acompanha. As primeiras operárias da filha podem, assim, pertencer à geração genética 2. Mutações e recombinação seguem o módulo de genética.

Os dois alados amadurecem por um dia simulado, recebem estímulo climático, percorrem as galerias e aguardam decolagem na superfície. O relógio da janela é finito: um alado atrasado pode precisar da próxima chuva. A alocação da filha preserva as posições reais; o deslocamento até o novo sítio ocorre no voo. O pouso, a perda das asas, a escavação e as naníticas reutilizam a fundação 5B.

## Arquitetura

- `colonies/types.ts`: estado de cada colônia, agentes e prole agregados para consultas do habitat.
- `shared.ts`: terreno, vegetação, predadores, campos e solo compartilhados; reconstituição após restore.
- `update.ts`: ambiente integrado uma vez por tick global; biologia e estoques atualizados por colônia.
- `sexual-brood.ts`: poupança conservativa e investimento em alados.
- `sexual-motion.ts`: maturação, deslocamento físico e recuperação de bloqueio dos alados.
- `mating.ts` e `spawn.ts`: janela climática, seleção do sítio e transferência da dupla existente.
- `presentation.ts`: apresentação conjunta sem fundir os estoques do modelo.
- `FoundersView.ts` e `founder-pose.ts`: múltiplas rainhas/alados, asas e seleção pela cena.

Cada colônia mantém alimento, prole, saúde da rainha, genomas, reservas, RNG, tarefas e eventos próprios. A força social e a colisão veem todos os corpos próximos; alimento social não atravessa identidades de colônia. Os destinos e odores de referência usam a proprietária do nó. A assinatura química contínua, agressão e camuflagem ainda pertencem à etapa 6.

A escavação inicial usa IDs de entrada/frente alocados no grafo comum. Uma migração reconhece o primeiro abrigo da versão 0.6.0 e evita escavar uma cópia. O corpo sobre o solo conclui a saída mesmo que o centro lógico tenha ficado para trás; não há teleporte de correção. O limite populacional de 450 adultos mais crias considera todas as colônias.

## Verificação e limites

Há testes de investimento e poupança, restituição durante crise, ploidia e parentesco, ausência de troca alimentar entre colônias, sensores físicos compartilhados, snapshots, escavação de outro acesso e nascimento da geração 2. A química do ambiente é integrada uma única vez, independentemente do número de colônias.

A conferência de navegador usou a seed a com 68% de umidade, produção natural de alados e chuva. Os alados que perderam a primeira janela esperaram uma segunda; então surgiram duas rainhas, outro abrigo e quatro naníticas filhas. O painel confirmou mãe #103, pai #104 e geração 2 de uma operária.

Limites atuais: quatro registros de colônia por experimento, 450 adultos/crias no total, duas frentes operárias simultâneas no habitat e grafo de escavação limitado para manter o custo. A fundação da rainha não ocupa uma frente operária. O tamanho desses limites não foi validado em todos os dispositivos.

O acasalamento ainda usa uma dupla da mesma coorte. Não há escolha de parceiro de outra colônia, seleção contra parentesco, poliandria ou validação genética molecular. A reserva é um orçamento abstrato, não massa corporal medida. O voo não resolve aerodinâmica. Solo granular, selamento e clima espacial seguem para a etapa 7.

Snapshots preservam as colônias e recompõem o habitat compartilhado. O JSON ainda repete dados de habitat nas subcolônias; compactação, checkpoints longos e persistência mais robusta pertencem à etapa 8. Não declarar esta estrutura como banco de dados de longa duração pronto. A previsibilidade continua sendo a do modelo, não uma previsão calibrada de formigas reais.
