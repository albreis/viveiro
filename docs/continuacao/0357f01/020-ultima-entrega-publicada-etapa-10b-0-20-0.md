# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## Última entrega publicada — etapa 10B (0.20.0)

Branch codex/selamento-fundacao, base codex/reservas-maternas (8ec428e, PR #22). Publicada a fonte
ba99dc59772ccb398212f90d9307708b958431fc, tag v0.20.0. PR #23 aberto sobre #22. Deploy
appgdep_6ae78c19142881918180656445fc1b22 concluído em 01/11/2026, 18:59:50 UTC. Versão
appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_001350877388819189898d73bbc133f5. Mesmo Site
privado: somente proprietário, zero externos. Arquivo ../viveiro-0.20.0.tar.gz.

-  Novos módulos pequenos em src/modules/sealing, renderer/PlugView.ts, sealing-focus.ts e
  app/sealing-controls.ts. Sem dependência nova.
-  Revisão biológica 3 habilita tampão; 1 escalar e 2 reservas abertas mantêm seus futuros. Seleção
  de novos terrários oferece a revisão 3; legados e replay não mudam de versão.
-  Terra existente vai do monte à rainha, ao tampão, à nanítica e de volta à superfície. Peça
  analítica compartilhada com colisão; gases porosos e volume deslocado contabilizados. Reservas
  financiam construção. Detalhes e limitações em docs/selamento.md.
-  Guardas de saves validam geometria, tarefa, recolhimento e balanço global após reunir todas as
  colônias, sem duplicar portadores. Extração de compacto para desabamentos exclui material do
  tampão.

### Verificações encerradas

-  Suíte final 190/190 em 292.988 ms: .runtime/sealing-suite-final.log, sessão 63171 concluída.
  Primeira execução falhou só na expectativa de latestProfile=2, atualizada para 3; não era falha do
  modelo.
-  Depois: guarda do balanço global e desenho analítico refinados; 16 dirigidos finais passaram
  (sessão 45268 concluída), incluindo três seeds e futuro exato de saves fechados. Dois testes de
  malha/render passaram antes; o teste de render também integra os 16 finais. Não afirmar suíte
  completa 192/192.
-  Build TypeScript/Vite final aprovado: 228 módulos, main 231,26 kB / gzip 82,01 kB. Chunk Three
  grande é aviso conhecido. Lockfile conserva os requisitos originais de Node ^20.19.0, sem alterar
  pacotes.
-  Seeds a / RESERVAS-QA / SEMENTE-42: fechamento 2192 / 2086 / 2102, reabertura 3964 / 2657 / 2809.
  Balanço de terra com erro <3e−15; sem saltos corporais acima de 0,13 u./passo.
-  QA visual: SELAMENTO-QA, ar de referência v3, 21 °C / 80%, fechada em D20,6 com 0,15 u³, reaberta
  em D39,3 com quatro naníticas / seis viagens. Checkpoints nomeados Entrada fechada · revisão 3 QA
  e Entrada reaberta · revisão 3 QA preservados. Catálogo com cinco coeficientes de selamento
  conferido; recarga e console final sem erros.
-  Original RESTAURADO, ACK confirmado, em pausa: seed a, D267, 97 adultos / 14 crias / duas
  colônias, 35 °C / 92%, aprendizado 4719 / 4607. Checkpoint
  manual-691625be-84fe-4949-bf1f-68490114e3db. Seletor do próximo terrário genérico v3; catálogo
  fechado, vista em perspectiva, previsão cancelada.
-  Dev PID 17752, porta 4173, em G. IAB tab 2 marcado como entrega; Site tab 1 intocado. Screenshot
  viveiro-0.20.0-entrada-fechada.png no diretório autorizado de visualizações.

### Próximo passo concreto

Abrir branch codex/ própria para etapa 11: maturação, curvas térmicas, alimentação/umidade/estresse
e diapausa por perfil. Não instalar as faixas da outra IA como dados validados. Mecanismo
semiclaustral, casulos e cronologia real ainda pendentes. Etapas 12–14 e calibração externa seguem
no cronograma.

Não repetir testes completos sem mudança que justifique. Main e PRs anteriores preservados. Não há
executor paralelo nem teste pendente.

