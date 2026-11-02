# Ajuste antes da publicação /0.35.1

Tag0.35.0/93eba21329c4726cfc9a4ed0c962f3d706998afc preservada, semdeploy.
PR#47 já aberto sobre#46. A hospedagem redireciona HTML;0.35.1 normaliza
somente os metadados deResponse apósvalidar, preservando conteúdo/cabeçalhos.
7 testes focados eQA emservidor com308 passaram; servidor4186/sessão28968
foidesligado e reload, guias/checkpoint funcionaram offline. Aba21 fechada,
cache deQA removido. Dev17752 eaba20 saudáveis, mesmo save62,5 pausado.
Próximo: rodada final, commit/tag0.35.1, atualizarPR47, sincronizar/publicar
ambos Sites comfonte real;0.35.0 fica apenas noGit. Metadados depois da tag.

---

# P1.5 em publicação /0.35.0

Branch codex/pwa-offline sobre#46; cache público implementado e QA offline passou.
Preview4185/sessão58348 foi desligado; reabertura/novo checkpoint/reload/roteiros
funcionaram sem servidor. Preview religado42706 só para remover a cópia de teste;
checkpoint preservado. Ambas as sessões encerradas, abas18/19 fechadas.
Dev17752/4173 HTTP200, nova abaIAB20 marcada, SEMENTE-50088/D62,5 pausada.
Abas antigas4/16 emerro não devem ser usadas. Não houve perda de save.
19 testes dirigidos passaram; conferir rodada publicação/depósito e build final.
Próximo: commit/tag v0.35.0, push/PR sobre#46, publicar privado online e release
pública offline nos Sites existentes. Atualizar citação/ZIP para o SHA da tag.
Depois P1.6/CSV e acessibilidade. Não desativar a retomada.

---

# Continuação do Viveiro

Atualizado em02/11/2026 após publicação da0.34.0/P1.4A.
Ler AGENTS.md e docs/cronograma.md. Trabalhar emG:\Projetos\viveiro.
Manter dev4173 emG; preservar branches, tags, saves e audiência privada.
Não iniciar executor concorrente nem contornar limites ou aprovações.

## Git

Branch codex/guias-docentes, PR #46 sobre codex/experimentos-de-aula/#45.
PR #45 cobreP1.3 e depende de#44. Os PRs#32–#46 continuam encadeados.
Main15781d2 na última conferência; buscar merges antes de agir.
Fonte/tag v0.34.0: 34c41f532187119ae30f5c30fb0886e2e462aa11.
Fonte/tag v0.33.0: ed78e3fe56e7b863fc06ee0f69cef40aeb371507, preservada.
Citação/checkpoint são posteriores às tags; não reescrever tags ou releases.

## Entregas deste ciclo

P1.3 entregue na0.33.0/#45: sete aulas com seed, A/B, câmera, pergunta,
condições iniciais e backup nomeado obrigatório antes de substituir o mundo.
38 testes dirigidos; abertura local em2,03–2,91s. Ver experimentos-de-aula.md
ou validacoes/aulas-0.33.0.json. Emcaso de falha de gravação ou mudança
concorrente, troca cancelada e mundo anterior pausado.

P1.4A entregue na0.34.0/#46: seis roteiros emdocs/ensino/ para as sete aulas,
com objetivo, tempo, passos, perguntas, gabarito e limites. Associação proposta
àBNCC conferida emfonte oficial. Fichas docentes sem pareceres inventados.
Link Guia do professor abre páginas de leitura/impressão, geradas dos próprios
Markdown pelo Vite; textos emTXT. Não há segunda fonte editável nem runtime novo.
Tipos deNode24 adicionados apenas a devDependencies. npmci encontrou DLL
aberta pelo dev; reparo incremental npm install --ignore-scripts concluído,
build e servidor saudáveis, sem interromper o processo17752. Não repetir
npmci enquanto o dev usar o binding nativo. Não apagar a pasta temporária
binding bloqueada; não é pendência do modelo.

Receita v2 inicializa solo/ar no dia0 sem passos ou consumo; evita painel
anunciar ausência de galerias emuma colônia preparada. v1 e suas seeds são
preservadas para repetir saves antigos. Sessões comuns continuam payload1;
aulas payload2, com referência de receita1 ou2. Não migrar v1 silenciosamente.
39/39 testes dirigidos em2.686,0665ms e build TypeScript estrito/Vite333 módulos.
Depois da tag,4/4 testes de depósito. Não é nova suíte biológica integral.
QA IAB4184 percorreu6 páginas com8 seções e5–6 passos, retorno ao laboratório
e recuperação da aula pausada. Ar noD0:20,90%O₂/0,04%CO₂, com entradas reais.
QA pública: guia e roteiro deventilação, links e numeração, console limpo.
Ver docs/guias-docentes.md e validacoes/guias-0.34.0.json.
P1.4B/revisão deprofessores continua pendente; nenhum piloto realizado.

## Site privado original /0.34.0

URL https://viveiro-caos-formigueiro.everaldodev.chatgpt.site/
Projeto appgprj_6ae6364bc4488191b2757449ed3f7e94, custom/revisão1,
proprietário único e zero externos, conferido antes da publicação.
Fonte 34c41f532187119ae30f5c30fb0886e2e462aa11/tag v0.34.0.
Versão appgprj_6ae6364bc4488191b2757449ed3f7e94~appgver_714be1aef6548191bbc2b66ebfc4330a.
Deploy appgdep_6ae863d7e1048191a94bfb1610cc1164, succeeded,
2026-11-02T10:20:21.787133+00:00. ArquivoG:\Projetos\viveiro-0.34.0.tar.gz.
.openai/hosting.json mantém ID original/static.directory=dist.
Não repetir save/deploy nem mudar audiência.

## Site público separado /0.34.0

URL https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/
Projeto appgprj_6ae80cd45fdc8191be8315696a383393, public/revisão2.
EspelhoG:\Projetos\viveiro-publico, ID próprio/static.directory=dist.
Fonte do espelho 7b3c073d1fadc08309fb00121496641fcfc40453.
Versão5 appgprj_6ae80cd45fdc8191be8315696a383393~appgver_6f1386e022dc81918e9239d67c6f187d.
Deploy appgdep_6ae86413292481919829cf241680ba9d, succeeded,
2026-11-02T10:21:20.899981+00:00.
ArquivoG:\Projetos\viveiro-publico-0.34.0.tar.gz,104 arquivos/8.140.800bytes,
sha256:15be81e226ee75aee6fef02229337928c0001a58388a98e5baf80e8408d36353.
Galeria mantém0.30.0/0.30.1/0.31.0/0.32.0/0.33.0 e acrescenta0.34.0.
Raiz/catálogo/release/manifesto/guias200 semcookies/Authorization;21 arquivos
nãoHTML comhashes exatos. Evidência validacoes/publicacao-0.34.0.json.
HTML canonicaliza index.html para/ e nomes.html para nomes; links relativos
conferidos no navegador. Original privado, sem distribuição de saves.
Não recriar Sites nem sobrescrever releases antigas.

## Citação

CFF1.2.0/.zenodo.json atualizados para0.34.0/tag real, autoria coletiva mantida.
Esquema oficial validado comjsonschema4.26.0 e arquivo ZIP verificado porPython.
Pacote .runtime/deposits/deposit-NYj0Pb/viveiro-v0.34.0-source.zip,
491 arquivos/1.388.116bytes, SHA256
0c13a4f5428b8383dc54217735f6647e82626f4df7bc91b733a75f93d6a48994.
Os9 Markdown públicos necessários ao build são selecionados explicitamente;
checkpoint e demais documentos operacionais continuam excluídos. Detector de
credenciais preservado. Ver validacoes/citacao-0.34.0.json. Nenhum DOI/upload.
Conta/autoria perguntadas anteriormente, sem resposta; não inferir nome/ORCID
nem pedir token no chat. P0.4B/C continuam dependentes de conta/merge.

## Ambiente e provas

DevPID17752, G/4173, HTTP200 e módulos respondendo. Nova abaIAB16 marcada
como entrega: SEMENTE-50088/D62,5,14 adultos, pausa e perfil leve preservados.
Aba4 antiga ficou presa na página deerro deconexão durante reinício automático
Vite; não usar APIs nela. A nova aba16 usa o mesmo save. Não houve perda.
Checkpointmanual manual-2e91b636-785f-4f66-bb84-ff832aa62547 preservado.
Preview4184/sessão10754 e abas15/17 deQA encerrados; nenhum helper pendente.
Pública continua SEMENTE-42/D2,6 pausada, recuperada apósQA da0.33.0.
Capturas viveiro-0.34-guia-preview.png e viveiro-0.34-guia-publicado.png em
C:\Users\conta\.codex\visualizations\2026\10\31\01a19338-43de-7cc3-a8a9-a38475cf3ff2.
Capturas e arquivos das versões anteriores preservados.

## Próximo passo concreto: P1.5 /PWA

1. Conferir Git/PRs e abrir branch codex/ própria sobre#46 se continuar aberto.
2. Planejar manifesto/cache comescopo da release: a galeria publica múltiplas
versões na mesma origem, então cada service worker precisa deescopo/caches
próprios. Não deixar uma versão remover os caches ou saves deoutra.
3. Cachear o app, Three.js e todos osWorkers reais, guias e assets necessários.
Preservar IndexedDB e a pausa do relógio emsegundo plano. Navegação autenticada
do Site privado exige cuidado para não transformar privacidade emacesso público.
4. Testar instalação/atualização, reabertura e checkpoint semrede comambiente
isolado. Não desligar o dev4173 para testar offline; usar preview separado.
5. Publicar entrega validada nos mesmos Sites, tag/PR e checkpoint. DepoisP1.6.

P1.1B/hardware escolar, P1.2B/aluno novo, P1.4B/revisão docente, P1.7/pilotos,
calibração e Zenodo exigem pessoas/dados reais. Não marcar como concluídos.
P5/clima real entra por último. Não desativar a automação: ainda há critérios
implementáveis pendentes. Não prometer retomada fora deuma execução permitida.
