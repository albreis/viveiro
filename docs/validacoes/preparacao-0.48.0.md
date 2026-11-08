# Preparação da versão 0.48.0

08/11/2026. Publicação consolidada autorizada pelo mantenedor, com integração
GitHub–Zenodo já configurada. Não criar depósitos manuais ou versões intermediárias.

## Composição

- PR #130: morfologia opcional na arena, contrastes de locomoção/carga/acesso,
  dados e resultados preservados. Não substitui o World.
- PR #131: Narbonne v3 e acesso físico às frentes no World 3D; perfis v1/v2
  permanecem fixados, sem alterar saves antigos.
- PR #132: carrossel, fonte editável e dados de divulgação.
- PR #129: planejamento K0–K6, propósito e TRACE incorporados à documentação.
- PR #128: piloto inicial de infraestrutura fora da release, com branch e
  commit 8aa0bcc preservados. Réplica física de Buhl continua pendente.

A branch de preparação contém os commits originais de #130/#131/#132. A
integração final deve conservar esse histórico e não apagar branches/tags.
Não declarar a calibração ou B7 concluídos.

## Metadados

`package.json`, lock, CITATION.cff e .zenodo.json usam 0.48.0 e data 08/11/2026.
Autoria: Everaldo Reis da Silva, ORCID 0009-0008-0719-8722. Descrição distingue
arena e World e não declara DOI antes do depósito automático. O .zenodo.json
é a fonte de metadados usada pela integração quando ambos os arquivos existem.
[Referência oficial](https://help.zenodo.org/docs/github/describe-software/).

## Verificação antes da tag

**554/554 testes aprovados**, sem falhas, após corrigir os links do ODD e
isolar a tag de teste em um repositório temporário. Build Vite e build público
aprovados. Chrome 157 em português/inglês: paridade CLI, lateral, primeira
pessoa, retomada e bundle versionado, sem erros JavaScript. O cronograma e
os arquivos operacionais continuam fora do bundle público. CodeQL aprovado.

As 12 trajetórias pareadas repetiram exatamente os valores arquivados até
100 ticks. O hash inicial só divergia no campo de observação
`modelVersion`: 0.47.0 → 0.48.0. A normalização desse campo foi aplicada
apenas à cópia usada na comparação; nenhum estado físico foi alterado.

[Recibo técnico completo](release-0.48.0.json). Depois deste recibo, só
documentação de publicação pode mudar sem repetir os testes do motor.

A publicação será uma única tag e GitHub Release, com notas da versão. O
workflow da tag acrescenta o artefato a `site-publico` e dispara o deploy
na main, respeitando a proteção existente do ambiente. O Zenodo recebe
pela integração automática; não haverá upload ou depósito manual.
[Fluxo de arquivamento](https://help.zenodo.org/docs/github/archive-software/github-upload/).
