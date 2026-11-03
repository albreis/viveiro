# Revisão dos P2 ativos — publicados na 0.45.0

03/11/2026. Escopo técnico P2.1–P2.7 concluído e publicado. P2.8 foi descartado.
Isso não encerra as validações externas P1/P3 nem os aceites de comunidade P4.

| Item | Entrega | Situação |
| --- | --- | --- |
| P2.1 | ODD, estados, agenda, sete vetores e referência independente do solver. | Publicado desde 0.38.0. |
| P2.2 | CLI e paridade portátil: quatro cenários, 4.400 ticks por ambiente. | Publicado desde 0.40.0. |
| P2.3 | Varreduras paralelas, 50 execuções, retomada CLI/navegador. | Publicado desde 0.41.0. |
| P2.4 | Morris: 104 execuções, 12 entradas, índices e dados brutos. | Integrado e publicado na 0.45.0. |
| P2.5 | Interfaces tipadas, política em um arquivo, comparação pareada e restore. | Integrado e publicado na 0.45.0. |
| P2.6 | Editor de 12 entradas, faixas/fontes, versões imutáveis e reimportação. | Integrado e publicado na 0.45.0. |
| P2.7 | UI, documentos e guias pt-BR/en; 320 px, paridade e offline. | Integrado e publicado na 0.45.0. |

Os PRs #65–#68 foram consolidados pelo #71, merge
f433f805444d762d301f8babc365a83930982272, tag imutável v0.45.0. O GitHub também
marcou o #70 como mesclado ao integrar essa fonte. Branches e tags preservadas.

[Release](https://github.com/albreis/viveiro/releases/tag/v0.45.0) ·
[GitHub Pages](https://viveiro.ersolucoesweb.com.br/releases/v0.45.0/) ·
[Recibo](validacoes/release-0.45.0.json).

## Verificação final

- 461 testes da integração passaram. O teste do pacote real passou após criar a
  tag local, antes do push: **462 testes únicos aprovados**. Os três testes de
  metadados foram repetidos nesse passo, sem contagem duplicada.
- TypeScript estrito, Vite 438 módulos e build público versionado aprovados.
- Alerta CodeQL alto corrigido no fluxo DOM→href por registro de rotas internas
  e codificação de componentes. Duas análises e CodeQL verdes, sem supressão.
- Worker da release pública executou 300 ticks; CSV e manifesto baixados foram
  idênticos à CLI da mesma versão/política. Brutos: tests/fixtures/release-045.
- Navegação pt-BR/en e ODD conferidas no navegador. QA anterior verificou 320 px,
  inputs/pausa/resultados preservados e guias offline com servidor desligado.
- GitHub Pages publicado pelo workflow da main; Site privado atualizado com o
  mesmo commit e audiência owner-only preservada. Dev 4173 continua rodando em G.

CFF e Zenodo foram preparados antes da única release consolidada. Nenhum depósito
manual ou versão intermediária foi criado. O DOI automático 0.45.0 e o botão de
citação ainda precisam de conferência (P0.4); o DOI 0.36.0 não é da versão atual.

## Limites e próximo escopo

Morris descreve o cenário exploratório ensaiado, com cinco efeitos populacionais
não nulos; posições empatadas em zero não são descobertas empíricas. Extensões
executam código local de confiança, sem sandbox de terceiros. O editor expõe 12
entradas, não todos os coeficientes internos. Paridade exige versão/plano/política
iguais; a trajetória nativa do terrário permanece preservada.

Restam migração gradual de UI/renderização para TypeScript; conferência DOI/citação;
validação escolar/acessibilidade/pilotos (P1); dados reais, parceria, calibração,
validação reservada e publicação científica (P3); comunidade, galeria e oficinas
(P4). Calibração por material/espécie e revisão docente também permanecem abertas.
Nenhum desses resultados externos foi inventado. P2.8 e P5 continuam descartados.
