# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## Última entrega publicada — etapa 10A (0.19.0)

- Branch: codex/reservas-maternas; base: codex/perfis-biologicos (3926c8e).
-  Fonte publicada: b3713abc05e91df57a7b5b9b0d7e09e680432b0d; PR #22 sobre #21. Tag v0.19.0 preserva
  essa fonte.
-  Deploy appgdep_6ae784be9d288191be36011eba00f5a5 concluído em 01/11/2026, 18:28:27 UTC. Versão
  appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_0ab0ee8cef848191816765fc594562e4. Mesmo Site
  privado, somente proprietário, zero externos.
- Arquivo ../viveiro-0.19.0.tar.gz preservado fora do checkout.
-  Novos módulos pequenos em src/modules/maternal e src/modules/biology, com UI própria. Nenhuma
  dependência nova.
-  Revisões 1 continuam escalares; revisões 2 habilitam reservas. Legados e replay preservam sua
  versão. Próximos terrários usam a revisão mais recente selecionada.
-  Reservas, equações, custos e limites estão em docs/reservas-maternas.md. Unidades são créditos
  demonstrativos, não gramas ou kcal. Histólise só após perda das asas; prole usa proteína;
  escavação é paga antes da geometria.

### Verificações concluídas

-  Suíte completa: 183/183, duração 1.228.964 ms; log .runtime/maternal-suite.log. Sessão 48388
  concluída.
-  Proteção adicional contra reservas em perfil escalar: 14 dirigidos finais passaram. Sessão 57294
  concluída. Depois disso, apenas UI e documentação; build final aprovado.
- Integração: quatro naníticas no passo 2194; erros de reserva −3,69e−13 e terra −2,22e−15.
-  QA: RESERVAS-QA, laboratório v2, 21 °C / 80%, fundada com quatro naníticas e 16 viagens de terra.
  Checkpoint nomeado Fundação v2 · reservas QA preservado. Recarga e cinco registros maternos do
  catálogo conferidos.
-  Experimento original RESTAURADO e confirmado em pausa: seed a, dia 267, 97 adultos, 14 crias,
  duas colônias, 35 °C / 92%, aprendizado 4719 escolhas / 4607 ajustes. Aviso de recuperação
  confirmado. Próximo perfil selecionado genérico v2, sem alterar o atual.
-  Checkpoint original: manual-691625be-84fe-4949-bf1f-68490114e3db (Antes de validar perfis ·
  dia267). JSON de segurança em .runtime/before-checkpoints-dia-267.json.
-  Dev Vite PID 17752 mantido. Navegador IAB local tab 2 marcado como entrega; Site tab 1 intocado.
  Screenshot final viveiro-0.19.0-reservas.png no diretório de visualizações autorizado.

### Próximo passo concreto

Criar branch codex/ própria para 10B. Tampão, isolamento e reabertura NÃO estão feitos. Depois,
etapas 11–14. Dados por espécie continuam dependência externa real.

Git e PRs 1–21 foram conferidos; permanecem encadeados e abertos. Não integrar main, não duplicar
PRs. Main ba081a4 permanece preservada. Não repetir testes completos sem nova alteração relevante.

