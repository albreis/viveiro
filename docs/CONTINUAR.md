# Continuação do Viveiro

Trabalhar em G:\Projetos\viveiro. Ler AGENTS.md e docs/cronograma.md. Não iniciar executor concorrente, não contornar cotas/aprovações. Manter dev em G e preservar saves, branches, tags e audiência privada. Código novo pequeno em TypeScript.

## Em conclusão — etapa 13A (0.27.0)

Branch codex/espermateca-e-fertilidade. WIP46a1aaa preservado, correções0.26.1/0.26.2 incorporadas no merge6dd516f. Conflitos resolvidos mantendo ambos os imports de validação e versão0.27; docs mais recentes mantidos. Perfil opcional generic-fertility-demo@1/revisão10; lotes finitos, decaimento conservativo, consumo por fêmea, pai por ovo e machos após esgotamento sem morte automática da rainha. Filhas têm reservatório próprio vazio até contato no voo. Sem novo pacote; src/modules/fertility e app/fertility-status pequenos. Créditos abstratos; gerador ainda fornece um par por coorte, sem procura de machos externos. Ver docs/espermateca.md.

260/260 testes completos finais em235.592 ms (.runtime/fertility-final-suite.log), sessão44385 coletada e encerrada.20 dirigidos combinados passaram; build288 módulos aprovado. Nenhum teste pendente. QA FERTILIDADE-QA/D17,5/T25/RH68: um macho,75,332 viáveis+4 usados+0,668 perdidos=80, quatro ovos fecundados. Checkpoint manual-c5862e9c-4db7-43a9-81a5-9ddd931ebb10, Espermateca · primeira postura QA, recuperado com mesmos saldos. Catálogo4 registros e console limpo. Screenshot viveiro-0.27.0-espermateca.png preservado. Usuário SEMENTE-50088/D62,5/labv5 recuperado em pausa e confirmado; câmera perspectiva, interior desligado; IABtab4, dev G PID17752 mantido.

Próximo imediato: commit/push/PR sobre #36, empacotar fonte exata e publicar0.27 no mesmo Site privado, tag/metadados. Depois13B saúde/longevidade,14,P0–P5 (P5 por último). Não marcar13 inteira concluída nem desativar retomada. Reservas e ingestão autônoma da rainha, envelhecimento e doença ainda precisam de13B; dados biológicos externos explicitamente abertos. Nenhum executor concorrente.

## Última entrega publicada — aranhas e vegetação (0.26.2)

Branch codex/aranhas-e-vegetacao; PR #36 sobre #35. Fonte publicada e1865b19956d5ce64e73a59efd0f2a07007bc372, tag v0.26.2. Deploy appgdep_6ae7e85ec3188191baee5665cfda6955 succeeded em02/11/2026 01:33:30 UTC (01/11,22:33 São Paulo). Versão appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_0ba3ceac4130819186c70957dddf6735. Mesmo Site privado, acesso só do proprietário. Arquivo G:\Projetos\viveiro-0.26.2.tar.gz preservado. Bug reproduzido: árvore/arbusto com pulgões,1.200 passos, raio0,02 u. e1.099 inversões. Corrigidos aproximação/distância de trabalho, desistência, desvio de caules e recuperação por progresso líquido; saída gradual de sobreposição e de entradas surgidas sob o corpo. Memória opcional persistente validada. Modelo de solo/energia inalterado; trajetórias de predadores antigos mudam deterministicamente pelo conserto. Sem escalada 3D ou colisão exata com folhas. Ver docs/aranhas-navegacao.md.

249/249 na suíte completa em250.929 ms (.runtime/spider-suite.log), sessão48832 coletada e encerrada;12 dirigidos passaram. Build aprovado, sem dependências novas. Nos dois replays de1.200 passos: raio mínimo0,292, zero inversões contínuas, saída acima1 u., passo máximo0,04. QA navegador a/D267→268,3: aranha adicionada junto à árvore, saída observada. Checkpoint manual-fde0b27d-5d85-4c91-ad56-01420e28c742 e imagens viveiro-0.26.2-aranhas-antes/depois.png preservados. Console limpo. SEMENTE-50088/D62,5/labv5 recuperado em pausa, ferramenta predador desativada, perspectiva restaurada. IAB localtab4, dev G mantido. Nenhum teste/helper pendente.

Próximo imediato: 0.26.2 já publicada; não repetir. Retomar13A preservada em codex/espermateca-e-fertilidade/46a1aaa: incorporar fixes e conferir merges/PRs antes; resolver versões mantendo0.27 para13A. Núcleo13A já passou251 testes, mas após incorporar fixes rodar checks adequados e falta QA/documentação/publicação.13B,14,P0–P5 seguem;P5 último. Não declarar cronograma inteiro concluído.

## Última entrega publicada — correção de entradas (0.26.1)

Branch codex/bordas-das-entradas; PR #35 sobre #34. Fonte dead04386ca186ee00711e25dc3f3da7a0ddee18, tag v0.26.1. Deploy appgdep_6ae7e4ed4dfc8191aef149ab7056d0a7 succeeded em02/11/2026 01:18:49 UTC (01/11,22:18 São Paulo). Versão appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_f5e27a70858081918c474f033985fca5. Mesmo Site privado. Arquivo G:\Projetos\viveiro-0.26.1.tar.gz preservado. Removido EntranceView.js com toros; módulo TypeScript pequeno conserva só o rótulo. A própria malha define a borda. Mesh-axes adiciona colunas de centros para todas as entradas e refina contornos de até16 (prioridade às estreitas), com planos do vidro e da superfície. Células compartilham os eixos; sem remendos independentes. Física e saves inalterados.

Reprodução anterior: abertura r0,12 entre células tinha primeiro contato do raycast em y−0,01053 em vez do fundo−0,12. Teste corrigido exige fundo abaixo−0,10. Quatro lados conferidos também por raios horizontais/verticais, sem tampa falsa; amostras limitadas a menos de2 milhões no máximo atual48 nós.19/19 regressões passaram em4.186 ms (.runtime/entrance-regression.log), build279 módulos aprovado. Novo ensaio global712.140 vértices/erro máximo0,00015. A malha pode ter mais triângulos; não é medição de FPS em hardware escolar.

Navegador: a/D267 recuperado em pausa para QA dos quatro lados; SEMENTE-50088/D62,5 recuperado depois e inspecionada sua entrada. Console sem erros. Screenshot viveiro-0.26.1-entradas.png preservado. Câmera devolvida à perspectiva, interior desligado; dev G e saves mantidos. IAB local atualtab4; a aba2 anterior foi liberada pelo navegador. Nenhuma alteração na audiência do Site.

13A preservada e enviada ao GitHub: codex/espermateca-e-fertilidade, commit46a1aaa;251/251 testes completos e build passaram, falta QA/publicação. Não perder ou refazer. Nenhum teste pendente. Usuário pediu agora conferir aranhas presas em árvores/arbustos: após publicar esta correção, abrir branch própria para diagnóstico/correção antes de retomar13A. Atualizar13A com os fixes depois. Seguem13B,14,P0–P5;P5 último.

Próximo imediato: branch codex/ própria para conferir aranhas; analisar surface-obstacles.ts, surface-motion.ts e predator-step.js e reproduzir aranha encurralada por vegetação. 0.26.1 já publicada, não repetir. Nenhum executor concorrente iniciado.

## Última entrega publicada — etapa 12C (0.26.0)

Branch codex/materiais-e-compactacao; PR #34 sobre #33. Fonte publicada 609c26a531271975e183042c08fd815fc0f7fcd4, tag v0.26.0. Deploy appgdep_6ae7df533a188191ac6082f6efc038a6 succeeded em02/11/2026 00:54:55 UTC (01/11,21:54 em São Paulo). Versão appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_7a6f2ebc06e08191b9f33c2df9debb63. Mesmo Site privado, proprietário único, zero externos. Arquivo G:\Projetos\viveiro-0.26.0.tar.gz preservado.

- Código novo pequeno em src/modules/soil-material, perfil generic-microclimate-demo@3/revisão9, controles e catálogo11 registros. Referência35/50 preserva o futuro anterior; índices compartilhados, fluxos conservativos e save validado. Porosidade fixa e coeficientes não calibrados. Fontes qualitativas NRCS e limites em docs/solo-material.md. Sem pacote novo.
- Suíte completa240/240 em236.938 ms (.runtime/material-suite.log), sessão86252 coletada e encerrada.21 dirigidos passaram; build278 módulos aprovado. Depois somente docs. Nenhum teste/helper pendente. Coleta de parâmetros já usa spread de world.params; não criar coletor DOM duplicado.
- QA MATERIAIS-QA-2/D0,5/argila100–compactação0, chuva0,4 u.; checkpoint manual-927f197c-1627-4baa-8f73-ed88ece6a7f4 recuperado com mesmos índices. Screenshot viveiro-0.26.0-materiais.png já mostrado. Um erro transitório de montagem anterior ao painel completo permanece no histórico do console; nenhum erro novo na QA/reload.
- Usuário recuperado em pausa e confirmado após reload: SEMENTE-50088/D62,5/labv5, manual-b950fe52-33b4-4c6c-9265-d4b87ece98cf. Dev G mantido; Sitetab1 intocado. PRs32/33 ainda abertos na última checagem, main15781d2 já ancestral, sem mudanças remotas novas no último fetch.

### Próximo passo concreto

Criar branch codex/ para13A: espermateca finita, viabilidade e uso por ovo, parentesco e contribuição de machos efetivamente encontrados. Preservar perfis antigos e separar perda de fertilização de morte. Depois13B saúde/longevidade,14 e P0–P5 (P5 por último). Calibração por espécie, geotecnia e revisão docente seguem dependências reais abertas. Não desativar retomada. Nenhum executor concorrente iniciado.

## Última entrega publicada — etapa 12B (0.25.0)

Branch codex/estoques-por-camara, PR #33 sobre #32. Fonte publicada 5f48b2c237a2c0f548f9d770b9f09432bdc01e38, tag v0.25.0. Deploy appgdep_6ae7d977dde481919d309a034d0b577a succeeded em 02/11/2026 00:29:56 UTC (01/11, 21:29 em São Paulo). Versão appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_11ef1bcdfdac8191bb943d7426f07d55. Mesmo Site privado, somente proprietário, zero externos. Arquivo G:\Projetos\viveiro-0.25.0.tar.gz preservado. Núcleo em src/modules/stores, perfil opcional generic-microclimate-demo@2, revisão8; sem pacote novo.

- Lotes por câmara e fluxos explícitos: atual = inicial + entradas − retiradas = soma dos lotes. Guarda de posição corporal antes de depositar/comer e energia paga apenas pelo alimento acessível. Memória climática local para preferência seca; fallback de objetivo/odor legado sem clima remoto. Nutrição da prole ainda é orçamento coletivo e rainha não ganhou ingestão autônoma.
- Deterioração local vira resíduo; marcadores são agregados visuais, sem física de grãos. Guardas de saves conferem saldo, posição, nós e propriedade também após reconstruir o habitat compartilhado.
- Suíte COMPLETA FINAL231/231 em229.865 ms, log .runtime/stores-suite-final.log, sessão9502 coletada e encerrada. Primeira228 também passou;15 dirigidos finais de estoque/codec passaram. Build270 módulos aprovado. Depois apenas docs. Não repetir sem mudança relevante.
- QA ESTOQUES-QA pausada emD215,8: rainha viva, quatro naníticas já nascidas,0,339 crédito na primeira câmara, água21,809%, entradas7,7 e retiradas7,361. Checkpoint manual-8bee3b23-be96-42ea-bf6a-e640ec8ed304 recuperado com os mesmos saldos. Catálogo13 registros (três de estoque), cena interna/1ª pessoa e console sem erros. Não é ensaio de longevidade calibrada.
- Screenshot viveiro-0.25.0-estoques.png no diretório autorizado já mostrado. Usuário recuperado em pausa após QA: manual-b950fe52-33b4-4c6c-9265-d4b87ece98cf /SEMENTE-50088/D62,5/labv5. Recuperação, semente e dia confirmados no navegador. Dev G PID17752 mantido; Sitetab1 intocado.

### Próximo passo concreto

Criar branch codex/ própria para 12C, após conferir Git e PRs: materiais, textura/compactação, transporte de água e suporte. Basear nesta entrega se #33 ainda aberto ou na main atualizada se integrado. Não repetir 0.25.0 nem testes completos sem mudança relevante. Depois 13, 14 e P0–P5; P5 por último. Não marcar 12 inteira concluída ou desativar retomada. Nenhum teste, helper ou executor paralelo pendente.

## Última entrega publicada — etapa 12A (0.24.0)

Branch codex/escolha-local-da-camara; PR #32 sobre main, após integração dos PRs #30/#31 pelo usuário. Fonte publicada 3cf90eeba5166f7a5f576f80255d402fe3b621e2, tag v0.24.0. Deploy appgdep_6ae7d12547cc81918be4cc9fc7c7122a succeeded em 01/11/2026 23:54:27 UTC. Versão appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_6281f82bcedc81918980d0aea9321d5d. Mesmo Site privado, somente proprietário e zero externos. Arquivo G:\Projetos\viveiro-0.24.0.tar.gz preservado. Módulos pequenos em src/modules/chambers; perfil opcional generic-microclimate-demo@1, revisão7; genéricos anteriores preservados. Ver docs/escolha-local.md.

- Sondagem física rasa, sensores 3D limitados, memória de pontos ocupados, custos e retorno apoiado. Cuidadoras comparam apenas câmaras visitadas recentemente e levam crias ao destino escolhido; atalhos semânticos legados de outros comportamentos continuam existindo.
- Suíte completa 221/221 em 245.947 ms, log .runtime/chambers-suite.log. Sessão82358 coletada e encerrada. Caso adicional de transporte foi acrescentado depois de iniciar a suíte e passou nos cinco dirigidos finais (.runtime/chambers-integration-final.log). Não afirmar suíte completa222. Build259 módulos aprovado. Depois, apenas docs.
- Seed a: fundação no passo3567, quatro naníticas; sondagem184 passos/185 leituras; maior passo0,06790. Restore em sondagem, conservação e ausência de leitura global testados.
- QA MICROCLIMA-QA,21°C/80%:181 leituras, última21,49°C /44,07% dos poros. Checkpoint manual-e3e58cf1-b7c6-4690-a0d8-64a8ed38ee25 emD18,2. Fundação concluída observada D31,1: rainha viva, quatro naníticas nascidas, três operárias vivas; tampão reaberto em quatro viagens. Checkpoint nomeado preservado. Execução longa D134,1 perdeu a rainha; preservada antes de recuperar. Não declarar sobrevivência calibrada.
- Catálogo dez registros e console aprovados. Screenshots viveiro-0.24.0-escolha-local.png (já mostrado) e viveiro-0.24.0-fundada.png no diretório autorizado. SEMENTE-50088 restaurado em pausa, ponto manual-b950fe52-33b4-4c6c-9265-d4b87ece98cf /D62,5/labv5. Recuperação e dia confirmados no navegador. Dev G PID17752 mantido; Sitetab1 intocado.
- Roteiro inicial docs/ensino/microclima-local.md; não é revisão docente nem piloto. 12B ainda pendente: estoque espacial, preferência seca, materiais/textura/compactação/suporte. P0–P5 ficam APÓS12–14, orientação atual do usuário.

### Próximo passo concreto

Criar branch codex/ própria para 12B a partir desta entrega (ou main atualizada se o PR #32 tiver sido integrado). Implementar estoque por câmara com balanço explícito e preferência seca local; depois materiais/textura/compactação/suporte. Preservar o estoque agregado e os futuros dos perfis antigos. Não pular a 13 ou marcar 12 inteira concluída. Depois 13, 14 e P0–P5. Nenhum teste, helper ou executor paralelo pendente.

## Sincronização e prioridades atuais

Primeira sincronização por fast-forward em 93e28d1; recebidos depois os merges #30/#31, main remota 15781d2, incorporados sem conflito à branch de trabalho. Main local também atualizada sem reescrever histórico. A implementação ee34b75 já era ancestral dos merges; não houve conflito ou perda de trabalho. Referência de segurança local codex/backup-pre-sync-ee34b75 e branches antigas preservadas. PR #26 integrado pelo usuário; não duplicar ou reabrir.

Recebidos kit de divulgação, fórmulas e seção P0–P5 do cronograma. P5 (clima real da localização) foi recebido pelo PR #31 e permanece por último, sem ativação ou coleta de localização nesta etapa. Orientação explícita atual: executar as novidades DEPOIS das pendências anteriores 12–14. A proposta antiga de paralelismo foi corrigida preservando todos os itens. Rankings são projeções editoriais, não medições. Dados, professores, turmas e publicação científica continuam dependências externas reais.

## Última entrega publicada — etapa 10C (0.23.0)

Fonte ee34b75bca62e4ebc65fb83d397ae429acb09e6c, branch codex/fundacao-semiclaustral; PR #26 integrado em 01/11/2026 21:39:28 UTC. Tag v0.23.0 aponta à fonte publicada. Deploy appgdep_6ae7a30d9f148191936e0799569b39f8 succeeded em 01/11/2026 20:37:46 UTC. Versão appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_824150d8d6d08191b718fd5f87337902, mesmo Site privado. Arquivo G:\Projetos\viveiro-0.23.0.tar.gz preservado. A interrupção ocorreu após o retorno nativo e antes destes metadados; não repetir publicação.

- Rainha coletora, entrada aberta e alimento separado dos tecidos iniciais em src/modules/semiclaustral. Perfil generic-semiclaustral-demo@1, genéricos anteriores preservados. Modelo e limites em docs/fundacao-semiclaustral.md, sem dieta/espécie calibrada.
- 217/217 testes completos em 270.340 ms, log .runtime/semiclaustral-suite.log. Sete novos e nove regressões dirigidas passaram; sessão 12648 encerrada. Build final 253 módulos aprovado. Remoto recebido mudou somente documentação; não repetir suíte sem mudança relevante.
- Seed a controlada: passo 2612, quatro naníticas, três viagens; 1,95 coletados / 1,30 consumidos / 0,65 exportados; maior passo 0,06798. Restore em viagem e falha sem alimento testados.
- QA SEMICLAUSTRAL-QA: quatro viagens e quatro naníticas; ponto Fundação semiclaustral · QA em D87,2. Catálogo/console aprovados. Screenshot viveiro-0.23.0-fundacao-semiclaustral.png já mostrado.
- Última recuperação do usuário: SEMENTE-50088 / D62,5 / lab v5, manual-b950fe52-33b4-4c6c-9265-d4b87ece98cf. Antes de outra QA, conferir se avançou e salvar o estado mais recente; não forçar um ponto antigo como atual. Saves preservados.
- Dev Vite G PID17752 porta4173 confirmado ativo após sincronizar. Não encerrar. Nenhum executor de desenvolvimento concorrente iniciado.

### Próximo passo concreto

Concluir PR documental codex/cronograma-pos-merges sobre main, enviar tag e metadados. Depois criar branch própria para 12: seleção local do microclima e da câmara, começando por sensores e escolha física da rainha, preservando perfis/saves antigos. Conferir Git/PRs antes; se o PR documental já foi integrado, usar main atualizada. Depois 13, 14 e P0–P4. Manter Site privado e retomada ativa.

## Última entrega publicada — etapa 11B (0.22.0)

Branch codex/diapausa-e-casulos; base codex/maturacao-e-estacoes (PR #24). PR #25 aberto. Fonte 5af4191ea97787d2414c6faef30ac9adb91aa4ec, tag v0.22.0. Deploy appgdep_6ae79f3e3548819195ecf89a8c937020 succeeded em 01/11/2026 20:21:31 UTC. Versão appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_f7390c6c4fb48191b1201e2c1e59d4a4. Mesmo Site privado, somente proprietário e zero externos. Arquivo G:\Projetos\viveiro-0.22.0.tar.gz.

- Memória sazonal por colônia, frio acumulado, retomada gradual, atividade/energia/O₂ reduzidos e procura física de abrigo. Casulos com pagamento parcial persistente e resíduo sem reembolso. Fotoperíodo explícito separado da intensidade solar. Perfis genérico/lab v5; pupa nua generic-naked-demo@1 com modelRevision5. Saves anteriores preservados.
- 210/210 testes completos em 291.383 ms, log .runtime/season-suite.log. Sessão 98016 encerrada. Depois, apenas UI/catálogo/câmera; build final 246 módulos aprovado. Não repetir suíte sem mudança relevante. Sem dependências novas.
- QA completa ESTACOES-QA: cinco casulos em D62,1; diapausa quente em D97,6; frio 6,3/5 em D173,7; ciclo1 ativo em D188,8 com rainha viva. Operárias envelheceram; não afirmar nova postura nem sobrevivência calibrada. Checkpoints nomeados das fases preservados. Variante nua no catálogo e inspeção por linha de visão real aprovadas.
- Fontes e limites em docs/sazonalidade.md. Willot2026 doi10.1111/1365-2435.70359 inspira qualitativamente; protocolo 8°C/4 meses/26°C só consulta, não coeficientes calibrados.
- Novo terrário do usuário SEMENTE-50088 preservado em manual-aa40d713-28e7-45a1-bf10-cea8001456c8, Antes da QA sazonal · SEMENTE-50088, D16,9. Restaurado em pausa após QA; não substituir pelo antigo D267, também preservado.
- Screenshots viveiro-0.22.0-casulos.png e viveiro-0.22.0-sazonalidade.png no diretório autorizado de visualizações. IAB localtab2 mantida; Sitetab1 intocado. Dev G PID17752 porta4173 ativo.

### Próximo passo concreto

Criar branch codex/ própria para 10C: fundação semiclaustral com coleta externa e orçamento conservativo. Em seguida 12–14. Calibração por espécie continua dependência externa real. Não declarar cronograma concluído nem desativar retomada ainda.

## Última entrega publicada — etapa 11A (0.21.0)

Branch codex/maturacao-e-estacoes; base codex/selamento-fundacao (0cb17c1, PR #23). Publicada a fonte 77508511daa910f53c0465e5cce52db4cfa3f1c9, tag v0.21.0. PR #24 aberto sobre #23. Deploy appgdep_6ae790ce6be48191bdfcc5addb611f64 concluído em 01/11/2026, 19:19:54 UTC. Versão appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_420e33161dd8819190a6c31da10ca2c5. Mesmo Site privado, somente proprietário e zero externos. Arquivo G:\Projetos\viveiro-0.21.0.tar.gz.

- Módulos TypeScript pequenos em src/modules/development, app/development-status e biology/development-records; nenhuma dependência nova. Modelo, coeficientes e limites em docs/maturacao.md.
- Revisão 4 habilita curvas locais, água nos poros como proxy, alimento parcial, variação individual/genética, estresse/perdas e registro persistente. Revisões 1–3 e replay preservados. 100 passos/dia ainda demonstrativos; nenhuma faixa da outra IA foi instalada como medição.
- 19 dirigidos aprovados; suíte COMPLETA 199/199 em 268.553,8439 ms, log .runtime/development-suite.log. Sessão 18139 encerrada. TypeScript/Vite final aprovado após ajuste somente de UI (coeficientes pequenos e pontuação). Não há teste pendente.
- QA TERMICO-QA, preset lab v4: quatro crias em D23,2 com entorno 20,9–21,2 °C. Ar 45 °C não reescreve amostras. Avanço a D24,4: entorno 20,9–21,4 °C, quatro sob estresse local, nenhuma perda; solo até 28,1 °C. Não atribuir o estresse só ao calor. Checkpoint Prole térmica · revisão 4 QA preservado. Recarga e catálogo aprovados; coeficiente 0,0005 confirmado.
- Original RESTAURADO via checkpoint manual-691625be-84fe-4949-bf1f-68490114e3db: ACK confirmado, D267 / 97 adultos / 14 crias / duas colônias / aprendizado 4719/4607. Seletor do próximo terrário genérico v4; catálogo fechado, em pausa e previsão cancelada. Console final sem erros.
- Screenshot viveiro-0.21.0-maturacao.png no diretório autorizado de visualizações. IAB local tab 2 mantida; Site tab 1 intocado. Dev G PID 17752 continua ativo.
- Referência qualitativa primária: Kipyatkov & Lopatina 2015, doi10.1111/ens.12098, resumo lido no portal SPbU; não foram extraídos dados para calibrar a curva. PDF EJE2002 deu timeout; não afirmar leitura integral.

### Próximo passo concreto

Criar branch codex/ própria para 11B: diapausa com memória (não confundir com interrupção instantânea por frio), retomada gradual e casulos por perfil. Fundação semiclaustral e etapas 12–14 continuam pendentes. Não contornar limites ou iniciar outro executor.

## Última entrega publicada — etapa 10B (0.20.0)

Branch codex/selamento-fundacao, base codex/reservas-maternas (8ec428e, PR #22). Publicada a fonte ba99dc59772ccb398212f90d9307708b958431fc, tag v0.20.0. PR #23 aberto sobre #22. Deploy appgdep_6ae78c19142881918180656445fc1b22 concluído em 01/11/2026, 18:59:50 UTC. Versão appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_001350877388819189898d73bbc133f5. Mesmo Site privado: somente proprietário, zero externos. Arquivo G:\Projetos\viveiro-0.20.0.tar.gz.

- Novos módulos pequenos em src/modules/sealing, renderer/PlugView.ts, sealing-focus.ts e app/sealing-controls.ts. Sem dependência nova.
- Revisão biológica 3 habilita tampão; 1 escalar e 2 reservas abertas mantêm seus futuros. Seleção de novos terrários oferece a revisão 3; legados e replay não mudam de versão.
- Terra existente vai do monte à rainha, ao tampão, à nanítica e de volta à superfície. Peça analítica compartilhada com colisão; gases porosos e volume deslocado contabilizados. Reservas financiam construção. Detalhes e limitações em docs/selamento.md.
- Guardas de saves validam geometria, tarefa, recolhimento e balanço global após reunir todas as colônias, sem duplicar portadores. Extração de compacto para desabamentos exclui material do tampão.

### Verificações encerradas

- Suíte final 190/190 em 292.988 ms: .runtime/sealing-suite-final.log, sessão 63171 concluída. Primeira execução falhou só na expectativa de latestProfile=2, atualizada para 3; não era falha do modelo.
- Depois: guarda do balanço global e desenho analítico refinados; 16 dirigidos finais passaram (sessão 45268 concluída), incluindo três seeds e futuro exato de saves fechados. Dois testes de malha/render passaram antes; o teste de render também integra os 16 finais. Não afirmar suíte completa 192/192.
- Build TypeScript/Vite final aprovado: 228 módulos, main 231,26 kB / gzip 82,01 kB. Chunk Three grande é aviso conhecido. Lockfile conserva os requisitos originais de Node ^20.19.0, sem alterar pacotes.
- Seeds a / RESERVAS-QA / SEMENTE-42: fechamento 2192 / 2086 / 2102, reabertura 3964 / 2657 / 2809. Balanço de terra com erro <3e−15; sem saltos corporais acima de 0,13 u./passo.
- QA visual: SELAMENTO-QA, ar de referência v3, 21 °C / 80%, fechada em D20,6 com 0,15 u³, reaberta em D39,3 com quatro naníticas / seis viagens. Checkpoints nomeados Entrada fechada · revisão 3 QA e Entrada reaberta · revisão 3 QA preservados. Catálogo com cinco coeficientes de selamento conferido; recarga e console final sem erros.
- Original RESTAURADO, ACK confirmado, em pausa: seed a, D267, 97 adultos / 14 crias / duas colônias, 35 °C / 92%, aprendizado 4719 / 4607. Checkpoint manual-691625be-84fe-4949-bf1f-68490114e3db. Seletor do próximo terrário genérico v3; catálogo fechado, vista em perspectiva, previsão cancelada.
- Dev PID 17752, porta 4173, em G. IAB tab 2 marcado como entrega; Site tab 1 intocado. Screenshot viveiro-0.20.0-entrada-fechada.png no diretório autorizado de visualizações.

### Próximo passo concreto

Abrir branch codex/ própria para etapa 11: maturação, curvas térmicas, alimentação/umidade/estresse e diapausa por perfil. Não instalar as faixas da outra IA como dados validados. Mecanismo semiclaustral, casulos e cronologia real ainda pendentes. Etapas 12–14 e calibração externa seguem no cronograma.

Não repetir testes completos sem mudança que justifique. Main e PRs anteriores preservados. Não há executor paralelo nem teste pendente.

## Última entrega publicada — etapa 10A (0.19.0)

- Branch: codex/reservas-maternas; base: codex/perfis-biologicos (3926c8e).
- Fonte publicada: b3713abc05e91df57a7b5b9b0d7e09e680432b0d; PR #22 sobre #21. Tag v0.19.0 preserva essa fonte.
- Deploy appgdep_6ae784be9d288191be36011eba00f5a5 concluído em 01/11/2026, 18:28:27 UTC. Versão appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_0ab0ee8cef848191816765fc594562e4. Mesmo Site privado, somente proprietário, zero externos.
- Arquivo G:\Projetos\viveiro-0.19.0.tar.gz preservado fora do checkout.
- Novos módulos pequenos em src/modules/maternal e src/modules/biology, com UI própria. Nenhuma dependência nova.
- Revisões 1 continuam escalares; revisões 2 habilitam reservas. Legados e replay preservam sua versão. Próximos terrários usam a revisão mais recente selecionada.
- Reservas, equações, custos e limites estão em docs/reservas-maternas.md. Unidades são créditos demonstrativos, não gramas ou kcal. Histólise só após perda das asas; prole usa proteína; escavação é paga antes da geometria.

### Verificações concluídas

- Suíte completa: 183/183, duração 1.228.964 ms; log .runtime/maternal-suite.log. Sessão 48388 concluída.
- Proteção adicional contra reservas em perfil escalar: 14 dirigidos finais passaram. Sessão 57294 concluída. Depois disso, apenas UI e documentação; build final aprovado.
- Integração: quatro naníticas no passo 2194; erros de reserva −3,69e−13 e terra −2,22e−15.
- QA: RESERVAS-QA, laboratório v2, 21 °C / 80%, fundada com quatro naníticas e 16 viagens de terra. Checkpoint nomeado Fundação v2 · reservas QA preservado. Recarga e cinco registros maternos do catálogo conferidos.
- Experimento original RESTAURADO e confirmado em pausa: seed a, dia 267, 97 adultos, 14 crias, duas colônias, 35 °C / 92%, aprendizado 4719 escolhas / 4607 ajustes. Aviso de recuperação confirmado. Próximo perfil selecionado genérico v2, sem alterar o atual.
- Checkpoint original: manual-691625be-84fe-4949-bf1f-68490114e3db (Antes de validar perfis · dia267). JSON de segurança em .runtime/before-checkpoints-dia-267.json.
- Dev Vite PID 17752 mantido. Navegador IAB local tab 2 marcado como entrega; Site tab 1 intocado. Screenshot final viveiro-0.19.0-reservas.png no diretório de visualizações autorizado.

### Próximo passo concreto

Criar branch codex/ própria para 10B. Tampão, isolamento e reabertura NÃO estão feitos. Depois, etapas 11–14. Dados por espécie continuam dependência externa real.

Git e PRs 1–21 foram conferidos; permanecem encadeados e abertos. Não integrar main, não duplicar PRs. Main ba081a4 permanece preservada. Não repetir testes completos sem nova alteração relevante.

## Última entrega publicada — etapa9 (0.18.0)

Branch codex/perfis-biologicos, base codex/observacao-e-validacao9790422.0.18.0publicada:fonteadfa0fd87b42cc267b00a9869639216d384ec061,tagv0.18.0,PR#21 https://github.com/albreis/viveiro/pull/21sobre#20. Deployappgdep_6ae760e625408191b8bd518379b117d7succeeded01/11/2026 15:55:30UTC. MesmoSiteprivadoowner-only/zeroexternos.ArquivoG:\Projetos\viveiro-0.18.0.tar.gz.176/176testes completos em307760ms (log.runtime/biology-suite.log),21dirigidos,TS/Vite ebrowser aprovados. Sessão82954concluída; não repetirsem mudança relevante. Fonteadfa0fd+tag/checkpointenviados;mainintocada. Módulosnovospequenos: src/modules/biology eapp/biology-controls,parameters,markup; CSSpróprio. index sóplaceholder,catálogo emdialoglegível. Sem pacote novo. Mesmo modelo numérico; constantesreserva8/limiares.35/.9extraídas semmudança.

Registro14parâmetros: aproximação/hipótese/condiçãoexperimental/medição com unidade/fonte/amostra/incerteza/uso. Perfisgenérico eAr dereferência(21°C/80%na criação,restogenérico),sem espéciecalibrada. FonteMajidifar2024doi10.1111/1365-2435.14536lida: condicionadores nãoótimos; medida17/22sobreviventescomoperáriasaté93dias(coorte24),n22,sóconsulta. FaixasoutraIAhipótesesinativas. Nãoatualizar timerscom essesvalores. Casulo/semiclaustral/diapausamecanismosnas próximas10/11, dadospor espécie pendentes. docs/perfis-biologicos.mdregistralimites.

World.biologicalProfileopcional{schema:1,id,version}; snapshot/replay/initial preservamrefs+paramsresolvidos;filhascopiamfontedeorigemindependente;legadosnão reescritos. Unknownprofile/schema/version UnsupportedBiologicalProfile protegegravação: candidatoanteriorcompatívelabrepaused/blockedtrue,raworiginalpreservado. TestevalidCRCpassou. Testesdefault vsmetadata futuroexato200ticks+roundtrip+herança passaram.

BrowserFINAL originalseed a/dia267 PAUSADO,97adultos/14crias/2colônias,35°C/92%RH,neural4719escolhas/4607ajustes preservados apósreload. ManualantesQA idmanual-691625be-84fe-4949-bf1f-68490114e3db nomeAntes de validar perfis · dia267preservado. TesteSEMENTE-81062criadocomref21°C/80%,v1persistiureload0,7dia. ORIGINALJÁRESTAURADOeconfirmado; pretesttambémfoi salvo automaticamenteantesrestore. Pickerpróximoterráriodevolvidogenérico. Catálogostudyconferido +hipóteses; últimodialogfechado,previsãocancelada. Screenshotviveiro-0.18.0-catalogo.png. Nenhumerronovo; doisHMR14:44:57antigospréQA. DevG PID17752HTTP200. Localtab2deliverable,Site1intocado.

Próximo após publicar0.18.0: etapa10tampão/isolamento/reaberturafísicos e reservaslipídicas/proteicas/músculo com balanços; semtimersuniversais. 11–14depois; dadoscalibraçãoexternospendentes. SourcehelperOPENHEADfinal,archiveG:\Projetos\viveiro-0.18.0.tar.gzfora checkout,pushsomente branch/tag. Não contornarlimites;automaçãohoráriaativa atécritériosimplementáveisconcluídos.

## Última entrega publicada — 8C2 (0.17.0)

Branch codex/observacao-e-validacao, base codex/previsoes-cancelaveis9f60d10.0.17.0publicada: fonte e9ae0423f312482731e5d289ff44abb0faf85fdf, tagv0.17.0, PR#20 https://github.com/albreis/viveiro/pull/20 sobre#19. Deploy appgdep_6ae7594743888191b3f32d3bff1e15b4 succeeded em01/11/2026 15:23:00UTC. Mesmo Site privado, proprietário/zero externos. ArquivoG:\Projetos\viveiro-0.17.0.tar.gz.16testes dirigidos, TypeScript/Vite e browser aprovados. Nenhuma mudança biológica, nenhum pacote novo. Módulos TS pequenos83–123linhas, testes232/233. src/modules/forecast/observations/count-model/count-run + avaliação/statistics; painel próprioforecast-benchmark.ts. Censo perfeito de adultos+3dias de histórico; sem energia/prole/genes/mapa no payload parcial. OLS+bootstrap de incrementos, fallbackpersistência, limites explícitos.

Ensaio CONCLUÍDO, sessão24451 encerrada, não repetir sem mudança de modelo. CLI npm run evaluate:forecast; log.runtime/forecast-evaluation.log. RelatórioREALpublic/benchmarks/previsoes-v1.json19036bytes,3seedsEVAL-VIVEIRO-01/02/03,origens300/600,horizontes1/3/7,6futuros completos cada.18pares origem/horizonte. Nodev24.22.1/Windows,gerado15:13:33UTC,total518,45s. MAEcompleto0,83/0,33/1,17;contagem1,33/6/20,67;base6,67/21,33/35,5. Coberturacompleto83,33/100/83,33%;contagem100/50/16,67%. Médiaativo51,08s/origem completo(todos horizontes),0,44ms/horizonte contagem. Deduplicar custo completo porseed/origem; cópia por linha. Sem calibração biológica ou isolamento causal do efeito dos dados; métodos diferentes,6origens correlacionadas em3seeds,um regime/colônias pequenas. docs/avaliacao-previsoes.md registra tudo.

BrowserQA: dia267pausado,97adultos/14crias/2colônias,92%RH e4719escolhas/4607ajustes preservados apósrecarga. Parcial3dias18futuros89–97,13censos,56,5ms/1,5ms. Completo1dia6futuros terminou45,1s/17,9s. TabelaMAE/RMSE/cobertura eJSON conferidos,base sem faixa. Nenhum erro novo; doislogsHMR14:44:57anteriores à QA. Screenshot viveiro-0.17.0-avaliacao.png. Localtab2 mantida, deixada parcial3dias18futuros+relatórioaberto; Site1intocado. DevG17752HTTP200. BuildjáincluiJSONfinal. Sem teste pendente; não alegar169/169fullsuite:153/153 foi0.15,16dirigidos atuais.

Próximo após publicar0.17.0: etapa9perfis/proveniência versionada (verdocs/biologia-planejada.md ecronograma).9–14ainda pendentes. Separar hipótese de dado, genérico demonstrativo de espécie calibrada; não usar faixas de outraIA como timers científicos. Não alterar modelos para melhorar a tabela. Preservar saves/branches/tags/audiência. Publicar viahelper sourceOPENnoHEADfinal,archiveG:\Projetos\viveiro-0.17.0.tar.gzfora do checkout.

## Última entrega publicada — 8C1 previsões canceláveis (0.16.0)

Branch codex/previsoes-cancelaveis, base codex/checkpoints-e-recuperacao5ac9d83. Versão0.16.0 publicada: fonte80fc8235bafdcb16b7f63e0ec59ab1edd2294fb7, tagv0.16.0, PR#19 https://github.com/albreis/viveiro/pull/19 aberto sobre#18. Deploy appgdep_6ae7536aed448191b373f9e399ee378e succeeded em01/11/2026 14:57:59UTC. Mesmo Site privado, owner-only/zero externos. ArquivoG:\Projetos\viveiro-0.16.0.tar.gz. Módulos pequenos src/modules/forecast (model/run/types), serviços forecast-client/runner, WorkerTS e painel próprio. Controller perdeu a lógica antiga; arquivo workerJS substituído. Sem mudanças biológicas. Cálculo cooperativo8ms/pausa40ms, um tick pode exceder8ms; último pedido pendente, cancelamento e invalidação por intervenção/reset/restore/replay/cenário. Opções1/3/7dias,6/18futuros,10/30/120s ativos; orçamento incompleto explícito, não auto-reinicia, amostra<2não exibe intervalo.

Oito testes novos e dois existentes de forecast/restore passaram (41379ms regressão); TypeScript/Vite e diffcheck aprovados. Não alegar execução completa161/161:153/153 foi na0.15.0. Engine igual ao ensemble síncrono. CLI backup real97adultos:2x10passos,912,9ms,maiorfatia160,7ms. Browser seed a/dia267 pausado preservado,2colônias/97adultos/14crias. QA orçamento10s→3/6futuros,98–99,25s; completo6/6→97–99,44,9s/17,6s. Cancelamento, recálculo e92→91→92%RH descartaram resultados velhos. Nenhum erro novo na QA final; dois logs de14:44:57 vieram de HMR parcial antes da recarga final. Screenshots0.16.0-previsao e-completa. DevG PID17752. Localtab2 mantida; previsão deixada cancelada, opções1/6/120. Site tab1 intocado.

Próximo concreto: criar codex/observacao-e-validacao para8C2 para observações parciais/completas, erros por horizonte e baselines em séries reservadas, custo e métricas explícitos. Não tratar faixaP10–P90 sintética como confiança científica calibrada. Etapas9–14 ainda pendentes. Publicar com helper sourceOPEN no HEAD final, archiveG:\Projetos\viveiro-0.16.0.tar.gz fora do checkout, preservar acesso owner-only. Tags e saves antigos preservados. Push só branch/tag específicas.

## Última entrega publicada — 0.15.0 (8B)

Branch codex/checkpoints-e-recuperacao, base codex/aprendizado-local bd3b64f. Fonte0868ca68042065212163995282400205bc788d18, tagv0.15.0. PR#18 https://github.com/albreis/viveiro/pull/18 pronto, encadeado ao#17. Deploy appgdep_6ae74f5a580881919755d62158dda0c2 succeeded em01/11/2026 14:40:39UTC. Mesmo Site privado: proprietário, zero externos. ArquivoG:\Projetos\viveiro-0.15.0.tar.gz. Commits3b1f14b e0868ca6 enviados; main intocada.

IndexedDB com transação atômica,8autoslots, pontos manuais preservados, fila serial e coalescência de autosaves pendentes. Compactação do habitat compartilhado, checksumCRC para corrupção acidental, importação legada, fallback independente e proteção contra sobrescrita de dados ilegíveis. Sem colaboração multitab/garantia de encerramento brusco. docs/persistencia.md. Novos módulos focados em TypeScript, sem dependências novas. Modelo biológico inalterado.

Validação:153/153 testes em250853ms, TypeScript/Vite aprovados; não repetir sem alteração relevante. UI real: criação de ponto,92→91%RH,restauração92 com backup anterior, importação do JSON original e recarga. Dia267,4719escolhas/4607ajustes e formiga#647 com38ajustes conservados. Console vazio. Screenshot viveiro-0.15.0-checkpoints.png. Backup original C:\Users\conta\Downloads\viveiro-a-dia-267.json e cópia G:\Projetos\viveiro\.runtime\before-checkpoints-dia-267.json preservados.806285bytes checkpoint vs1847316exportformatado; decode igual à sessão normalizada, diferença inclui formatação/campos derivados.

CUA export/import tiveram latência longa do provedor mas concluíram; evitar repetir sem necessidade. Reconectar documentação após compaction. Credenciais só em memória/stdin, nunca persistir. Publicação usa site-workflow.mjs, sourceOPEN no HEAD exato e arquivo fora do checkout. Push somente branch e tag explícitas.

## Entrega anterior — 0.14.0 (8A)

Branch codex/aprendizado-local, base codex/suporte-estrutural (83f43a2). Publicada. Fonte fb2093069ee97f980746a987534746ee164b72b4, tagv0.14.0, PR#17 https://github.com/albreis/viveiro/pull/17. Deploy appgdep_6ae73d981e948191a4cc7cc2461c0860 succeeded em01/11/2026 13:24:52 UTC. Mesmo Site privado, somente proprietário/zero externos confirmados. Learning em módulos TypeScript pequenos: rede6x8→1 (65 coeficientes), SARSA semi-gradiente, políticas locais, arena/treino separado, intervenção validada. Pesos e traços próprios por formiga; template de colônia imutável. Worker compara rede, ACO e rede sem treino em64 cenários reservados. Snapshots/replay, seletorACO/neural e leitura individual. ACO sem aprendizado preserva exatamente o estado/RNG anterior.

Suíte completa: 139/139 em517632ms (log .runtime/learning-suite.log), nove dirigidos finais aprovados. TypeScript/Vite final passou após última alteração SOMENTE de UI: relatório do treino agora reaparece após recarga. Não repetir a suíte completa sem nova alteração de modelo. Sem teste pendente.

Browser: seed a, dia267 pausado, 97 adultos/14crias/duas colônias. Neural ativo:4719decisões,4607ajustes,recompensa -311,40; selecionada#647 com38ajustes. Treino a:policy: rede64/64,ACO64/64,sem treino1/64; passos6,1/6,7. Troca ACO/neural preservou pesos; recarga/relatório e primeira pessoa aprovados. Console final vazio. Screenshot viveiro-0.14.0-aprendizado.png no diretório autorizado do Codex. Conexão CUA antiga expirou após horas; reset e getTab2 reconectaram sem trocar navegador. DevG PID17752 e HTTP200. IABlocaltab2, Sitetab1 intocado.

Próximo imediato: criar branch codex/checkpoints-e-recuperacao sobre codex/aprendizado-local para8B. Implementar IndexedDB/checkpoints/migrações/compactação do habitat compartilhado;8C previsões por observação/horizonte e benchmarks. Etapas9–14 continuam planejadas ao final. Limites científicos de7/8A explicitados, sem calibração prometida.

## Entrega anterior — 0.13.0 (7C)

Branch codex/suporte-estrutural, base codex/gases-e-ventilacao (12260e7). Publicada no mesmo Site privado. Fonte 25dbe03bbc63579ee9e2ba738ef2ed025b8c2a6e, tag v0.13.0, PR #16 https://github.com/albreis/viveiro/pull/16. Deploy appgdep_6ae71342c17c8191a6fd9f5bdde06fd3 succeeded em 01/11/2026 10:24:15 UTC; audiência somente proprietário preservada. Modelo em src/modules/structure: geometria do teto no campo implícito, carga/capacidade reduzida por água/atrito/integridade, dano, volume sólido por quadratura e desprendimento conservativo. Entulho solto excluído da consulta do compacto. Desgaste antigo alimenta integridade/capacidade, mas limiar0,4 deixou de causar colapso natural por si só. Agregados caem e são recolhidos pela rotina existente. Fissuras instanciadas, painel e foco da câmera dentro da galeria. Modelo não é DEM compacto/FEM calibrado; liberação adiada perto de corpos, sem soterramento. docs/suporte-estrutural.md. Fonte e checkpoint enviados ao GitHub.

Dez testes dirigidos passaram. Um erro inicial era do fixture com revision1 (migração legada recriava o ninho), corrigido para revision2 sem alterar migração. Saída de snapshot gigante foi evitada com isDeepStrictEqual+assert.ok, preservando comparação estrita. O teste de restore foi fortalecido para conter agregado liberado e móvel e os sete estruturais finais passaram. Suíte completa limpa: 130/130 em 494952 ms (log local .runtime/structure-suite.log). TypeScript/Vite finais aprovados após a câmera; nenhum teste pendente. Não repetir sem alteração relevante.

Navegador: seed a preservada; dia240,1 pausado, duas colônias/82 adultos/10 crias, 72 amostras de teto, uma sob sobrecarga, menor margem0,95× e um desprendimento natural. Terra solta já0 no painel. Foco inicial externo pouco útil foi corrigido para inspeção no interior com luz local. Fissura visível, recarga persistiu métricas, sem erros novos (console contém apenas HMR antigos08:37 e09:42 já corrigidos). Screenshots viveiro-0.13.0-fissura.png e-suporte.png no diretório autorizado. IABlocaltab2, Sitetab1 intocado. DevG PID17752.

Próximo imediato: criar branch codex/aprendizado-local sobre codex/suporte-estrutural para etapa8A. Implementar RL pequeno com baseline, treino separado, IndexedDB/checkpoints/migrações, observação parcial/completa e erro por horizonte. Calibração de7 permanece dependente de dados; não tratar o proxy estrutural como cadeias de força reais. Etapas9–14 novas permanecem ao final, planejadas como hipóteses/dados a validar.

## Entrega anterior — 0.12.0 (7B2)

Branch codex/gases-e-ventilacao, base codex/agua-e-calor. Fonte 0e385cc10855b974581dcc3ed894bf3c95fbf4cc, tag v0.12.0, PR #15 https://github.com/albreis/viveiro/pull/15. Deploy appgdep_6ae70e5a53248191a26b2084df60fb48 succeeded em 01/11/2026 10:03:19 UTC; mesmo Site privado, somente proprietário confirmado. Módulos pequenos em src/modules/ventilation: tipos, rede, estado/balanços, pressão, transporte, respiração, sensores e update. O₂/CO₂ por nós, vento e empuxo aproximados, obstrução por entulho. Campo global único; snapshots e RNG independentes. Sensores ACO só em saídas próximas (≤1,2); custo de energia exploratório nas operárias. Desgaste/estoque usam água e temperatura locais. README, changelog e docs/gases-e-ventilacao.md atualizados. Novas etapas 9–14 continuam ao final do cronograma.

Validação: 12 testes dirigidos de gases/integração aprovados; TypeScript/Vite aprovados. Primeira suíte completa teve 122/123 em 541580 ms: único erro foi estoque inexistente em fundação sem câmaras. Corrigido com guarda de armazenamento real; teste original da falha passou isoladamente. Segunda suíte completa limpa: 123/123 em 448552 ms, TypeScript/Vite finais aprovados. Nenhum teste pendente; não repetir sem nova alteração relevante.

Navegador: seed a mantida, ar 35 °C, RH92%, repouso20°. Vento 1,5 por teclado e simulação continuada até dia229,8, depois pausada. Duas colônias/87 adultos, três entradas. Ar: O₂8,47–20,86%, CO₂0,07–9,98%; consumo0,128u. São resultados exploratórios sem calibração. Recarga conservou campo/vento/tempo; diagrama e leitura local observados. Screenshot viveiro-0.12.0-ar.png no diretório autorizado do Codex. Console tem apenas registros antigos de HMR: granular08:37 (corrigido0.10) e intervene09:42 (corrigido para intervention antes do QA). Conferência final: nenhum erro novo. Primeira pessoa mostrou O₂8,47%/CO₂9,98%; retorno à câmera externa aprovado. Dev G PID17752 HTTP200; localtab2, Sitetab1 intocado.

Próximo imediato: criar branch codex/suporte-estrutural sobre codex/gases-e-ventilacao para 7C. Integrações: soil/projects digBite/advanceFront e navigation congestion widening mudam nest.revision; soil/erosion ainda usa desgaste empírico de umidade/vão. Granular só resolve agregados soltos; compactado permanece no campo implícito. 7C deve adicionar suporte por geometria/carga local com limites explícitos, conservação e ausência de geração duplicada de massa; nunca apresentar calibração ou mecânica completa sem dados.

## Entrega anterior — 0.11.0 (7B1)

Branch codex/agua-e-calor; base codex/solo-granular. Versão 0.11.0 publicada. Fonte 22efc9cc06457f9749e6de792708d592020e0a09, tag v0.11.0. PR #14 https://github.com/albreis/viveiro/pull/14. Deploy appgdep_6ae707f3104c8191a874614f54d1b901, succeeded em 01/11/2026 09:35:59 UTC; acesso só do proprietário confirmado, sem alterar audiência. Campo 20x8x13 de água/temperatura com transporte conservativo reduzido, fontes/saídas e calor; independente de RH, controle do ar 5–45 °C. Plantas/madeira/pedras e leitura da formiga usam amostras próximas. Mapas em corte água/calor, tipos/estado/grade/transporte/fronteiras separados. Modelo não resolve Richards completo, galerias inundadas, gelo, calor advectado ou capacidades térmicas variáveis. docs/agua-e-calor.md.

Suíte completa: 111/111 em 468562 ms. TypeScript/Vite finais aprovados; oito testes de clima direcionados passaram após adicionar verificações de balanços acumulados e acessibilidade dos botões. Recarga preservou ar/solo/tempo; primeira pessoa mostrou a leitura local. Nenhum erro novo no console (o registro antigo de HMR em 08:37 foi corrigido na 0.10). Não repetir testes completos se os dirigidos passarem e não houver nova alteração do modelo.

Navegador: seed a preservada; clima inicial 53,8–63,2% nos poros e 22,3–24 °C. Mudança do ar para 35 °C manteve inicialmente solo em 22,6–24,6 °C; chuva no dia 176,7. QA pausada no dia 219,1: entorno 47,5–68,9%, 28–34,1 °C, 0,8 u. infiltrada e 4,1 evaporadas. Formiga selecionada leu 28,7 °C/61% no entorno. Mapas alternados e screenshots viveiro-0.11.0-calor.png e viveiro-0.11.0-agua.png salvos no diretório autorizado. Dev G PID 17752, IAB local tab 2; Site tab 1 intocado. Modelo em solo vizinho, não umidade do ar da câmara.

Próximo passo imediato: criar branch 7B2 codex/gases-e-ventilacao sobre codex/agua-e-calor e implementar gases/ventilação por nós, conservação e respostas locais. Erosão/perdas de estoque ainda usam heurísticas globais; acoplar ao campo local nessa próxima etapa sem alegar calibração.

## Entrega anterior — 0.10.0

- Branch codex/solo-granular; base codex/simbioses-e-mimetismo.
- Fonte d4648b88506c3fe4e9a2cd2dfe60ddb291eaacb8, tag v0.10.0.
- PR #13 https://github.com/albreis/viveiro/pull/13. PRs #1–#13 preservados e encadeados; não duplicar.
- Deploy appgdep_6ae70061e5008191bdb9dbfee64c9ffa, succeeded em 01/11/2026 09:03:43 UTC. Mesmo Site privado, acesso só do proprietário confirmado.
- Granular: agregados de terra solta com gravidade, atrito de Coulomb, contato dissipativo, grade espacial e controle/replay do repouso. Solo compacto continua implícito; depósitos externos visuais; nada calibrado. docs/granular.md.
- Suíte final completa: 103/103 em 367449 ms; TypeScript/Vite aprovados. Uma regressão de retorno foi corrigida com settleSupport também no reparo. Limpeza integral em 1688 ticks e asserção adicional de apoio dinâmico passou.
- Navegador: seed a, queda no dia 171 (0,047 u³); no dia 172,6 material acomodado e parcialmente retirado (0,025 u³). Ajuste para 20° e recarga preservaram o estado. Sem novos erros após corrigir o carregamento parcial HMR; não confundir o erro antigo de null/oninput em 08:37 com estado atual.
- Screenshots viveiro-0.10.0-terra.png e viveiro-0.10.0-bloqueio.png. IAB local tab 2 pausada no dia 172,6, duas colônias/115 formigas; view foi resetada para perspectiva pela recarga. Dev G PID 17752, porta 4173. Nenhum teste pendente.

## Entrega anterior — 0.9.0

- Branch codex/simbioses-e-mimetismo; base codex/cronograma-biologia-fundacao. Versão 0.9.0.
- Fonte 526d7ded6c0f531bbbd7677add22269e0c92524d, tag v0.9.0.
- PR #12 https://github.com/albreis/viveiro/pull/12. Base documental PR #11 https://github.com/albreis/viveiro/pull/11, que depende do PR #10. PRs #1–#12 abertos e encadeados; não duplicar nem mesclar main sem instrução.
- Deploy appgdep_6ae6f7a6ab9881918ecf7ac1e80276ef, succeeded em 01/11/2026 08:26:27 UTC.
- Site privado https://viveiro-caos-formigueiro.everaldodev.chatgpt.site ; projeto appgprj_6ae6364bc4488191b2757449ed3f7e94. Acesso só do proprietário e zero visitantes externos confirmados antes de publicar.
- Preservar versões anteriores: 0.8.0 fonte 35296be9bc4d89b4fef1c9d9eabaad8e4ca50faa; 0.7.0 e6e4790185fab8788cccdaf35dcc8f243e397c35; 0.6.0 0aec356a9a9d3ef8cbce227dae5577dd9874a34d; 0.5.0 e149fe8944b315bbff078a4f1be7a471c3297145. Tags correspondentes preservadas.

## Implementado

5B/5C: fundação física de alados com orçamento materno, naníticas, coortes reprodutivas pagas e filhas no mesmo habitat com estoques/genética/parentesco independentes. Limites: quatro registros de colônia, 450 adultos/crias, duas frentes operárias. Documentos fundacao.md e colonias-filhas.md.

6A: perfis químicos abstratos, máscaras temporárias, reconhecimento local pelo ar, postura/recuo/dano e território conservativo. Revestimento pelo solo e infiltração exploratória com transporte de estoque real. docs/odores-e-territorio.md.

6B: pulgões por seed associados a plantas, seiva debitada, melaço/assimilação/perdas contabilizados, coleta e defesa locais. Lagartas cuco de odor compatível, transporte com apoio até o berçário, deposição e alimento debitado de doadoras próximas. Snapshot conserva estados e liga habitat comum no restore. UI com instâncias e aproximação da câmera. docs/simbioses.md. Limites: pulgões agregados, população inicial de até três lagartas; sem pupa/borboleta adulta, sem calibração por espécie. Não tratar essas estratégias combinadas como universais.

## Verificação da 0.9.0

- Suíte completa: 96 testes aprovados em 366956 ms.
- Depois: 19 testes químicos/ecológicos após ajustes de saúde/normal/carga e dez ecológicos após impedir crescimento sem seiva. Um teste novo cobre a planta esgotada; total no repositório agora 97 casos, sem alegar uma execução completa de 97.
- TypeScript e Vite finais aprovados. Módulos novos do modelo com 9–64 linhas, renderer separado.
- Transporte integrado da lagarta: 125 ticks, maior passo 0,081991 e erro máximo de apoio 0,000296.
- Navegador: seed a pausada no dia 171, duas colônias, 115 formigas; 99 pulgões em seis plantas, 16,41 u. de melaço coletadas, duas adoções e 1,51 u. cedidas às lagartas. População inicial de lagartas já terminou a vida; contadores são acumulados. Zoom, corpos/gotas e console sem erros conferidos.
- Screenshots viveiro-0.9.0-pulgoes.png e viveiro-0.9.0-relacoes.png no diretório autorizado do Codex. Chrome do usuário intocado; IAB local tab 2, Site tab 1.
- Dev foi religado no G: HTTP 200; PID atual em .runtime/dev.pid. Deixar rodando. Nenhum teste pendente.

## Cronograma ampliado pelo usuário

Material de outra IA foi registrado ao final do cronograma como etapas 9–14: perfis por espécie, fundação/selamento, desenvolvimento e diapausa, clima espacial, espermateca/longevidade e relógios de anos. Detalhes em docs/biologia-planejada.md. Commit documental 46e9d8f enviado na branch codex/cronograma-biologia-fundacao, PR #11. A 6B recebeu esse commit por fast-forward, sem colocar código 6B no PR documental.

Faixas de 12–24 h, 1–7 d, 35–60 d, 15–30 anos e alegações derivadas de 52%/68% permanecem hipóteses a validar, não timers novos. Distinguir umidade relativa de água no solo e irradiância de temperatura. Longevidade, número de parceiros e trade-offs não são universais. As referências primárias e dependências estão no documento.

## Próximo passo concreto

Criar codex/agua-e-calor a partir da 7A para 7B1: campo tridimensional coarse de água nos poros e temperatura, independente da umidade relativa do ar. Proposta ainda NÃO implementada: grade de cerca de 20x8x13 amostras sob o relevo, fluxos conservativos locais de água (diferença de saturação/capilaridade reduzida + gravidade), chuva/infiltração e evaporação com balanço explícito, condução de calor e fonte solar exploratória. Novo controle independente de temperatura do ar; umidade atual passa a ser rotulada como relativa do ar. Amostrar o entorno das plantas e das formigas para leitura/resposta local. Evitar apresentar água nos poros como umidade do ar da câmara ou resolver inundação sem modelo.

Executar o campo global uma vez por tick/família, preferencialmente com subpassos e frequência reduzida para não tornar o ABM caro; conservar água e calor nos testes fechados, contabilizar fronteiras e manter valores finitos. Coeficientes exploratórios e perfil inicial explícitos, sem deduzir estado do solo de 52% de RH. Medir custo e incluir snapshots/replay e visualização observável. Não reexecutar 6/7A já publicadas.

Depois 7B2 gases O2/CO2 e ventilação no grafo com condutância dependente de geometria, respiração e balanços; 7C suporte estrutural; 8 RL/persistência/avaliação; novas 9–14 conforme dependências. Referências primárias já localizadas: Richards 1931 DOI 10.1063/1.1745010 (capilaridade/gravitacional, não confundir aproximação com solver completo); PMC8611346 (experimentos de ventilação/CO2 em Acromyrmex, efeitos de difusão, vento e convecção dependentes de arquitetura). Modelos e taxas precisam de dados para calibrar.

Dados reais continuam necessários para calibração. O Site avança no navegador; não há executor contínuo em nuvem. JSON das colônias ainda repete habitat; persistência longa/compactação é etapa 8. Previsões de populações maiores são computacionalmente caras, a medir na etapa 8.

## Ambiente e publicação

Escritas atômicas e já formatadas; normalizar CRLF antes de substituições multilinha. Código em src e dist gerado pelo Vite. Usuário pediu dev ligado no G: não encerrar. Logs .runtime/ ignorados.

Push apenas da ref da entrega e tag específica: push --all já foi rejeitado por escopo amplo. Não enviar branches alheias nem mesclar main. Cada etapa tem testes, navegador, commit/push e PR sobre a base anterior.

Sites: get_site e credencial, helper de abertura no HEAD corrente antes de empacotar. Credenciais só em memória/stdin. Arquivo tar fora do checkout; G:\Projetos\viveiro-0.9.0.tar.gz e G:\Projetos\viveiro-0.10.0.tar.gz já publicados. Guardar literalmente project_id/commit_sha/archive retornados. Fonte publicada é a tag, enquanto o checkpoint posterior contém os IDs do deploy.
