# Revisão do núcleo — novembro de 2026

Base: fonte publicada df92cc3/v0.29.0 e metadados fee0109. Revisão de software; não é validação científica, auditoria de todo o histórico Git ou benchmark escolar.

## Evidências

- Suíte284/284,220.126 ms, log .runtime/time-suite.log. Depois dois casos de avanço com filhas/perfil novo;18 dirigidos finais em2.919 ms. Build308 módulos. Não declarar suíte286.
- Navegador: avanço, cancelamento, orçamento/destino, reload e intervenção confirmados. Original SEMENTE-50088/D62,5 recuperado em pausa; console sem erros. Ver docs/ritmo-e-continuidade.md.
- O modo visível e o Worker chamam stepSession. Replay age antes do mesmo tick; A/B avançam juntos. Snapshots reconstruídos são cópias; malhas/câmeras não entram no estado biológico. Avanço não usa previsões para substituir passos.
- Livro de alimento/solo/água/gases e riscos fisiológicos têm testes de conservação ou contadores explícitos. Isso confere os modelos implementados; não prova que representam quantitativamente a natureza.
- Busca em src não encontrou TODO/FIXME/HACK, ts-nocheck, eval ou new Function. Isso não prova ausência de falhas ou completa migração do legado.
- Busca de padrões de chaves privadas e tokens GitHub/OpenAI na árvore rastreada: zero arquivos correspondentes entre485 arquivos da base. Sem impressão de valores. Não incluiu todos os commits/branches e não autoriza tornar o histórico público.
- npm audit --omit=dev retornou zero alertas em02/11/2026; log local .runtime/core-npm-audit.json. Resultado da base consultada naquele momento, só para dependências de produção.

## Ordem atual do passo

A implementação em colonies/update.ts começa por environment-step: incrementa tick e atualiza água/calor, paisagem e feromônio. Reúne habitat/vizinhos, ecologia/odor/território/encontros, erosão/granulares e ventilação. Congela a exposição infecciosa local; em cada colônia atualiza fertilidade, estação, prole e habitantes. Em seguida resolve predadores, mortalidade/cargas/corpos e nutrição/deterioração; coordena novos voos e registra métricas. A lista de colônias da iteração é capturada antes de fundações novas. A ordem é determinística, mas vários sistemas são sequenciais; não é uma solução física simultânea.

## Pendências reais

- Perfis por espécie, sobrevivência, solo e transporte não estão calibrados. Dados licenciados, amostras/censura e padrões reservados continuam exigências deP3.
- P1 ainda precisa de medição em hardware de entrada, PWA, revisão docente, acessibilidade quantitativa e pilotos reais. Não há30 FPS ou SUS medidos.
- P2 precisa de CLI/exportação diária comum com navegador, sensibilidade e extensões. A API de fórmulas não existe ainda.
- O Site continua privado, sem backend contínuo. P0.3 é uma publicação pública separada a preparar; a privacidade deste Site não deve mudar. DOI/Zenodo não foi emitido.
- UI/renderização legadas ainda têm arquivos grandes em JS. Os módulos novos são pequenos/TS; a migração gradual não está concluída. Fontes remotas ainda impedem afirmar cache offline completo.

## Licenças

P0.1 usa MIT só para o código original e CC BY4.0 só para documentação/imagens originais. Dependências, fontes, marcas e saves são exceções explícitas. A primeira forma de preparar a licença foi rejeitada pela revisão automática por risco de substituir o copyright do Three.js; nada daquela tentativa foi executado. A abordagem corrigida preserva o aviso de terceiro integralmente, sem substituir autoria. Não houve contorno da revisão.
