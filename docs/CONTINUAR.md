# Continuação do Viveiro

Atualizado em 15/11/2026. Trabalhar em G:/Projetos/viveiro. Ler AGENTS.md,
[cronograma](cronograma.md), [T4](planejamento/tecnico.md) e [G0–G4](planejamento/gautrais-avaliacao.md).

## Pedido ativo e fonte

O mantenedor pediu baixar o PR #134, ler a mudança de escopo, atualizar o
cronograma e continuar implementando. A branch original
`claude/project-thread-wki9y1`, head 9b1b3f8d46f3f55bc5e0dbfb17b8a12cd82a6440,
foi baixada e preservada. Nova etapa: `codex/gautrais-protocolo-reservado`,
dependente de #134. Não duplicar PRs nem atualizar a branch do usuário à força.

B7/P3.3 não depende mais de resposta dos autores. O contato de 05/11 é
opcional; não enviar novas mensagens. Gautrais 2014 passa a integrar T4.
Os demais dados adicionais permanecem opcionais. P3.1, revisão docente,
piloto com turmas e demais aceites humanos não mudaram.

## Próximo passo concreto

Congelar e enviar o [plano de partição](validacoes/gautrais-2014-plano.json)
antes de analisar novas métricas por réplica. Implementar G1 com módulos
pequenos em TypeScript, reutilizando o leitor existente. Analisar somente
as 15 réplicas ímpares de desenvolvimento. As 13 pares ficam reservadas,
com todos os seus quadros na mesma partição.

O ZIP local em `.runtime/buhl-gautrais-data-s1.zip` confere com o hash
publicado no inventário. Dados extraídos em `.runtime/buhl-gautrais-s1/S12`.
Verificar a integridade sem exibir métricas reservadas. A auditoria de 04/11
já examinou todos os grafos e publicou médias: esta reserva não é inédita.
Gautrais reanalisa Buhl 2004; sobreposição com 2001/2005 não estabelecida.
Não declarar replicação independente nem calibração concluída.

Depois de G1: G2 extrai observáveis comparáveis do simulador; G3 fixa
protocolo e predições; somente G4 abre a reserva para MAE/cobertura. Não
calcular meshedness de grafos desconectados como se fossem conectados, nem
converter coordenadas sem unidade verificada em volume. O plano não ajusta
o motor para acertar os dados. K1–K6 permanecem requisitos técnicos reais
onde a comparabilidade física exigir. T6 continua pendente depois da prioridade T4.

## Estado publicado e regras

Release 0.48.0 publicada: tag imutável no commit a39f11a10c8dfdf8d40c29f69d5c2102ee45ff42.
PRs #130–#133 mesclados; #128/#129 encerrados com branches preservadas e
planejamento útil incorporado. Narbonne v3 tem acesso físico à frente, com
morfologia/marcha/nutrição/calendário mantidos. Saves v1/v2 permanecem fixados.
Não transferir silenciosamente a fadiga da arena ao perfil do World.

554 testes e build/CodeQL/Chrome pt/en aprovados na release.
[Recibo](validacoes/release-0.48.0.json). Arena e World são motores distintos;
72 h físicas da arena não são 72 h do terrário. Lotes e tentativas anteriores
ficam preservados; não repetir rodadas caras para reorganizar documentos.

Manter dev em http://127.0.0.1:4173/ a partir de G, sem substituir saves do
usuário. O servidor foi reiniciado em 15/11; logs em `.runtime/dev-2026-11-15*`.
Testes de navegador usam contextos novos. Não iniciar outro executor da conversa.

Público: https://viveiro.ersolucoesweb.com.br/ (GitHub Pages). Não publicar
no Site público antigo nem mudar a privacidade do Site existente. O conector
do Site privado appgprj_6ae6364bc4488191b2757449ed3f7e94 retornou 404; não
recriar projeto ou retentar até o acesso ser restabelecido. O cronograma
continua excluído do build público.

Não criar tag/release por etapa nem depósito manual no Zenodo. A integração
GitHub–Zenodo já está ativa; uma próxima versão consolidada precisa de
metadados atualizados e autorização contextual. P2.8 e P5 permanecem descartados.
A retomada automática continua pausada.

Fazer testes adequados, build e conferência no navegador; commit, push e PR
automáticos em ordem de dependência. Antes de uma interrupção ou de 3%
restante da janela de uso real, enviar o progresso ao GitHub. Não contornar
limites nem inventar participantes, dados ausentes ou aceites científicos.

[Checkpoint histórico integral de 08/11](https://github.com/albreis/viveiro/blob/9b1b3f8d46f3f55bc5e0dbfb17b8a12cd82a6440/docs/CONTINUAR.md).
Esse histórico preserva ensaios, seeds, hashes e decisões substituídas; suas
instruções de aguardar e-mail ou republicar 0.48.0 não são o próximo passo.
