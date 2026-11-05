# Entidades, estados e escalas

Parte2 do [ODD](../odd.md). Nomes de campos abaixo correspondem ao estado
serializável, não a classes futuras propostas na arquitetura.

## Agentes e prole

- Adulto: id/colonyId, kind, posição x/y/z, angle/pitch, normal de apoio,
  speed, energy, health, age, carga alimentar e inglúvia crop. Corpo e trajetória
  usam unidades de espaço do modelo, energia/saúde são índices, age usa dias do
  modelo. Não há conversão universal para milímetros, joules ou dias reais.
- Operária: caste, role, traits, thresholds, tarefa, memórias de entradas e
  arestas visitadas, rota local, contato/recuo, carga de terra/cria/resíduo.
  Casta e genes afetam parâmetros, sem uma inteligência central distribuindo rotas.
- Genoma/parentesco e, quando habilitados, política/traço de aprendizado,
  assinatura química, máscara de odor e estado de encontro são individuais.
- Prole: id, age, kind, posição/nó, carrier, genoma/fertilização e registros
  opcionais de maturação/casulo. O estágio deriva do estado de desenvolvimento;
  crias carregadas usam a posição da transportadora nos acoplamentos pertinentes.
- Alados, rainha, macho e operárias seguem ramos diferentes da atualização.
  A rainha não é uma operária maior com o mesmo roteiro de forrageamento.

## Colônias e habitat

- Colônia: agentes, crias, food, estado colony, recursos reprodutivos, resíduos,
  founding, genética, saúde/fertilidade/sazonalidade quando definidos pelo perfil,
  contadores, colonyId e parentColonyId. Até quatro colônias no mesmo habitat.
- Cada colônia tem seu RNG e recursos próprios. Filhas compartilham por referência
  terreno, vegetação, alimento externo, predadores, clima, gases, campos e tick.
  Não se atualiza o mesmo habitat uma vez para cada filha.
- Nest: nodes com x/y/z/r/type/colonyId, links, larguras e revisão. O campo
  implícito e obstáculos definem apoio/passagem; a malha desenhada é derivada.
- Soil: remoção, cargas, depósitos, agregados, tampões, desabamentos e balanços.
  Uma parcela representa material agregado, não cada grão físico real.
- Landscape/plants/patches/predators e ecologia incluem água, biomassa, saúde,
  recurso disponível, memória de perseguição, pulgões e mimetismo demonstrativos.

## Campos espaciais e unidades

- Pheromones:40×26 valores na superfície X/Z, espaçamento0,5. Índice i=z×40+x;
  não existe eixo Y nesse campo. A quantidade/concentração é química abstrata.
  Em células iguais, a conservação pode ser conferida pela soma dos valores.
- NestOdors: quantidades por nó e canal de odor de referência, volumes e balanços
  de emissão/evaporação. Não é a mesma grade do feromônio superficial.
- Microclimate:20×8×13 células, profundidade4,2. Água é quantidade porosa em
  unidades do campo; water/capacity é saturação0–1, distinta de umidade relativa.
  Temperatura usa °C de referência do modelo, sem propriedades térmicas calibradas.
- Gases: volume, oxygen e carbon por compartimento, pressão/fluxo e balanços.
  oxygen/volume e carbon/volume são frações; a interface apresenta porcentagem.
  As quantidades não foram aferidas em litros/moles, e a pressão não é Pascal.

## Tempo, espaço e extensão

A caixa geométrica superficial ocupa aproximadamente20×13 unidades, com Y
vertical e solo abaixo da superfície procedural. Centros de agentes/intervenções
são limitados por BOUNDS: X±9,3 e Z±5,8. Raios, relevo e folgas de apoio usam a
mesma escala abstrata. Crescer a malha visual não aumenta a resolução do modelo.

Tick é inteiro;100 ticks=1 dia do modelo. A idade adulta cresce0,01 por tick;
maturação da prole pode ser modulada por alimentação, temperatura e perfil.
Há subpassos químicos/físicos locais e sistemas que só integram a cada10 ticks.
A aceleração da interface executa mais ticks; não substitui100 passos por um
passo químico de duração100.

## Sessão e observações

A sessão guarda cenário A/B, initial, intervenções/replay, running, clock e um
destino de avanço parcial. Snapshots são dados JSON, sem DOM ou objetos Three.js.
Caches WeakMap, vizinhança e malhas são reconstruídos, sem autoridade sobre o save.

O histórico do gráfico retém500 censos, normalmente separados por25 ticks.
A série diária opcional retém12.000 amostras por cenário, com início e descartes.
São fechamentos instantâneos; não médias diárias nem dados reconstruídos.
Versão do modelo, seed, perfil e ordem das intervenções fazem parte da proveniência.
