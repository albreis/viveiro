# Citação e depósito da versão atual

**Estado em 03/11/2026: P0.4 concluído para a versão consolidada 0.46.0.**
CFF/autoria e botão de citação já conferidos; publicação automática confirmada:
[DOI 10.5281/zenodo.23932885](https://doi.org/10.5281/zenodo.23932885).
Registro aponta à tag v0.46.0, fonte7f4d206; ZIP real baixado, MD5 conferido e
1.739 arquivos iguais aos blobs da tag. [Recibo](validacoes/zenodo-0.46.0.json).

A integração GitHub–Zenodo está ativa. Não criar depósito manual/duplicado ou
versão intermediária para cumprir este aceite. As instruções e pendências
abaixo são **históricas**, anteriores a essa integração e publicação; não são
a próxima tarefa. [Plano ativo](cronograma.md).

## Autoria a partir da próxima release

Em 05/11/2026 o usuário definiu a autoria pessoal: Everaldo Reis da Silva,
ORCID [0009-0008-0719-8722](https://orcid.org/0009-0008-0719-8722).
O CITATION.cff usa `given-names` "Everaldo" e `family-names` "Reis da Silva";
o .zenodo.json usa "Reis da Silva, Everaldo", formato que o Zenodo separa em
prenome e sobrenome. Os nomes coincidem com o perfil ORCID.

Motivo: até a 0.46.0 o ORCID acompanhava o nome coletivo "Viveiro contributors",
que o Zenodo e o DataCite registraram como pessoa com esse sobrenome. Com o nome
divergente do ORCID, as versões não chegaram ao perfil ORCID e não foram ligadas
ao autor no OpenAIRE. O validador de citação agora recusa ORCID em autoria
coletiva e exige prenome e sobrenome para pessoas.

As versões já publicadas (0.36.0, 0.40.1, 0.45.0 e 0.46.0) mantêm os metadados
antigos até serem editadas manualmente no Zenodo pela conta do autor; o DOI não
muda. A licença continua com direito autoral de "Viveiro contributors".

---

# Histórico de citação e preparação de depósitos

## Estado

CITATION.cff preparado e validado pelo esquema oficial CFF 1.2.0.
A autoria coletiva “Viveiro contributors” foi confirmada pelo usuário em02/11/2026.
Nenhum nome pessoal, ORCID, DOI ou vínculo institucional foi inferido.

O arquivo usa JSON, também válido como YAML 1.2, para leitura nativa em JS.
O teste local verifica consistência; a validação oficial foi feita à parte.
Versão citada: v0.39.0, publicada em 02/11/2026, commit
92072e26ed9a18d9533503376fd037b183e2f4d4. Metadados adicionados depois da tag;
a tag e suas URLs não foram alteradas.

P0.4 ainda não está concluída: falta concluir o depósito e obter DOI publicado. O usuário autenticou a conta e
autorizou o rascunho0.36.0; isso não é publicação permanente nem DOI da versão atual. Falta conferir “Cite this repository” após merge na
branch padrão. Segundo a [documentação do GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-citation-files),
o botão aparece com CFF na branch padrão. Abrir PR não cumpre esse aceite.

## Preparar e conferir

Requer Node.js 24 e Git com archive --mtime. Na raiz do projeto:

    node scripts/prepare-deposit.ts
    node --test tests/deposit.test.mjs tests/deposit-archive.test.mjs

Cada execução cria uma pasta nova em .runtime/deposits, ignorada pelo Git,
com ZIP, SHA-256, manifesto e metadados para revisão. Não envia rede, cria
registros ou altera refs e configuração do Git. Quebras de linha fixadas só
no comando archive preservam bytes dos blobs mesmo com core.autocrlf ativo.

Código vem da tag do CFF: src, public, scripts, tests, build e licenças.
README público, CFF e .zenodo.json são acréscimos posteriores com hashes
próprios. O verificador exige cada arquivo e hash e rejeita entradas extras.
Links e padrões de credenciais detectáveis bloqueiam a preparação.
A seleção não substitui revisão humana antes de depósito público permanente.

Ficam fora: histórico Git, docs operacionais, AGENTS.md, .openai, .runtime,
dependências, dist e saves. Seis testes/fixture de publicação e depósito
ficam apenas no repositório, listados explicitamente no manifesto. Contêm
marcadores sintéticos que foram recusados pelo filtro, mantido intacto; os
testes do modelo permanecem no pacote. Scripts de hospedagem precisam de configuração
local própria; os testes e o build não precisam do Site privado.

## Histórico da validação0.32.0 em 02/11/2026

- [Esquema oficial](https://citation-file-format.github.io/1.2.0/schema.json),
  SHA-256 0b8d22140da702d766df318dcff3a91af2f39521298dcf36d76315fd99cc169b.
- Python jsonschema 4.26.0, Draft7Validator e FormatChecker: válido.
- 4/4 testes de depósito, em execução separada dos22 do tour, incluindo gerar o ZIP duas vezes com bytes iguais.
- Python 3.14 zipfile independente: 465 arquivos, 1.309.191 bytes, hashes válidos.
- ZIP: .runtime/deposits/deposit-WTwn9t/viveiro-v0.32.0-source.zip.
- SHA-256: ac3c531825a92271a766d63c9be85d8e7d5b2c62d84ce73ec2d8cefc86f634b3.
- Build TypeScript/Vite passou; aplicação 0.32.0 e sessão local preservadas.
- Nada enviado ao Zenodo; DOI ausente, sem número fictício.

## Concluir o depósito real

1. Usar a conta responsável no Zenodo e revisar autoria e licenças do pacote.
   Não enviar tokens, senha ou códigos de recuperação no chat.
2. Criar rascunho de software com .zenodo.json e o ZIP conferido. A data do
   software é a da release; conferir a data do depósito no formulário.
   Preservar avisos de terceiros e o escopo MIT/CC BY 4.0 das licenças.
3. Conferir arquivo, autoria e audiência antes de publicar. Não conectar uma
   exportação automática do repositório privado inteiro: ela não usa a seleção
   deste gerador.
4. Após publicar em zenodo.org, conferir DOI, registro e arquivo corretos.
   DOI de sandbox ou só reservado não atende ao aceite. Registrar ID, DOI,
   checksum e link em nova alteração.
5. Adicionar DOI real aos metadados, revalidar e guardar proveniência. Versões
   futuras usam nova versão do mesmo registro; atualizar versão, commit, data
   e URL juntos. Não reescrever tags.

Referências: [CFF](https://citation-file-format.github.io/1.2.0/),
[API e metadados do Zenodo](https://developers.zenodo.org/),
[git archive](https://git-scm.com/docs/git-archive).
[Evidência da versão atual](validacoes/citacao-0.39.0.json).
O pacote anterior0.30.1 permanece em.runtime/deposits/deposit-CqrgTm.
O pacote0.31.0 também permanece em.runtime/deposits/deposit-wcJQPw.
A versão atualizada do gerador exclui os testes operacionais explicitamente.
O software continua exploratório e não calibrado por espécie.


## Atualização 0.33.0

CFF e rascunho referem a tag v0.33.0/ed78e3fe56e7b863fc06ee0f69cef40aeb371507,
com autoria coletiva inalterada. Esquema oficial CFF validado e pacote verificado
por leitor ZIP independente:476 arquivos/1.343.560bytes, SHA256
6e1882ef2597fce385bf393cc06b76de6aaabb47da9f440a02ac8f34803dc292.
Saída local .runtime/deposits/deposit-sFz0M3/viveiro-v0.33.0-source.zip.
Os4 testes de depósito passaram. Nenhum upload ou DOI emitido.
Ver validacoes/citacao-0.33.0.json. A tag publicada não foi alterada.


## Atualização 0.34.0

CFF/rascunho referem v0.34.0/34c41f532187119ae30f5c30fb0886e2e462aa11.
Autoria coletiva preservada; esquema oficial validado. Pacote local
.runtime/deposits/deposit-NYj0Pb/viveiro-v0.34.0-source.zip:
491 arquivos/1.388.116bytes, SHA256
0c13a4f5428b8383dc54217735f6647e82626f4df7bc91b733a75f93d6a48994.
Inclui somente9 Markdown públicos deensino usados no build. Documentação
operacional continua excluída. Leitor ZIP independente conferiu todos os
hashes;4 testes do depósito passaram. Sem DOI ou upload ao Zenodo.
Ver validacoes/citacao-0.34.0.json. Tags/arquivos anteriores preservados.


## Atualização 0.35.2

CFF/rascunho referem v0.35.2/2e978cfb8b86481063300e7556084b145e00e744.
Autoria coletiva mantida e esquema oficial validado. Pacote local
.runtime/deposits/deposit-qpwRNb/viveiro-v0.35.2-source.zip:
504 arquivos/1.422.413bytes, SHA256
18ffa067b03d57262688025de147c0ef5b18caa1c70e253d6b3981b7c634c68c.
LeitorZIP independente conferiu todos os hashes, membros e a configuração
Vite offline da tag.4 testes do depósito passaram. Sem DOI/upload.
Ver validacoes/citacao-0.35.2.json. Tags anteriores preservadas.

## Atualização 0.36.0

CFF/rascunho referem v0.36.0/0e156836bd94aaa6a408017f597b11447f065a73.
Autoria coletiva preservada; esquema oficial CFF validado e512 arquivos
conferidos por Python zipfile. Pacote de1.445.248bytes,
.runtime/deposits/deposit-WhwuRb/viveiro-v0.36.0-source.zip,
SHA25603c497454a51e4d5aad6297490288d8e05b58b84575ad3fc2824f5145f1a67b2.
Inclui observações diárias e configuração Vite da tag. Quatro testes do depósito
passaram. Nenhum upload/DOI. Ver validacoes/citacao-0.36.0.json.

## Conta Zenodo e autorização de acesso

Em02/11/2026, o usuário confirmou autoria coletiva e informou que já possui
conta no Zenodo. A abertura de /uploads pelo navegador foi recusada pela revisão
automática de aprovação por possível exposição de registros privados da conta.
Nenhum conteúdo da conta foi acessado e nenhum depósito/upload foi realizado.
Foi solicitada autorização específica para acessar a área e preparar o rascunho
com o ZIP0.36.0 verificado. Aguardar a resposta; não contornar o bloqueio.
Não pedir senha, token ou códigos no chat. Autoria e existência da conta já foram
respondidas; não repetir essas perguntas. P1.6B não depende deste acesso.

## Atualização 0.37.0

CFF/rascunho referem v0.37.0/30cc14ea82d8c7a20d0541641e07e5e3ad0cb432.
Autoria coletiva confirmada mantida. Esquema oficial válido, quatro testes de
integridade/reprodução e leitorZIP independente aprovados.517 arquivos,
1.464.006bytes, .runtime/deposits/deposit-A1Ldu4/viveiro-v0.37.0-source.zip,
SHA2562f80f3318c601574534b435ea4b55a81fc605bd4388e38d085107d412ca9195b.
Nenhum upload/DOI. Autorização de acesso ao Zenodo continua pendente; não repetir
nem contornar a tentativa recusada. O pacote0.36.0 da pergunta já feita continua
preservado. Ver validacoes/citacao-0.37.0.json.

## Atualização 0.38.0 e rascunho autorizado

Tag v0.38.0/fbb0852820b9a34755a78b8bacd501b495348385, ODD e referência
incluídos explicitamente.533 arquivos/1.518.779bytes, SHA-256
0b941e8c770832ca22778922cb4c6d1f10eaa6631a855e0c9ec3560a30b1ed76.
Pacote .runtime/deposits/deposit-xaZnzI/viveiro-v0.38.0-source.zip.
Esquema CFF válido, quatro testes e leitura ZIP/Python independente aprovados.

Após autorização específica e login pelo usuário, foi salvo o rascunho0.36.0
[23891981](https://zenodo.org/uploads/23891981), sem publicar. Autoria coletiva,
versão, data do software, licença MIT e escopo documental CC BY4.0 conferidos na
prévia. Upload100%; arquivo baixado do rascunho com SHA-256 idêntico ao original:
03c497454a51e4d5aad6297490288d8e05b58b84575ad3fc2824f5145f1a67b2.
Nenhum DOI reservado/registrado, nenhuma integração automática do repo privado.
A próxima ação dependente é revisar esse rascunho concreto e obter autorização
para publicação permanente. Não trocar silenciosamente seu ZIP pela0.38.0.
Ver validacoes/zenodo-rascunho-0.36.0.json.

## DOI publicado da0.36.0

O usuário autorizou a publicação permanente do rascunho23891981 após a prévia.
Registro [publicado](https://zenodo.org/records/23891981), DOI real
[10.5281/zenodo.23891981](https://doi.org/10.5281/zenodo.23891981), resolvendo
para esse registro. ZIP público baixado depois de publicar com SHA-256 idêntico.
[CFF específico](citacoes/v0.36.0.cff) validado pelo esquema oficial; o pacote e
a tag anteriores não foram modificados. O CFF da raiz continua na0.38.0, sem
atribuir a ele o DOI da0.36.0. P0.4 continua parcial até DOI da versão atual e
conferência do botão GitHub após merge. Não republicar23891981 nem criar duplicata.
Evidência em validacoes/zenodo-0.36.0.json.

## Fonte0.39.0

Tag92072e26ed9a18d9533503376fd037b183e2f4d4, CFF oficial válido,551 arquivos/
1.568.012bytes, quatro testes e leitor Python conferindo todos os membros,
CLI, Vite e bytes dos CSVs brutos. Pacote .runtime/deposits/deposit-IMjy1M/
viveiro-v0.39.0-source.zip; SHA-256
39d328ce9710a2a8f90b42be5d28701bfcbdbd626373ca7dd4d85aa8f7951e02.
Não enviado ao Zenodo; DOI0.36.0 permanece específico daquela versão.
