# Continuação do Viveiro

Atualizado em02/11/2026 após publicar P2.1 /0.38.0 e preparar o rascunho Zenodo0.36.0.
Ler AGENTS.md e docs/cronograma.md. Trabalhar em G:\Projetos\viveiro.
Manter dev4173 em G; preservar saves, branches, tags e privacidade.
Não iniciar executor concorrente. Modelos exploratórios/não calibrados.

## Git e publicação

Branch codex/documentacao-odd, PR https://github.com/albreis/viveiro/pull/50,
base codex/acessibilidade/#49. Conferidos PRs32–50 em cadeia; main15781d2.
Fonte/tag v0.38.0:fbb0852820b9a34755a78b8bacd501b495348385.
Metadados/checkpoint posteriores à tag; nunca retag/recriar a mesma release.
Conferir merges antes de agir, sem duplicar PRs ou sobrescrever refs.

Privado: https://viveiro-caos-formigueiro.everaldodev.chatgpt.site/
Projeto appgprj_6ae6364bc4488191b2757449ed3f7e94, custom/revisão1, owner único,
zero visitantes externos. Identidade/static dist preservados.
Deploy appgdep_6ae8b6d6360881918763402c97897399, succeeded16:14:32UTC.
Arquivo G:\Projetos\viveiro-0.38.0.tar.gz preservado.

Público: https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/
Projeto appgprj_6ae80cd45fdc8191be8315696a383393, public/revisão2.
Espelho G:\Projetos\viveiro-publico, fonte2060c14bb251c333ba7f11dd93f095fd0c340891.
Deploy appgdep_6ae8cdb2675481919042227937edcd72, succeeded17:52:03UTC,
versão9, arquivo G:\Projetos\viveiro-publico-0.38.0.tar.gz.
272 arquivos/14.141.440bytes, hash
88b63b7f3559a72ec26b6fb9d73f41068637d54f5736c9dd16cdb192e6accda6.
Galeria preserva releases anteriores. Não repetir save/deploy.
IDs completos em validacoes/deploy-0.38.0.json.
Nunca publicar o Site privado como público nem reutilizar seu ID no espelho.

## P2.1 entregue

ODD em docs/odd.md e sete documentos complementares pequenos. Catálogo/gerador
em módulos separados; Vite produz modelo/*.html e downloads dos mesmos Markdown.
Rodapé do laboratório oferece acesso. Código/equações são texto escapado;
regiões de código focáveis/roláveis. Parser de ensino agora suporta código seguro.
Documenta sete elementos, onze conceitos, estados/escalas, perfil legado versus
atual, ordem real de advanceFamily/intervenções e limites de dados/biologia.

Submodelo completamente especificado: campo superficial de reação-difusão,
fronteiras fechadas, vento upwind, CFL0.85, evaporação exponencial, fontes e ordem.
Referência autônoma por balanço de taxas por célula, sem importar solver de
produção; sete vetores analíticos fixos e36 casos variados. Erro analítico máximo
1.1102230246251565e-16, tolerância1e-12. Verificação pelo mesmo projeto;
NÃO replicação externa/calibração. Outros submodelos têm mapa, não especificação
numérica suficiente para reimplementar o motor inteiro sem fonte.

37 testes dirigidos passaram, mais4 de depósito. TS estrito/build345 módulos;
builds privado/público e cache verificaram hashes finais dos novos assets modelo/.
QA IAB4173: atalho focou conteudo; fórmulas/JSON/links,320×800 com largura útil305
=scrollWidth305; blocos de código rolam por teclado; viewport restaurado.
QA pública confirmou comandos atualizados, autoria técnica e links, console limpo.
Captura viveiro-0.38.0-odd-publicado.png na pasta de visualizações autorizada.
Check HTTP anônimo adicional via urllib recebeu403 na origem. Não houve hashes
remotos pós-deploy medidos; não contornar a proteção ou inventar resultados.
Ver validacoes/odd-0.38.0.json e publicacao-0.38.0.json. Núcleo/RNG/clock intactos.

## Citação e Zenodo

CFF/.zenodo.json referem a tag0.38.0 real, autoria “Viveiro contributors”.
Esquema oficial CFF válido, quatro testes; Pythonzipfile conferiu533 membros,
1.518.779bytes, todos os hashes e fontes ODD. ZIP:
.runtime/deposits/deposit-xaZnzI/viveiro-v0.38.0-source.zip,
SHA2560b941e8c770832ca22778922cb4c6d1f10eaa6631a855e0c9ec3560a30b1ed76.
Fonte da tag + metadados posteriores; docs públicos selecionados explicitamente,
saves, docs operacionais, credenciais e identidade de hospedagem excluídos.

A rejeição automática anterior de acesso ao Zenodo foi resolvida: usuário
AUTORIZOU explicitamente acesso e rascunho0.36.0, confirmou autoria e fez login.
NÃO pedir essas autorizações outra vez. Rascunho salvo23891981:
https://zenodo.org/uploads/23891981
https://zenodo.org/records/23891981?preview=1
Título, versão0.36.0/data2026-11-02, autor coletivo, MIT, escopo documentalCC BY4.0,
commit0e156836bd94aaa6a408017f597b11447f065a73 e limites conferidos na prévia.
Upload100%,1.445.248bytes. Download do rascunho em
C:\Users\conta\Downloads\viveiro-v0.36.0-source.zip,
SHA25603c497454a51e4d5aad6297490288d8e05b58b84575ad3fc2824f5145f1a67b2,
idêntico ao pacote original .runtime/deposits/deposit-WhwuRb.
Evidência validacoes/zenodo-rascunho-0.36.0.json; captura na pasta autorizada.
Nenhum DOI reservado/registrado até esta gravação; não publicar sem autorização
específica. Usuário ACABA DE AUTORIZAR publicar permanentemente esta0.36.0:
resposta “Publicar a versão0.36.0”. Próxima ação imediata: terminar checkpoint,
branch codex/ própria, voltar a editar23891981 e publicar esse rascunho já revisto.
Não trocar o ZIP pela0.38.0. Conferir DOI real e download antes de registrar.
Não atribuir DOI da0.36.0 ao CITATION.cff atual0.38.0. P0.4C depende de merge.

## Dependências reais e ambiente

P1.1B/hardware escolar, P1.2B/participante novo, P1.4B/revisão docente,
P1.7/turmas/SUS e P3/calibração exigem dados/pessoas reais; sem evidências fictícias.
P1.6B2: planilha/leitor de tela/zoom/Lighthouse pendentes. PageSpeed oficial
respondeu429/cota diária; nenhuma nota. Não repetir antes de
2026-11-03T15:16:57UTC nem contornar por outra conta/chave. Não há selo WCAG AA.
CSV real anterior preservado em Downloads/viveiro-diario-AULA-v2-entradas-ar.csv.
365 testes biológicos passaram na0.36.0; não repetir por rotina sem mudar núcleo.

DevPID17752/G/4173. AbaIAB20 preservada; último save confirmado SEMENTE-50088/D62,5,
14adultos em pausa/perfil leve. Aguardar inicialização/release-label antes de
confundir HTML inicialSEMENTE-42 com perda de save. Saves manuais preservados,
incluindo manual-2e91b636-785f-4f66-bb84-ff832aa62547. Vite ignora.runtime/.sites-runtime.
Não encerrar4173. Nenhum preview QA novo nesta etapa. Abas4/16 antigas em erro:
não reutilizar nem despejar suas URLsdata. Aba27QA/28Zenodo criadas nesta etapa.
Cua precisou de um reset após browser.user indisponível ao usuário fazer login;
getTab28/browser2 recuperou. Usar apenas APIs documentadas, nunca internals/CDP.

## Próximo item de implementação: P2.2 / CLI

Após concluir o registro Zenodo autorizado, conferir Git/PRs e abrir codex/CLI
sobre a última branch dependente. CLI em módulos pequenos TS: seed, dias,
parâmetros tipados, perfil/receita versionados e saída CSV+manifesto determinístico.
Reusar advanceFamily e o mesmo exportador do navegador; sem DOM/Three.js/Date
no cálculo. Medir ticks explicitamente, validar limites e entradas antes de simular.
Aceite exige CSV byte a byte igual no Node e em navegador REAL para mesma seed,
perfil, parâmetros e janela observada; não vale comparar duas importaçõesNode.
Testar repetição, parâmetros inválidos e dados ausentes; preservar saves e dev.
Depois P2.3/varredura, P2.4/Morris, P2.5/extensões, P2.6/editor, P2.7/inglês,
P2.8/instruções em português. P5 por último. Manter retomada ativa.
