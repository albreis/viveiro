# PWA e cache offline / P1.5

Entrega0.35.2. No laboratório público, o botão Preparar para usar sem rede
registra um service worker com escopo da própria release. O preparo é opcional;
a aplicação continua funcionando online sem registrar nada. Manifesto com
start_url/id/scope da release, display standalone e PNGs reais192/512.
A oferta de instalar depende do navegador; não houve instalação no sistema.

## Privacidade e versões

Somente o build de modo public contém manifesto, worker e painel offline.
Build privado e dev não registram service worker nem cacheiam navegação privada.
Isso preserva a autenticação do Site original; não há mudança de audiência.
O teste HTTP da versão pública anterior retornou Cache-Control public.
As requisições de preparo omitem cookies e rejeitam respostas privadas/no-store,
redirecionamentos fora da versão, páginas de login e conteúdo inesperado.

Cada release tem escopo/caches próprios. O worker atende apenas GET de uma
lista estática; queries, APIs, métodos de escrita, outras origens e versões
ficam fora do cache. Não há captura de saves, JSON importado ou IndexedDB.
Remover a cópia desfaz apenas o registro/cache da própria release.
Ativação elimina builds anteriores somente desse escopo. Sem skipWaiting:
nenhuma atualização força recarga ou troca código durante um experimento aberto.

## Integridade e funcionamento

O Vite gera a lista final, incluindo Three.js, os quatro Workers de cálculo,
assets e guias. Hashes SHA256 são conferidos para arquivos nãoHTML. HTML exige
um marcador público da versão e o tipo correto; a infraestrutura acrescenta
código próprio ao HTML, portanto seu hash emprodução pode diferir do build.
Esses acréscimos de infraestrutura não são removidos ou desativados.
A marca de cópia completa é gravada por último; falha remove só o candidato,
sem substituir outro build utilizável. A indicação Pronto também confere a
presença de todos os arquivos. Não há sincronização comservidor ou novaRNG.

## Validação

19 testes dirigidos passaram na primeira rodada final: falhas parciais,
isolamento, login/privacidade, alteração de bytes, evicção, ícones reais,
hashes finais, dois builds isolados e checkpoint codec/store. Rodada final com publicação/depósito:35/35 em2.270,6035ms.
Build privado336 módulos, TypeScript estrito; build público isolado conferido.
Módulos pequenos emsrc; ícones e manifesto gerados por código original,
sem dependência adicional nem assets externos.

QA nativa no IAB: preparo de34 arquivos, checkpoint inicial, desligamento
real do preview4185, fechamento/reabertura do laboratório, criação da aula
AULA-v2-entradas-ar e checkpoint manual comservidor desligado, reload recuperando
a aula pausada e consulta aos roteiros. Console sem erros/avisos.
Depois de religar o preview, remoção do cache preservou o checkpoint manual.
Dev4173 permaneceu respondendo. Nenhum save do usuário foi substituído.
O ensaio é indisponibilidade completa do servidor da aplicação, sem desligar
a rede do computador. Instalação noSO e matriz de outros navegadores não ensaiadas.

## Limites e referências

Armazenamento depende do navegador/aparelho; limpar dados do site pode remover
saves. Exportação JSON permanece disponível. A galeria e referências externas
não são prometidas offline. O Site privado requer acesso online.

- [Registro e escopo do service worker, MDN](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register).
- [Manifesto e instalação, MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).
- [Cache.put, MDN](https://developer.mozilla.org/en-US/docs/Web/API/Cache/put).

A hospedagem canonicaliza index.html e nomes.html comredirecionamentos.
A0.35.1 copia respostas validadas antes dearmazená-las, preservando corpo
e cabeçalhos, para permitir navegação offline. O código deinfraestrutura
permanece intacto. Novo teste unitário eQA emservidor com308, desligado
depois dopreparo: reload, guias e novo checkpoint funcionaram semservidor.
A tag0.35.0 anterior é preservada noGit, sempublicação na galeria.

P1.6/CSV diário e acessibilidade é o próximo item implementável.


A0.35.2 inclui a configuração Vite no commit da fonte e reúne o ajuste de
redirecionamentos. Tags0.35.0 e0.35.1 são preservadas apenas noGit; não foram
publicadas nos Sites. A entrega é a fonte completa marcada0.35.2.


## Publicação e conferência final

Fonte completa v0.35.2/2e978cfb8b86481063300e7556084b145e00e744, PR47.
Ambos Sites publicados; original privado permanece comautenticação online.
Público: preparo de34 arquivos e reload/guia/retorno conferidos noIAB,
SEMENTE-42/D2,6 pausada, console semerros. A cópia pública ficou preparada.
HTTP anônimo:27 arquivos nãoHTML comhashes exatos. Ver validacoes/offline-0.35.2.json,
publicacao-0.35.2.json e deploy-0.35.2.json. Nenhum dado privado foi distribuído.
