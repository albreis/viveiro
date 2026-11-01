# Continuação do Viveiro

Trabalhar em G:\Projetos\viveiro. Ler AGENTS.md e docs/cronograma.md.
O usuário autorizou continuar até finalizar o cronograma, com retomada horária nesta conversa após limites. Automação continuar-cronograma-do-viveiro permanece ativa. Não criar executores concorrentes nem contornar cotas ou aprovações.

## Entrega corrente 5B

- Branch codex/voo-e-fundacao, base codex/genetica-e-heranca.
- Versão 0.6.0 implementada; commit, PR e publicação devem ser conferidos no Git/Site antes de repetir operações.
- PRs #1 a #7 já estavam abertos e encadeados. PR desta entrega deve ter base codex/genetica-e-heranca e ser o #8; não duplicar se já existir.
- Última publicação confirmada antes desta entrega: 0.5.0, fonte e149fe8944b315bbff078a4f1be7a471c3297145, tag v0.5.0.
- Site privado: https://viveiro-caos-formigueiro.everaldodev.chatgpt.site
- Projeto Site: appgprj_6ae6364bc4488191b2757449ed3f7e94. Preservar público owner-only.

## Implementado

Fundação em pequenos módulos TypeScript de src/modules/founding: alados, janela úmida após chuva com luz como proxy térmico, encontro aéreo, pouso, perda das asas, primeira boca/poço/câmara escavados, viagens reais com terra, reserva materna finita e quatro naníticas menores. Começo sem estoque coletivo. Novas posturas dependem de alimento coletado. Sem selamento físico do acesso ainda; coeficientes e tempo exploratórios (docs/fundacao.md).

Destinos por função em colony/rooms.ts permitem uma única câmara inicial. Saves antigos mantêm o ninho estabelecido e o replay registra o tipo de início. Fixture explícita de ninho estabelecido mantém as regressões antigas; oito testes específicos percorrem a fundação normal.

Foram corrigidos dois gargalos durante a fundação: entrada em poço ainda raso e aproximação/deposição oposta ao teto do poço. A fábrica de agentes foi separada para reduzir World a menos de 250 linhas.

## Validação

65 testes passaram na suíte completa (332590 ms). Fluxo antigo: 31 saídas, maior estagnação 113 ticks. Apoio antigo: gap máximo 0,01045. Fundação: três seeds no teste completo, 16 viagens por rainha, quatro naníticas e gap máximo <=0,0113; oito seeds também ensaiadas durante desenvolvimento. TypeScript/build e navegador aprovados. Após separar a fábrica, os 15 testes direcionados de genética/fundação e o build passaram novamente.

QA IAB localhost: seed SEMENTE-42, umidade 68, parado no dia 21,5 com rainha e quatro naníticas. Primeira pessoa e retorno conferidos. A aba pode ser recarregada pelo HMR; não apagar experimentos do Chrome do usuário. Screenshot final deve ser salvo no diretório de visualizações autorizado antes de concluir.

## Próximo passo concreto

Concluir commit/push/PR e publicação privada da 0.6.0 caso ainda pendentes. Depois criar codex/colonias-filhas para 5C: produção de princesas/zangões pagos pelo estoque, recursos/genéticas separados por colônia, novo voo e fundação das filhas. Não declarar a etapa 5 inteira concluída antes disso.

Depois: 6 simbioses, odor e território; 7 granular, capilaridade e gases; 8 RL, persistência e avaliação. Calibração por espécie depende de dados reais externos; não apresentar protótipos como modelos calibrados.

## Ambiente e publicação

Dev Vite http://127.0.0.1:4173/ no G, PID 13196 na última conferência, logs .runtime/. Não encerrar. Arquivos atômicos e já formatados, para evitar cache de módulo vazio no HMR. Usar push só das refs desta entrega e tag específica; push --all foi rejeitado em uma revisão anterior por escopo amplo.

Seguir a skill Sites: abrir o helper de source no HEAD atual, credenciais só em memória/stdin, arquivo G:\Projetos\viveiro-0.6.0.tar.gz fora do checkout. Atualizar estas linhas com SHA, PR e publicação exatos após sucesso. Main e branches anteriores preservadas; PRs permanecem para revisão.
