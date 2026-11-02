# Aranhas junto à vegetação

Correção 0.26.2, branch codex/aranhas-e-vegetacao. Arquivos pequenos em src/modules/predators; integração no movimento superficial e na seleção local de pulgões.

## Reprodução e causa

Uma árvore ou arbusto com pulgões atraía a aranha para o centro exato da planta. A cada passo ela ultrapassava o centro e invertia o rumo, inclusive durante a espera entre capturas. O corpo parecia preso e as pernas continuavam andando. Em 1.200 passos isolados por espécie, o raio após a aproximação ficou em0,02 u. e houve1.099 inversões de direção; o percurso acumulado foi28,8 u. Não era falta de animação, era ausência de progresso líquido.

Havia também um bloqueio absoluto em torno das entradas: se uma boca surgisse debaixo de um predador, todos os pequenos passos seguintes eram recusados, inclusive para sair.

## Comportamento corrigido

- Aproximação até uma distância de trabalho, sem perseguir indefinidamente o centro. Após comer ou desistir de uma visita, a aranha se afasta e ignora temporariamente aquela planta.
- Caules lenhosos e cactos usam uma aproximação de largura no nível do chão. O raio acompanha a biomassa e a escala visual; copas e folhagem não viram círculos sólidos. Não é colisão exata com toda a malha vegetal nem escalada 3D.
- Sobreposição após crescimento ou importação permite passos que reduzam a penetração total. A mesma regra permite sair gradualmente da área de exclusão de uma entrada nova.
- Uma âncora mede deslocamento líquido. Sem progresso suficiente por50 passos, ocorre um desvio temporário de35 passos. As escolhas dependem do estado/ID, sem sorteios adicionais para o desvio, sem teletransporte ou energia criada.
- Visita sem captura dura no máximo40 passos após a aproximação (ou100 de tentativa total); a planta evitada fica fora da seleção por200 passos. Esses tempos são heurísticas de navegação, não observações calibradas de uma espécie.
- Memória persistente por aranha, com validação no import/restore. Saves antigos sem memória continuam aceitos e recebem o estado no primeiro passo. O conserto altera a trajetória futura dos predadores de forma determinística; não reescreve a história salva.

## Verificação

Seis testes novos cobrem árvore, arbusto, crescimento sob o corpo, entrada surgindo sob a aranha, desvio de caules e continuidade dos saves. Nas duas reproduções de1.200 passos: distância mínima0,292 u., nenhuma inversão contínua, deslocamento de saída acima de1 u. e maior passo0,04 u. nesse cenário sem caça a formigas. A velocidade de caça já existente continua0,062 u./passo. Não interpretar os testes como garantia de acesso a qualquer região fisicamente fechada.

12/12 testes dirigidos com ecologia e249/249 na suíte completa (250.929 ms), log local .runtime/spider-suite.log. Build TypeScript/Vite aprovado. Sem dependências novas. No navegador, save a/D267 em pausa: aranha adicionada junto à árvore e deslocamento observado até D268,3; console sem erros. Checkpoint manual-fde0b27d-5d85-4c91-ad56-01420e28c742, Aranhas na vegetação · QA. Imagens nativas antes/depois preservadas. SEMENTE-50088/D62,5/labv5 recuperado em pausa depois, ferramentas de intervenção desligadas.
