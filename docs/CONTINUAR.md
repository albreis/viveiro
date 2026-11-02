# Continuação do Viveiro

Atualizado em 02/11/2026. Trabalhar em G:\Projetos\viveiro e ler AGENTS.md e cronograma.
Uma entrega por branch codex/, módulos pequenos em src/TypeScript, Vite, testes,
QA nativa Cua, commit/push/PR. Preservar saves, branches, tags e audiência dos Sites.
Não iniciar executor concorrente. Não usar modelos exploratórios como calibrados.

## Entrega urgente P2.2B concluída

0.40.0, fonte/tag 7fdc46942283c82fd0402c76946ba016b251bd80.
Branch codex/aritmetica-portatil, PR https://github.com/albreis/viveiro/pull/53,
base codex/cli-experimentos (#52). Ambos abertos na última consulta; verificar
Git/PRs antes da próxima entrega, pois o usuário faz merges externamente.
ODD #50 e DOI #51 já integrados à main 043c158. Não retag/recriar releases.

Contrato stdlib-f64-v1 exclusivo dos Workers de experimentos (Node e navegador),
serviço explícito sem patch global Math. Terrário 3D e saves continuam nativos.
90 arquivos/281 operações encaminhadas; 13 dependências numéricas fixadas,
184 avisos em arquivos pequenos. Documentação: docs/aritmetica-portatil.md.
Os dados nativos divergentes da 0.39 foram preservados; não arredondar CSV.

396 testes completos, mais quatro regressões de captura e checks dirigidos,
TS estrito, build privado 351 módulos/público 353, cache offline conferido.
Quatro cenários, 4.400 ticks por ambiente: CSV E manifesto idênticos em
Node 24.22.1, IAB dev e bundle compilado. Mesma regressão de 1.000 ticks
confirmada nos dois Sites publicados, com downloads byte a byte iguais.
Evidências: validacoes/paridade-0.40.0.json e paridade-producao-0.40.0.json;
dados brutos em tests/fixtures/cli-portable-040. Nenhuma garantia de todas as
engines, replicação científica externa ou calibração por espécie.

Privado: https://viveiro-caos-formigueiro.everaldodev.chatgpt.site/
ID appgprj_6ae6364bc4488191b2757449ed3f7e94, custom/rev1, owner1/external0.
Deploy appgdep_6ae8e505d9e081918acca66686b1388b, succeeded 19:31:32 UTC.
Público: https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/
ID appgprj_6ae80cd45fdc8191be8315696a383393, public/rev2, versão 11.
Fonte bb06c318061e4e4df6ca483dd9311d07d58ba648,
deploy appgdep_6ae8e571d5b081918cbc7652e9bdb988, succeeded 19:33:22 UTC.
Arquivos G:\Projetos\viveiro-0.40.0.tar.gz e viveiro-publico-0.40.0.tar.gz.
Espelho em G:\Projetos\viveiro-publico, galeria anterior preservada.
Recibos completos em validacoes/deploy-0.40.0.json. Não repetir save/deploy.
HTTP adicional recebeu 403 na 0.38: não repetir para contornar; QA nativa funciona.

## Citação e limitações externas

DOI da 0.36.0 PUBLICADO após autorização explícita:
https://doi.org/10.5281/zenodo.23891981, registro 23891981.
Autor confirmado: Viveiro contributors. ZIP público igual ao original,
1.445.248 bytes, SHA 03c497454a51e4d5aad6297490288d8e05b58b84575ad3fc2824f5145f1a67b2.
Não criar duplicata nem atribuir esse DOI à release atual. Autorização de acesso
já registrada; não pedir de novo. Nova publicação permanente exige seu próprio aceite.
CFF raiz e .zenodo.json agora descrevem fonte 0.40.0; citação específica 0.36 em
docs/citacoes/v0.36.0.cff. Esquema oficial CFF válido.
ZIP 0.40: .runtime/deposits/deposit-nxco6P/viveiro-v0.40.0-source.zip,
777 arquivos, 2.106.864 bytes, SHA
1e8c687bebedd3c9119e3d4e03ce86de142d14e828c8b4fa3a6fb0a2b1a92b3e.
Python conferiu cada hash e 12 CSVs brutos; quatro testes do depósito aprovados.
Nada novo enviado ao Zenodo. Pacotes/tags anteriores preservados.

P0.4 ainda depende de DOI atual/botão de citação GitHub após integração.
P1.6B2: planilha real, leitor/zoom e Lighthouse >90 não concluídos.
PageSpeed retornou 429/cota diária: não repetir antes de
2026-11-03T15:16:57 UTC nem contornar com outra chave/conta/ferramenta.
P1 ensaios escolares/docentes, P3 calibração/JOSS e P5 clima exigem dados reais.

## Ambiente e próximo passo

Dev 4173 PID17752 em G continua rodando. Preview de QA 4189 encerrado.
IAB aba33: SEMENTE-50088/D62,5/14 adultos, pausado, perfil leve, saves preservados.
Aba30: experimento privado; aba32: público versionado. Marcadas como entrega.
Abas antigas20/28 não estão mais nesta sessão; não reutilizar handles inválidos.
Só Cua documentado para browser; nenhum Playwright externo/CDP/internals.
Capturas 0.40 paridade/publicado na pasta de visualizações autorizada.

Usuário acaba de relatar asas flutuando na entrada (imagem anexada). Próximo
passo imediato: branch própria para investigar apoio/renderização das asas
separadas da rainha, corrigir e validar. Depois retomar P2.3: varredura de
5 valores × 10 réplicas em um comando, paralela e com retomada; então P2.4+.
Retomada automática ainda é útil; não desativar ou declarar cronograma concluído.
