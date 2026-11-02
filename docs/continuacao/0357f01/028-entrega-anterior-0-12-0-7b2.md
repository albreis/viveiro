# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## Entrega anterior — 0.12.0 (7B2)

Branch codex/gases-e-ventilacao, base codex/agua-e-calor. Fonte
0e385cc10855b974581dcc3ed894bf3c95fbf4cc, tag v0.12.0, PR #15
https://github.com/albreis/viveiro/pull/15. Deploy appgdep_6ae70e5a53248191a26b2084df60fb48
succeeded em 01/11/2026 10:03:19 UTC; mesmo Site privado, somente proprietário confirmado. Módulos
pequenos em src/modules/ventilation: tipos, rede, estado/balanços, pressão, transporte, respiração,
sensores e update. O₂/CO₂ por nós, vento e empuxo aproximados, obstrução por entulho. Campo global
único; snapshots e RNG independentes. Sensores ACO só em saídas próximas (≤1,2); custo de energia
exploratório nas operárias. Desgaste/estoque usam água e temperatura locais. README, changelog e
docs/gases-e-ventilacao.md atualizados. Novas etapas 9–14 continuam ao final do cronograma.

Validação: 12 testes dirigidos de gases/integração aprovados; TypeScript/Vite aprovados. Primeira
suíte completa teve 122/123 em 541580 ms: único erro foi estoque inexistente em fundação sem
câmaras. Corrigido com guarda de armazenamento real; teste original da falha passou isoladamente.
Segunda suíte completa limpa: 123/123 em 448552 ms, TypeScript/Vite finais aprovados. Nenhum teste
pendente; não repetir sem nova alteração relevante.

Navegador: seed a mantida, ar 35 °C, RH92%, repouso20°. Vento 1,5 por teclado e simulação continuada
até dia229,8, depois pausada. Duas colônias/87 adultos, três entradas. Ar: O₂8,47–20,86%,
CO₂0,07–9,98%; consumo0,128u. São resultados exploratórios sem calibração. Recarga conservou
campo/vento/tempo; diagrama e leitura local observados. Screenshot viveiro-0.12.0-ar.png no
diretório autorizado do Codex. Console tem apenas registros antigos de HMR: granular08:37
(corrigido0.10) e intervene09:42 (corrigido para intervention antes do QA). Conferência final:
nenhum erro novo. Primeira pessoa mostrou O₂8,47%/CO₂9,98%; retorno à câmera externa aprovado. Dev G
PID17752 HTTP200; localtab2, Sitetab1 intocado.

Próximo imediato: criar branch codex/suporte-estrutural sobre codex/gases-e-ventilacao para 7C.
Integrações: soil/projects digBite/advanceFront e navigation congestion widening mudam
nest.revision; soil/erosion ainda usa desgaste empírico de umidade/vão. Granular só resolve
agregados soltos; compactado permanece no campo implícito. 7C deve adicionar suporte por
geometria/carga local com limites explícitos, conservação e ausência de geração duplicada de massa;
nunca apresentar calibração ou mecânica completa sem dados.

