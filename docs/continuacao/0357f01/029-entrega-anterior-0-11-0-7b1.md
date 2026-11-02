# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## Entrega anterior — 0.11.0 (7B1)

Branch codex/agua-e-calor; base codex/solo-granular. Versão 0.11.0 publicada. Fonte
22efc9cc06457f9749e6de792708d592020e0a09, tag v0.11.0. PR #14
https://github.com/albreis/viveiro/pull/14. Deploy appgdep_6ae707f3104c8191a874614f54d1b901,
succeeded em 01/11/2026 09:35:59 UTC; acesso só do proprietário confirmado, sem alterar audiência.
Campo 20x8x13 de água/temperatura com transporte conservativo reduzido, fontes/saídas e calor;
independente de RH, controle do ar 5–45 °C. Plantas/madeira/pedras e leitura da formiga usam
amostras próximas. Mapas em corte água/calor, tipos/estado/grade/transporte/fronteiras separados.
Modelo não resolve Richards completo, galerias inundadas, gelo, calor advectado ou capacidades
térmicas variáveis. docs/agua-e-calor.md.

Suíte completa: 111/111 em 468562 ms. TypeScript/Vite finais aprovados; oito testes de clima
direcionados passaram após adicionar verificações de balanços acumulados e acessibilidade dos
botões. Recarga preservou ar/solo/tempo; primeira pessoa mostrou a leitura local. Nenhum erro novo
no console (o registro antigo de HMR em 08:37 foi corrigido na 0.10). Não repetir testes completos
se os dirigidos passarem e não houver nova alteração do modelo.

Navegador: seed a preservada; clima inicial 53,8–63,2% nos poros e 22,3–24 °C. Mudança do ar para 35
°C manteve inicialmente solo em 22,6–24,6 °C; chuva no dia 176,7. QA pausada no dia 219,1: entorno
47,5–68,9%, 28–34,1 °C, 0,8 u. infiltrada e 4,1 evaporadas. Formiga selecionada leu 28,7 °C/61% no
entorno. Mapas alternados e screenshots viveiro-0.11.0-calor.png e viveiro-0.11.0-agua.png salvos no
diretório autorizado. Dev G PID 17752, IAB local tab 2; Site tab 1 intocado. Modelo em solo vizinho,
não umidade do ar da câmara.

Próximo passo imediato: criar branch 7B2 codex/gases-e-ventilacao sobre codex/agua-e-calor e
implementar gases/ventilação por nós, conservação e respostas locais. Erosão/perdas de estoque ainda
usam heurísticas globais; acoplar ao campo local nessa próxima etapa sem alegar calibração.

