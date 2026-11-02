# Registro histórico

Checkpoint passado. Use docs/CONTINUAR.md para a prioridade atual.

## Última entrega publicada — correção de entradas (0.26.1)

Branch codex/bordas-das-entradas; PR #35 sobre #34. Fonte dead04386ca186ee00711e25dc3f3da7a0ddee18,
tag v0.26.1. Deploy appgdep_6ae7e4ed4dfc8191aef149ab7056d0a7 succeeded em02/11/2026 01:18:49 UTC
(01/11,22:18 São Paulo). Versão
appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_f5e27a70858081918c474f033985fca5. Mesmo Site
privado. Arquivo ../viveiro-0.26.1.tar.gz preservado. Removido EntranceView.js com toros;
módulo TypeScript pequeno conserva só o rótulo. A própria malha define a borda. Mesh-axes adiciona
colunas de centros para todas as entradas e refina contornos de até16 (prioridade às estreitas), com
planos do vidro e da superfície. Células compartilham os eixos; sem remendos independentes. Física e
saves inalterados.

Reprodução anterior: abertura r0,12 entre células tinha primeiro contato do raycast em y−0,01053 em
vez do fundo−0,12. Teste corrigido exige fundo abaixo−0,10. Quatro lados conferidos também por raios
horizontais/verticais, sem tampa falsa; amostras limitadas a menos de2 milhões no máximo atual48
nós.19/19 regressões passaram em4.186 ms (.runtime/entrance-regression.log), build279 módulos
aprovado. Novo ensaio global712.140 vértices/erro máximo0,00015. A malha pode ter mais triângulos;
não é medição de FPS em hardware escolar.

Navegador: a/D267 recuperado em pausa para QA dos quatro lados; SEMENTE-50088/D62,5 recuperado
depois e inspecionada sua entrada. Console sem erros. Screenshot viveiro-0.26.1-entradas.png
preservado. Câmera devolvida à perspectiva, interior desligado; dev G e saves mantidos. IAB local
atualtab4; a aba2 anterior foi liberada pelo navegador. Nenhuma alteração na audiência do Site.

13A preservada e enviada ao GitHub: codex/espermateca-e-fertilidade, commit46a1aaa;251/251 testes
completos e build passaram, falta QA/publicação. Não perder ou refazer. Nenhum teste pendente.
Usuário pediu agora conferir aranhas presas em árvores/arbustos: após publicar esta correção, abrir
branch própria para diagnóstico/correção antes de retomar13A. Atualizar13A com os fixes depois.
Seguem13B,14,P0–P5;P5 último.

Próximo imediato: branch codex/ própria para conferir aranhas; analisar surface-obstacles.ts,
surface-motion.ts e predator-step.js e reproduzir aranha encurralada por vegetação. 0.26.1 já
publicada, não repetir. Nenhum executor concorrente iniciado.

