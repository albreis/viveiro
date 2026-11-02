# Citação e depósito da versão 0.31.0

## Estado

CITATION.cff preparado e validado pelo esquema oficial CFF 1.2.0.
A autoria coletiva reproduz “Viveiro contributors” da licença existente.
Nenhum nome pessoal, ORCID, DOI ou vínculo institucional foi inferido.

O arquivo usa JSON, também válido como YAML 1.2, para leitura nativa em JS.
O teste local verifica consistência; a validação oficial foi feita à parte.
Versão citada: v0.31.0, publicada em 02/11/2026, commit
1a5fa67038c8fe244844136257f5328becbf5e4e. Metadados adicionados depois da tag;
a tag e suas URLs não foram alteradas.

P0.4 ainda não está concluída: faltam conta autenticada responsável pelo
depósito e DOI publicado. Falta conferir “Cite this repository” após merge na
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
dependências, dist e saves. Seis testes/fixture de publicação e depósito\nficam apenas no repositório, listados explicitamente no manifesto. Contêm\nmarcadores sintéticos que foram recusados pelo filtro, mantido intacto; os\ntestes do modelo permanecem no pacote. Scripts de hospedagem precisam de configuração
local própria; os testes e o build não precisam do Site privado.

## Validação em 02/11/2026

- [Esquema oficial](https://citation-file-format.github.io/1.2.0/schema.json),
  SHA-256 0b8d22140da702d766df318dcff3a91af2f39521298dcf36d76315fd99cc169b.
- Python jsonschema 4.26.0, Draft7Validator e FormatChecker: válido.
- 4/4 testes de depósito (incluídos nos24 finais da entrega), incluindo gerar o ZIP duas vezes com bytes iguais.
- Python 3.14 zipfile independente: 455 arquivos, 1.285.685 bytes, hashes válidos.
- ZIP: .runtime/deposits/deposit-wcJQPw/viveiro-v0.31.0-source.zip.
- SHA-256: 5dd2cd029041c01f0a434005c3ebda497d9d1b4fcda0c93afeb9421cc813ee39.
- Build TypeScript/Vite passou; aplicação 0.31.0 e sessão local preservadas.
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
[Evidência da versão atual](validacoes/citacao-0.31.0.json).\nO pacote anterior0.30.1 permanece em.runtime/deposits/deposit-CqrgTm.\nA versão atualizada do gerador exclui os testes operacionais explicitamente.\nO software continua exploratório e não calibrado por espécie.
