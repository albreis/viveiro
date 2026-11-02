# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## Entrega anterior — 0.14.0 (8A)

Branch codex/aprendizado-local, base codex/suporte-estrutural (83f43a2). Publicada. Fonte
fb2093069ee97f980746a987534746ee164b72b4, tagv0.14.0, PR#17
https://github.com/albreis/viveiro/pull/17. Deploy appgdep_6ae73d981e948191a4cc7cc2461c0860
succeeded em01/11/2026 13:24:52 UTC. Mesmo Site privado, somente proprietário/zero externos
confirmados. Learning em módulos TypeScript pequenos: rede6x8→1 (65 coeficientes), SARSA
semi-gradiente, políticas locais, arena/treino separado, intervenção validada. Pesos e traços
próprios por formiga; template de colônia imutável. Worker compara rede, ACO e rede sem treino em64
cenários reservados. Snapshots/replay, seletorACO/neural e leitura individual. ACO sem aprendizado
preserva exatamente o estado/RNG anterior.

Suíte completa: 139/139 em517632ms (log .runtime/learning-suite.log), nove dirigidos finais
aprovados. TypeScript/Vite final passou após última alteração SOMENTE de UI: relatório do treino
agora reaparece após recarga. Não repetir a suíte completa sem nova alteração de modelo. Sem teste
pendente.

Browser: seed a, dia267 pausado, 97 adultos/14crias/duas colônias. Neural
ativo:4719decisões,4607ajustes,recompensa -311,40; selecionada#647 com38ajustes. Treino a:policy:
rede64/64,ACO64/64,sem treino1/64; passos6,1/6,7. Troca ACO/neural preservou pesos;
recarga/relatório e primeira pessoa aprovados. Console final vazio. Screenshot
viveiro-0.14.0-aprendizado.png no diretório autorizado do Codex. Conexão CUA antiga expirou após
horas; reset e getTab2 reconectaram sem trocar navegador. DevG PID17752 e HTTP200. IABlocaltab2,
Sitetab1 intocado.

Próximo imediato: criar branch codex/checkpoints-e-recuperacao sobre codex/aprendizado-local para8B.
Implementar IndexedDB/checkpoints/migrações/compactação do habitat compartilhado;8C previsões por
observação/horizonte e benchmarks. Etapas9–14 continuam planejadas ao final. Limites científicos
de7/8A explicitados, sem calibração prometida.

