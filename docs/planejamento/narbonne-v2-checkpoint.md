# Checkpoint de Narbonne v2

Trabalho pausado a pedido do mantenedor. A base é a main `248242e`,
do PR #123. O perfil de referência publicado é `messor-narbonne@1`.

## Implementação em rascunho

- `messor-narbonne@2` versiona alados com comprimentos de referência
  exploratórios de 11 mm para rainha/princesa e 8 mm para macho. O
  catálogo de Baroni Urbani aponta uma descrição de rainha na p. 31,
  sem medidas confirmadas para os alados de Narbonne.
- Marcha das operárias em galerias usa temperatura local, inclinação de
  apoio e carga. Os multiplicadores de parede e carga de solo são
  hipóteses. Buhl mediu marcha livre fora do disco.
- A operária de cuidado retira uma porção do estoque e pode entregá-la
  à rainha na mesma câmara. A v2 desativa a troca líquida genérica.
  A alimentação da prole ainda usa o orçamento coletivo existente.
- Calendário mediterrâneo demonstrativo de 80 dias do modelo. A
  sessão começa no outono. A postura abre na primavera, a produção
  de alados tem janela própria e o voo continua dependente de chuva
  recente. O repouso reduz a manutenção da rainha. A inspiração é
  qualitativa, a partir de [Cerdan](https://dictionnaire-amoureux-des-fourmis.fr/M/Moissoneuses/Cerdan-Insectes1989-Messor.pdf).

O TypeScript e o build Vite passaram antes da pausa. A etapa aguarda
teste funcional, comparação de curvas e revisão em navegador.

## Retomada

1. Garantir que a cuidadora que retira a porção na despensa roteie
   imediatamente para a rainha e que a morte da portadora contabilize
   a porção como resíduo. Verificar balanço, distância e replay.
2. Testar a fundação padrão de duas formigas até a primeira postura e
   reabertura. Testar as janelas de postura, alados, voo e recuperação
   de save. Mostrar a janela sazonal atual na interface.
3. Rodar no CLI pares de fundação `messor-narbonne@1` e
   `messor-narbonne@2` com as mesmas seeds por pelo menos 60 dias.
   Comparar dias até a primeira postura, curvas de adultos/prole e
   estoque. Se necessário, coletar a série de terra removida no motor.
   Conferir o disco de Buhl contra uma amostra arquivada antes de
   interpretar as curvas 3D. O benchmark roda em protocolo separado.
4. Rodar suíte completa e Chrome, atualizar o PR existente e publicar
   depois do aceite técnico.
