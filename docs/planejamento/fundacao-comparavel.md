# T6 — Fundação claustral × semiclaustral comparável

[Índice e aceites gerais](../cronograma.md) · [Trabalho técnico](tecnico.md)

## Problema

Em execuções longas, a fundação semiclaustral chega a quase o dobro de formigas da
claustral. Parte disso é esperada: a rainha que coleta comida fora do ninho tem
uma fonte de energia a mais. Mas a comparação mistura três diferenças de regra:

1. **Reserva inicial igual.** A rainha semiclaustral começa com a mesma reserva
   materna da claustral e ainda coleta. Na natureza, rainhas de espécies
   semiclaustrais tendem a ter menos gordura e músculo de voo; a coleta compensa
   uma reserva menor, não se soma a uma reserva igual.
2. **Sem casulo.** O perfil semiclaustral usa pupa nua e não paga o custo do
   casulo; o perfil claustral atual paga.
3. **Sem estação.** O perfil semiclaustral não tem memória sazonal nem diapausa;
   o perfil claustral atual interrompe a postura no repouso reprodutivo.

Com as três somadas, a diferença de população não isola o efeito da estratégia de
fundação e exagera a vantagem semiclaustral.

## Entregas

- [ ] **T6.1 Medir a contribuição de cada fator.** Rodadas pareadas com seeds
  reservadas, mesma duração e mesmo clima, mudando um fator de cada vez: reserva,
  casulo e estação. Aceite: tabela com a diferença de adultos e de prole atribuída
  a cada fator, com variação entre seeds, antes de qualquer mudança de regra.
- [ ] **T6.2 Reserva inicial diferenciada.** Novo perfil versionado da fundação
  semiclaustral com reserva materna menor que a claustral, por um fator explícito
  registrado no catálogo como hipótese demonstrativa, com fonte qualitativa e sem
  valor calibrado por espécie. Saves e replays do perfil anterior preservados.
  Aceite: balanços de nutrientes fechados e fundação ainda viável com coleta, e
  inviável sem alimento por perto.
- [ ] **T6.3 Casulo e estação como escolhas independentes.** Permitir a fundação
  semiclaustral com ou sem casulo e com ou sem memória sazonal, usando os mesmos
  mecanismos da claustral. Aceite: é possível rodar claustral e semiclaustral com
  as mesmas regras de casulo e estação, e a diferença restante vem só da reserva
  e da coleta.
- [ ] **T6.4 Atualizar a comparação de aula.** O experimento "Duas estratégias de
  fundação" e o roteiro [fundação e energia](../ensino/fundacao-e-energia.md)
  passam a comparar as estratégias com as mesmas regras de casulo e estação, e
  explicam o custo de risco da rainha que sai. Receitas antigas continuam
  reproduzíveis com a versão anterior.
- [ ] **T6.5 Documentar e repetir T6.1.** Atualizar
  [fundação semiclaustral](../fundacao-semiclaustral.md) e o catálogo; repetir a
  medição de T6.1 com as novas regras e registrar o resultado, mesmo que a
  diferença continue grande.

## Limites

Os fatores de reserva, custos de casulo e regras de estação continuam
demonstrativos. A comparação mostra o efeito das regras do modelo, não o
desempenho de espécies reais. Calibração por espécie segue em P3.

## Referências qualitativas

- Keller, L.; Passera, L. Size and fat content of gynes in relation to the mode of
  colony founding in ants. _Oecologia_ 80, 236–240 (1989).
- Brown, M. J. F.; Bonhoeffer, S. On the evolution of claustral colony founding in
  ants. _Evolutionary Ecology Research_ 5, 305–313 (2003).
- Hölldobler, B.; Wilson, E. O. _The Ants_. Harvard University Press, 1990.
