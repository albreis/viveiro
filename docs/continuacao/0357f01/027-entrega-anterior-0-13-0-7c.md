# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## Entrega anterior — 0.13.0 (7C)

Branch codex/suporte-estrutural, base codex/gases-e-ventilacao (12260e7). Publicada no mesmo Site
privado. Fonte 25dbe03bbc63579ee9e2ba738ef2ed025b8c2a6e, tag v0.13.0, PR #16
https://github.com/albreis/viveiro/pull/16. Deploy appgdep_6ae71342c17c8191a6fd9f5bdde06fd3
succeeded em 01/11/2026 10:24:15 UTC; audiência somente proprietário preservada. Modelo em
src/modules/structure: geometria do teto no campo implícito, carga/capacidade reduzida por
água/atrito/integridade, dano, volume sólido por quadratura e desprendimento conservativo. Entulho
solto excluído da consulta do compacto. Desgaste antigo alimenta integridade/capacidade, mas
limiar0,4 deixou de causar colapso natural por si só. Agregados caem e são recolhidos pela rotina
existente. Fissuras instanciadas, painel e foco da câmera dentro da galeria. Modelo não é DEM
compacto/FEM calibrado; liberação adiada perto de corpos, sem soterramento.
docs/suporte-estrutural.md. Fonte e checkpoint enviados ao GitHub.

Dez testes dirigidos passaram. Um erro inicial era do fixture com revision1 (migração legada
recriava o ninho), corrigido para revision2 sem alterar migração. Saída de snapshot gigante foi
evitada com isDeepStrictEqual+assert.ok, preservando comparação estrita. O teste de restore foi
fortalecido para conter agregado liberado e móvel e os sete estruturais finais passaram. Suíte
completa limpa: 130/130 em 494952 ms (log local .runtime/structure-suite.log). TypeScript/Vite
finais aprovados após a câmera; nenhum teste pendente. Não repetir sem alteração relevante.

Navegador: seed a preservada; dia240,1 pausado, duas colônias/82 adultos/10 crias, 72 amostras de
teto, uma sob sobrecarga, menor margem0,95× e um desprendimento natural. Terra solta já0 no painel.
Foco inicial externo pouco útil foi corrigido para inspeção no interior com luz local. Fissura
visível, recarga persistiu métricas, sem erros novos (console contém apenas HMR antigos08:37 e09:42
já corrigidos). Screenshots viveiro-0.13.0-fissura.png e-suporte.png no diretório autorizado.
IABlocaltab2, Sitetab1 intocado. DevG PID17752.

Próximo imediato: criar branch codex/aprendizado-local sobre codex/suporte-estrutural para etapa8A.
Implementar RL pequeno com baseline, treino separado, IndexedDB/checkpoints/migrações, observação
parcial/completa e erro por horizonte. Calibração de7 permanece dependente de dados; não tratar o
proxy estrutural como cadeias de força reais. Etapas9–14 novas permanecem ao final, planejadas como
hipóteses/dados a validar.

