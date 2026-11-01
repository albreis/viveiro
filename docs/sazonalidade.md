# Memória sazonal e casulos

## Etapa 11B — 0.22.0

Os perfis genérico e de ar de referência v5 acrescentam memória reprodutiva sazonal e casulos. A variante generic-naked-demo v1 tem os mesmos mecanismos com pupa nua. Sua identidade começa na versão 1, mas modelRevision = 5 identifica a revisão dos mecanismos e dos registros oferecidos no catálogo. As referências de saves e replay continuam usando identificador e versão; perfis antigos preservam seu comportamento.

A inspiração qualitativa é o [estudo de Willot et al. (2026)](https://doi.org/10.1111/1365-2435.70359) com cinco espécies temperadas, que distingue dormência programada de simples interrupção imediata por condições ruins. O artigo não calibra esta demonstração. Condições do protocolo publicado aparecem apenas como consulta, separadas dos coeficientes ativos.

## Máquina de estados

Cada colônia conserva sua própria memória: fase, início, período ativo, persistência do sinal frio, frio acumulado, persistência do aquecimento e ciclos completos. Há quatro estados:

- Ativa: o relógio endógeno avança após a fundação. Quarenta dias do modelo encerram o período ativo mesmo em condições quentes e dias longos. Um sinal frio ou de dias curtos também pode iniciar a preparação após persistir por dois dias.
- Preparando repouso: postura e desenvolvimento larval diminuem ao longo de dois dias, até o estado dormente.
- Diapausa reprodutiva: postura e crescimento larval ficam parados. Para sair, são necessários cinco dias acumulados entre 5 e 12 °C, pelo menos cinco dias no estado e um dia persistente a 18 °C ou mais. Aquecer sem satisfazer a memória de frio não reinicia o ciclo.
- Retomada: postura, crescimento e atividade retornam progressivamente em dois dias. Uma recaída fria retorna ao estado dormente. Um ciclo concluído reinicia o relógio ativo.

Todos esses números são escolhas demonstrativas em dias do modelo acelerado, não tempos naturais aferidos. O fotoperíodo é um sinal explícito em horas, separado da intensidade solar; esta entrega ainda não cria ciclo visual de dia/noite ou calendário astronômico. A temperatura é amostrada perto da rainha, ou de outro membro vivo se ela estiver ausente; o repouso não consulta o mapa global para escolher caminhos.

## Custos e atividade

No repouso, a manutenção larval é 10% da referência e a demanda/atividade adulta e o consumo de oxigênio recebem um fator de 20%, interpolado nas transições. As operárias sem carga procuram abrigo pela navegação local, com cadência reduzida. Entregas de alimento, crias, terra e lixo continuam tendo prioridade. A mudança não move um corpo diretamente para outro lugar.

Larvas dormentes toleram o intervalo frio escolhido pelo modelo e retomam a curva térmica após a reativação. Ovos e pupas não recebem automaticamente essa proteção larval. Há custos de manutenção, riscos hídricos e alimentares e perdas por estresse; repouso não cria energia ou alimento. Não são modelados hormônios, crioprotetores ou curvas de tolerância ao frio aferidas. Envelhecimento e sobrevivência adulta ainda dependem das etapas próprias do cronograma.

## Casulos por perfil

Antes de atravessar larva → pupa, uma cria com casulo precisa pagar mais 0,02 crédito de recurso. Na fundação, usa a reserva materna proteica; depois, o estoque da colônia. Pagamento parcial é persistido e o restante não é cobrado duas vezes. Sem pagamento completo, a transição para pupa fica bloqueada.

Ao emergir, o casulo vazio vira resíduo e não devolve alimento. A variante de pupa nua não cobra nem desenha um casulo. O custo e o pequeno resíduo são aproximações; não se afirma conservação bioquímica entre créditos alimentares, seda e biomassa. O balanço de solo é independente e continua conservado.

O painel conta casulos em uso. A inspeção próxima procura uma linha de visão no ar da câmara, evitando terreno e corpos que cobrem a cria. Casulos e pupas nuas têm desenhos distintos. Dados inválidos de memória ou pagamento são rejeitados durante a recuperação.

## Verificação

A suíte completa passou: 210/210 testes em 291.383 ms, incluindo os 11 casos novos. Depois dela, somente interface e inspeção foram refinadas; TypeScript/Vite final aprovado e conferência no navegador concluída. Os ensaios cobrem memória em ambiente quente, frio acumulado, retomada gradual, pausa de postura e larvas, custos reduzidos, orçamento de gases, retorno físico ao abrigo, pagamento parcial, ausência de reembolso e futuro idêntico após restore.

Integração seed a, perfil genérico v5: fundação e reabertura no passo 3770, quatro naníticas, reserva 2,61055 e ciclo sazonal ainda zero. Os balanços de nutrientes e terra permaneceram fechados. No navegador, ESTACOES-QA teve cinco casulos ativos no dia 62,1; um ponto nomeado foi preservado e a inspeção foi conferida. O ciclo completo também foi observado: diapausa no dia 97,6 mesmo a 22,2 °C; frio acumulado 6,3/5 dias no dia 173,7 a 11,4 °C locais; retomada concluída no dia 188,8 a 20,2 °C, ciclo 1, com rainha viva. Foram preservados checkpoints de cada fase. O retorno do potencial reprodutivo não comprova nova postura: as operárias envelheceram e as reservas estavam baixas. O resfriamento do solo levou tempo; o ar configurado não substituiu a temperatura local. O catálogo da variante nua mantém os registros sazonais e exclui o custo de casulo.

Durante a QA apareceu outro terrário aberto, SEMENTE-50088. Ele foi preservado no ponto Antes da QA sazonal · SEMENTE-50088, dia 16,9; foi recuperado em pausa após a QA, com confirmação do dia, semente e perfil. O experimento antigo do dia 267 e os demais checkpoints continuam preservados.

## Continuação

Fundação semiclaustral precisa de uma entrega própria antes de declarar todos os mecanismos de fundação concluídos. Depois seguem seleção local de microclima, fertilidade/longevidade e relógio/execução longa (12–14). Calibração por espécie e população exige dados externos reais; esta entrega não os substitui.
