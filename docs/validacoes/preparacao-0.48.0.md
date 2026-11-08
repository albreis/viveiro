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

20 testes dirigidos do motor/arena/citação e build passaram na combinação
inicial. A suíte completa, paridade das trajetórias, navegador e build público
serão registrados antes de integrar a preparação à main.

A publicação será uma única tag e GitHub Release, com notas da versão. O
workflow da tag acrescenta o artefato a `site-publico` e dispara o deploy
na main, respeitando a proteção existente do ambiente. O Zenodo recebe
pela integração automática; não haverá upload ou depósito manual.
[Fluxo de arquivamento](https://help.zenodo.org/docs/github/archive-software/github-upload/).
