# Preparação de publicação · P3.4

[Rascunho técnico em inglês](preprint-rascunho.md) ·
[Citação do software](../../CITATION.cff) · [ODD](../../src/i18n/locales/en/docs/odd.md).

Este material documenta como repetir um experimento e quais evidências
ainda faltam. O DOI do software é diferente do DOI de um artigo. O
[registro Zenodo da versão 0.46.0](https://doi.org/10.5281/zenodo.23932885)
já existe; não fazer novo depósito para o mesmo arquivo.

## Reprodução com a release 0.46.0

Num checkout separado da tag [v0.46.0](https://github.com/albreis/viveiro/tree/v0.46.0)
(`7f4d20674206916ea443ef2f359097da5ca18731`), instale com `npm ci` e Node 24.
Copie [o plano da demonstração](plano-demonstracao.json) como `plano.json`
para o checkout separado. Rode na raiz:

```sh
node scripts/run-experiment.ts --plan plano.json --out resultado-novo
```

A pasta de saída deve ser nova. O plano corresponde ao cenário A da
galeria para solo/ângulo de repouso, com seed `GALERIA-SOLO-01`,
perfil `generic-microclimate-demo@3`, 300 ticks e aritmética `stdlib-f64-v1`.
Use os bytes gravados, sem reexportar por um editor de planilhas.
Compare os SHA-256 com `sha256sum` ou `Get-FileHash -Algorithm SHA256`:

| Arquivo | SHA-256 |
| --- | --- |
| `dados.csv` | `a3386d85b9b3bcf30be01e5bcaa7100e3d8a468780b19c3f1f1f1f47261cc945` |
| `manifesto.json` | `29e9af5ea11480a2b7c18191056a171ff17f6cd6b2bc285c0ff6a12359ac69f3` |

Ambos coincidiram em 04/11/2026 em Windows, Node 24.22.1, com fonte exportada
da tag. Dependências já estavam instaladas no checkout principal. Compare
com o [recibo da entrega pública](../validacoes/release-0.46.0.json).
Coincidência de hashes verifica o exemplo computacional. Validação com
formigas e resultados de ensino precisam de outras evidências.

## Condições para preprint e JOSS

- **Histórico e uso em pesquisa:** as [regras de triagem do JOSS](https://joss.readthedocs.io/en/latest/submitting.html#pre-review-screening-criteria)
  pedem mais de seis meses de histórico público ativo e uso demonstrável
  em pesquisa. A criação do repositório foi em 31/10/2026 (API do GitHub).
  Mesmo se público desde a criação, a idade mínima só poderia ser
  ultrapassada após abril de 2027. A passagem do tempo não substitui
  evidência de desenvolvimento contínuo, uso e feedback. A editoria decide.
- **Escopo:** o preprint de métodos pode relatar ensaios e limitações. O
  artigo de software do JOSS deve focar necessidade, contribuição e
  uso em pesquisa, conforme os [critérios de revisão](https://joss.readthedocs.io/en/latest/review_criteria.html).
  Completar as análises de Buhl com proveniência e incerteza; incluir o
  piloto escolar se realizado, sem inventar resultados ou fazer do piloto
  uma condição editorial que a revista não exige.
- **Autoria e assistência:** confirmar nomes, afiliações e contribuições
  com os autores. O crédito coletivo na citação da release pode permanecer.
  Registrar ferramentas de IA, versões conhecidas, áreas afetadas, revisão
  humana e decisões dos autores. Não preencher declarações por eles.
- **Entrega:** revisar texto e referências, escolher a versão e confirmar
  a correspondência entre fonte e arquivo. Submissão e pareceres são
  externos ao preparo técnico. Uma eventual versão de aceite deve seguir
  a integração GitHub–Zenodo e o fluxo de publicação combinado.

Ao retomar, use o [cronograma técnico](../planejamento/tecnico.md) e registre
evidências reais para cada etapa. Esta preparação não encerra P3.4.
