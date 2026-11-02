# Continuação do Viveiro

Atualizado em 02/11/2026, após publicação da0.31.0.
Ler AGENTS.md e docs/cronograma.md. Trabalhar em G:\Projetos\viveiro.
Manter dev4173 emG; não iniciar executor concorrente nem contornar limites.
Preservar branches, tags, saves e a audiência privada original.

## Git e entregas

Branch atual: codex/perfil-leve; PR#43 sobre codex/citacao-e-deposito/#42.
PR#42 sobre codex/publicacao-por-tag/#41. Main15781d2 na última checagem.
PRs32–43 estavam abertos; conferir merges antes de agir. Não duplicar PRs.
Tag v0.31.0: 1a5fa67038c8fe244844136257f5328becbf5e4e.
Metadados e checkpoint foram atualizados depois da tag; não reescrevê-la.

P0.3 entregue: Site público separado e versões por tag, original privado.
P0.4A: CFF válido e pacote de fonte selecionada. P0.4B/DOI ainda depende de
conta/depósito reais; P0.4C/botão do GitHub depende do merge na branch padrão.
P1.1A: perfil leve publicado; P1.1B/30fps em hardware escolar segue pendente.
Demais itens P1–P5 continuam abertos. Não desativar a automação.

## Privado original /0.31.0

URL: https://viveiro-caos-formigueiro.everaldodev.chatgpt.site/

- Projeto appgprj_6ae6364bc4488191b2757449ed3f7e94.
- Audiência custom:1 proprietário, zero externos, revisão1 preservada.
- Fonte/tag: 1a5fa67038c8fe244844136257f5328becbf5e4e /v0.31.0.
- Versão appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_ddf952254d7881919a7082a97fe61725.
- Deploy appgdep_6ae841d09ae88191a0bb522e203bc708, succeeded em02/11 07:55:14 UTC.
- Arquivo G:\Projetos\viveiro-0.31.0.tar.gz preservado.
- Manifesto .openai/hosting.json mantém o ID original e static.directory=dist.

## Público separado /0.31.0

URL: https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/

- Projeto appgprj_6ae80cd45fdc8191be8315696a383393, public/revisão2.
- Espelho G:\Projetos\viveiro-publico, manifesto próprio, static.directory=dist.
- Fonte do espelho c699ba75bcd0c98e30b9737f3ae2ad47eda4583f.
- Versão2 appgprj_6ae80cd45fdc8191be8315696a383393~appgver_392f94a11f8c8191b628ebc8d8365167.
- Deploy appgdep_6ae842b7456881919fb5f6498ea12ecf, succeeded em02/11 07:59:00 UTC.
- Arquivo G:\Projetos\viveiro-publico-0.31.0.tar.gz,45 arquivos/4.003.840bytes.
- SHA-256 019e4427214d84c5a9355fefc8bee8a54042a0a8d25db3f66978abe12fb62e57.
- Catálogo conserva v0.30.0 e v0.30.1 e acrescenta /releases/v0.31.0/.
- Não repetir save/deploy concluído, recriar Site ou substituir tag.
- HTTP sem Cookie/Authorization: raiz/catálogo/tag/manifesto200 e11 assets
  não HTML com hashes exatos. docs/validacoes/publicacao-0.31.0.json.
- QA real: perfil leve, previsão por contagem, primeira pessoa, retorno,
  reload com preferência/D2,6 preservados; console limpo. Aba temporária9 fechada.
  Nenhum save privado foi copiado. GitHub original permanece privado.

## P1.1A e ambiente preservado

Pixel ratio1, sombras desligadas,80 operárias desenhadas com câmera/seleção
prioritárias; todos os agentes simulados. Malha visual64×24×44 refinada nas
entradas, mesmo campo de colisão. Cargas acompanham a visibilidade da portadora.
Previsão por contagem explícita e medidor10s; preferência fora dos saves.
Novos módulos de UI/renderer/serviço em TS,21–101 linhas.

24/24 dirigidos finais em5.974ms; build316 módulos. Inclui entradas pequenas/
quatro bordas nos dois detalhes, invariância do mundo e resposta antiga do
Worker. Não é nova suíte biológica completa; modelo não foi alterado.
SEMENTE-50088/D62,5,14 adultos, pausa preservada. i5-1135G7/Iris Xe disponível,
viewport571×465 CSS/DPR1,25: completo58,7fps/300344tri; leve60,0fps/206120tri.
Não certifica hardware escolar ou carga grande. Ver docs/perfil-leve.md.
Dev PID17752 segue emG/4173; IABtab4 mantida, perfil leve selecionado.
Checkpoint original manual-2e91b636-785f-4f66-bb84-ff832aa62547 preservado.
Capturas viveiro-0.31-perfil-leve.png e viveiro-0.31-publicado.png no diretório
de visualizações autorizado. Nenhum helper/teste/preview temporário pendente.

## Citação e fonte para depósito

CFF1.2.0 e .zenodo.json agora citam0.31.0/tag1a5fa67, crédito coletivo já
existente na licença. Esquema oficial validado com jsonschema4.26.0.
Pacote: .runtime/deposits/deposit-wcJQPw/viveiro-v0.31.0-source.zip.
455 arquivos/1.285.685bytes, SHA5dd2cd029041c01f0a434005c3ebda497d9d1b4fcda0c93afeb9421cc813ee39.
Python zipfile independente conferiu tudo. O manifesto lista seis testes
operacionais/fixture excluídos; seus marcadores sintéticos acionaram o filtro.
Detector de credenciais preservado; testes do modelo e avisos de terceiros
incluídos. Documentos operacionais, saves, Git e hospedagem ficam fora.
Nada foi enviado ao Zenodo. DOI ausente; não inventar registro, ORCID ou nome.
Autoria/conta foram perguntadas em chat, sem resposta até esta entrega.
Ver docs/citacao-e-deposito.md e docs/validacoes/citacao-0.31.0.json.
Pacote anterior0.30.1 e suas evidências continuam preservados.

## Próximo passo concreto: P1.2

1. Conferir Git/PRs e abrir branch codex/ sobre#43 se ainda aberto.
2. Implementar tour de primeira visita em módulo pequeno de src/app, com
   teclado, opção de pular/reabrir e guia até seleção/primeira pessoa, sem
   reiniciar terrário, criar intervenções ou sobrescrever saves.
3. Testar navegação/estado e QA real; aceite com aluno novo em menos de2min
   depende de participante real. Não simular esse resultado.
4. Continuar P1.3/experimentos e demais itens implementáveis, mantendo
   dependências externas separadas. P5/clima real entra por último.
5. Entrega funcional: branch/testes/QA/commit/push/PR e publicação privada.
   Release pública exige fonte limpa e NOVA versão. Abrir espelho antes de
   acrescentar artefatos; helper com commands:[["node","build-static.ts"]].
   Não trocar IDs nem reescrever releases antigas.

Histórico anterior: [índice de checkpoints](continuacao/0357f01/README.md).
Commits anteriores preservam também os checkpoints de0.30/P0.4A.
