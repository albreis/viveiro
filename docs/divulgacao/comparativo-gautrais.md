# Revisão parcial do comparativo editorial

15/11/2026. Atualização solicitada pelo mantenedor após G0/G1.
[Kit com gráfico](kit-divulgacao.html#ranking) · [Registro da revisão](comparativo-gautrais.json).

## Notas e justificativa

| Contexto/critério | Antes | Revisado | Evidência usada |
| --- | ---: | ---: | --- |
| Universidades: rigor e transparência | 8 | 9 | Plano fixado antes das novas métricas; partição por réplica, exposição anterior, dependência dos dados e limitações publicadas |
| Universidades: reprodutibilidade | 9 | 10 | Fonte/protocolo versionados, 5.019 arquivos conferidos, saída imutável e 562 testes, com conferência CLI/navegador |
| Universidades: validação e literatura | 3 | 3 | G2–G4, MAE/cobertura e calibração biológica ainda pendentes |
| Escolas: rigor conceitual | 8 | 9 | Separação explícita entre verificar código, ajustar parâmetros e avaliar biologia |

São escolhas editoriais desta rubrica. O valor 10 não representa perfeição,
replicação independente ou certificação científica. As evidências incluem a
infraestrutura anterior a G0/G1: não se mede aqui um efeito causal isolado da etapa.

Os pesos foram mantidos: universidades passam de **6,05 para 6,40 (+0,35)**;
escolas, de **6,70 para 6,85 (+0,15)**. Os demais critérios do Viveiro e as
notas dos concorrentes permanecem na base histórica, sem nova auditoria.
Este recorte não é uma avaliação completa de todas as entregas recentes.

## Como ler a comparação

As linhas projetadas para fases futuras foram retiradas do gráfico/tabela
atuais. O plano antigo continua identificado como histórico, separado dos
aceites do cronograma. A ordenação só expressa a matriz editorial conservada;
não comprova liderança no mercado ou superioridade científica.

A documentação oficial confirma ferramentas próprias de experimentação em
[NetLogo](https://docs.netlogo.org/behaviorspace),
[GAMA](https://gama-platform.org/wiki/Changelog) e
[Mesa](https://mesa.readthedocs.io/stable/overview.html). Essas referências
não bastam para uma nova nota comparativa; não foram usadas para alterar
silenciosamente suas pontuações históricas.

O ganho do Viveiro é de rastreabilidade e preparação metodológica. As 13
réplicas pares continuam sem nova avaliação de métricas. O inventário anterior
já conhecia médias, e Gautrais reutiliza experimentos de Buhl 2004; não se
declara uma reserva inédita ou replicação independente.

Evidências: [PR #135](https://github.com/albreis/viveiro/pull/135),
[recibo G1](../validacoes/gautrais-2014-g1-qa.json),
[análise e figura](../validacoes/gautrais-2014-desenvolvimento.md),
[G0–G4](../planejamento/gautrais-avaliacao.md). A nota biológica só poderá
ser revista com os resultados apropriados, inclusive se forem desfavoráveis.

## Publicação

**Novas tags e GitHub Releases pausadas pelo mantenedor em 15/11/2026.**
Continuar em branches/PRs e no dev. Reunir mais entregas antes de uma nova
versão consolidada; aguardar nova instrução para publicá-la. Não fazer
depósitos manuais no Zenodo nem reescrever tags existentes.

## Conferência

Nove testes de pesos, notas, preservação dos concorrentes e cronograma;
build Vite/TypeScript e Chrome desktop/móvel aprovados, sem erros de página.
[Recibo](comparativo-qa.json). O QA de tela é reproduzível com
`node scripts/qa/editorial-comparison.mjs`, mantendo o dev ativo.
