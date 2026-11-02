# Continuação do Viveiro

Atualizado em02/11/2026 após publicação da0.35.2/P1.5.
Ler AGENTS.md e docs/cronograma.md. Trabalhar emG:\Projetos\viveiro.
Manter dev4173 emG, semexecutor concorrente; preservar saves, tags e privacidade.

## Git e entrega atual

Branch codex/pwa-offline, PR47 sobre codex/guias-docentes/#46.
PRs32–47 ainda encadeados na última checagem; main15781d2. Conferir novos merges.
Fonte/tag v0.35.2:2e978cfb8b86481063300e7556084b145e00e744.
Metadados/checkpoint são posteriores à tag. Não retag/recriar versões.
Tags0.35.0/93eba21329c4726cfc9a4ed0c962f3d706998afc e0.35.1/c31c041ef41d00f83a51f1abecf6e9221bce54ce
ficam preservadas só noGit, semdeploy. A configuração Vite faltava nesses
commits;0.35.2 contém a fonte completa. Evidências antigas marcadas previewOnly.
A0.35.2 também normaliza Response redirecionada apósvalidação, semremover
conteúdo ou cabeçalhos, para permitir navegação canônica offline.

## P1.5 /PWA

Preparo opcional no build público, cache limitado a/release própria; inclui
Three.js,4 Workers, guias e assets. PNG192/512 reais, manifesto standalone.
Busca semcookies e rejeita privado/no-store/login/bytes alterados. HTML exige
marcador da versão; não remove código deinfrastrutura que a hospedagem injeta.
Marca completa porúltimo, checa presença e limpa apenas seu escopo. SemskipWaiting,
semrecarga forçada ou acesso aIndexedDB pelo worker. Remover cópia preserva saves.
Dev e Site privado semservice worker/manifesto, mantendo autenticação online.

35/35 testes dirigidos em2.270,6035ms, build privado336 módulos/TS estrito,
build público isolado e hashes conferidos.4/4 de depósito depois da tag.
QA IAB4185: servidor desligado, fechar/reabrir, aula/checkpoint/reload e guias.
QA IAB4186: servidor com308 canônico e depois desligado; reload/guia/checkpoint
passaram. Rede do computador não foi desligada; indisponibilidade do servidor
foi real. Instalação noSO e outros navegadores não ensaiados.
Público real:34 arquivos preparados, reload e guia/retorno, console limpo;
SEMENTE-42/D2,6 pausada preservada. Cache dessa release deixado preparado.
Ver pwa-offline.md e validacoes/offline-0.35.2.json.

## Sites publicados

Privado original: https://viveiro-caos-formigueiro.everaldodev.chatgpt.site/
Projeto appgprj_6ae6364bc4488191b2757449ed3f7e94, custom/revisão1,
proprietário único e zero externos. .openai/hosting.json mantém ID/staticdist.
Deploy appgdep_6ae88a73452481919ed6acef01f5aa4b, succeeded,13:05:06UTC.
ArquivoG:\Projetos\viveiro-0.35.2.tar.gz preservado.

Público: https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/
Projeto appgprj_6ae80cd45fdc8191be8315696a383393, public/revisão2.
EspelhoG:\Projetos\viveiro-publico, fonte a11ec676b152e3b660fd185d7a0f0789adfe6134.
Deploy appgdep_6ae88adf76e08191a611ac5b8f4d5d50, succeeded,13:06:52UTC.
ArquivoG:\Projetos\viveiro-publico-0.35.2.tar.gz,141 arquivos/9.605.120bytes.
Galeria mantém0.30.0/0.30.1/0.31.0/0.32.0/0.33.0/0.34.0 eacrescenta0.35.2.
HTTP semcookies/Authorization: páginas200 e27 arquivos nãoHTML comhashes exatos.
IDs deversão, datas e hashes completos emvalidacoes/deploy-0.35.2.json;
HTTP emvalidacoes/publicacao-0.35.2.json. Não repetir save/deploy concluído.
Não publicar Site privado como público, recriar projetos ou sobrescrever tags.

## Citação e pacote

CFF1.2.0/.zenodo.json para0.35.2/tag real, autoria coletiva mantida.
Esquema oficial validado; PythonZIP conferiu todos os membros/hashes e configVite.
.runtime/deposits/deposit-qpwRNb/viveiro-v0.35.2-source.zip,
504 arquivos/1.422.413bytes, SHA256
18ffa067b03d57262688025de147c0ef5b18caa1c70e253d6b3981b7c634c68c.
Fonte selecionada da tag e metadados posteriores;9 textos públicos deensino
incluídos para o build. Documentos operacionais e saves excluídos; detector
preservado. Nenhum DOI/upload. Conta/autoria perguntadas antes, semresposta;
não inferir nome/ORCID ou pedir token. P0.4B/C continuam externos/merge.

## Ambiente

DevPID17752, G/4173, HTTP200. AbaIAB20 marcada como entrega; SEMENTE-50088,
D62,5,14 adultos, pausa e perfil leve preservados. Abas antigas4/16 emerro;
preferir20, semrepetir APIs nas páginas deerro. Save não foi perdido.
Manual manual-2e91b636-785f-4f66-bb84-ff832aa62547 preservado.
Previews4185/58348/42706 e4186/28968 encerrados; abas18/19/21/22 deQA fechadas.
Nenhum helper/teste pendente. Cópias deQA removidas, checkpoints deQA preservados.
Capturas viveiro-0.35-offline-preview.png, viveiro-0.35.1-offline-redirects.png
e viveiro-0.35.2-offline-publicado.png no diretório devisualizações autorizado.
Npmci comdev aberto pode bloquear DLL; não reinstalar semnecessidade. Preferir
escrita atômica emJSON/config para reduzir leituras parciais pelo watcher.

## Próximo passo concreto: P1.6 /CSV e acessibilidade

1. Conferir Git/PRs; criar branch codex/ própria sobre#47 se ainda aberto.
2. Inspecionar history/record, loop fixed e snapshot/restore. CSV diário deve
usar observações reais no mesmo tick: população, prole, alimento, temperatura
e gases, comunidades e metadados deversão/seed/cenário. Não inventar clima/gases
históricos para saves antigos; declarar os limites da série disponível.
3. Garantir exportação segura e comparação A/B, semconfundir previsões comdados
observados ou alterar RNG/relógio. Testar determinismo e codec se mudar estado.
4. Conferir teclado, foco, rótulos/contraste/semântica e realizar auditoria
Lighthouse real quando disponível. Não declarar WCAGAA ou nota semmedição.
5. Publicar entrega validada, tag/PR e checkpoint. Não rodar build-public da
mesma versão após commit só demetadados; cada release temfonte imutável.

P1.1B/hardware escolar, P1.2B/aluno novo, P1.4B/revisão docente eP1.7/pilotos,
calibração eZenodo exigem pessoas/dados reais. Continuam pendentes. P5 porúltimo.
Não desativar retomada: ainda há itens implementáveis. Não contornar limites.
