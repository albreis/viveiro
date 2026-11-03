# Contribuir com o Viveiro

[Português](CONTRIBUTING.md) · [English](CONTRIBUTING.en.md)

Contribuições de código, tradução, documentação, revisão de aulas e experimentos
reproduzíveis são bem-vindas. Consulte as [primeiras tarefas](https://github.com/albreis/viveiro/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

## Escolha o canal

- Use [Issues](https://github.com/albreis/viveiro/issues/new/choose) para um defeito,
  proposta concreta ou contribuição de experimento. Há formulários próprios.
- Use [Discussions](https://github.com/albreis/viveiro/discussions) para perguntas,
  hipóteses e conversas que ainda não são uma tarefa de implementação.
- Verifique se já existe issue/PR para evitar trabalho duplicado.

## Preparar o ambiente

Requer Node.js 24 e Git. A partir da raiz clonada:

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:4173/. Use `?lang=en` para inglês. `dist/` é gerado e não deve
ser editado. Fontes em `src/`; novos módulos usam TypeScript estrito e arquivos
focados de aproximadamente 150–250 linhas. Consulte [AGENTS.md](AGENTS.md).

Crie uma branch `codex/descricao-da-mudanca`, preserve branches/tags publicadas e
abra um PR por entrega funcional. O PR deve explicar o problema, o comportamento
resultante e a verificação. Não altere a versão nem crie tag/release por conta de
uma contribuição: a publicação é consolidada pelos mantenedores.

## Verificar a mudança

```sh
node --test tests/arquivo-relevante.test.mjs
npm run i18n:check
npm run build
```

Execute os testes relevantes; mudanças de regras do modelo exigem regressões de
seed, conservação e persistência. `npm test` executa a suíte completa e pode
levar vários minutos. Para mudanças visuais, confira teclado, tela estreita e
os dois idiomas no navegador. Registre o que foi realmente testado.

A tradução fica em [src/i18n](src/i18n/README.md). Preserve chaves e variáveis.
Não traduza IDs, seeds, CSV/JSON científicos ou nomes escritos pelo usuário.

## Contribuir um experimento

Envie pelo formulário de experimento o plano JSON, versão do Viveiro, pergunta,
seed, parâmetros, perfil biológico e observações. O plano deve abrir no laboratório
isolado e repetir os mesmos arquivos na CLI da mesma versão/política numérica.
Diferencie observação de previsão e explique os limites. Não inclua saves pessoais.

Os mantenedores verificam autoria/proveniência antes de incluir um item na
galeria. Adaptações devem indicar fonte e licença. Contribuição externa só é
contada depois de um PR real de pessoa externa ser integrado; exemplos da equipe
não substituem esse aceite.

## Revisões científicas e convivência

O Viveiro é exploratório. Uma referência de temperatura do ar não calibra solo,
fisiologia ou comportamento de uma espécie. Para alegações biológicas, registre
fonte primária, método, amostra e incerteza. Dados reais precisam ter licença de uso.

Mantenha discussões respeitosas e voltadas ao conteúdo. Descreva comportamentos
observáveis, evite ataques pessoais e considere diferenças de experiência.

Código original usa [MIT](LICENSE); documentação e imagens originais usam
[CC BY 4.0](LICENSE-DOCS.md). Materiais de terceiros conservam seus avisos.
Não envie credenciais. As contribuições seguem as licenças do material afetado.
