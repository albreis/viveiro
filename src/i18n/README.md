# Internacionalização do Viveiro

As traduções ficam em `locales/<idioma>/`, separadas por área. Português do Brasil (`pt-BR`) é o padrão; inglês (`en`) é o primeiro idioma adicional.

- `catalogs.ts`: idiomas registrados e tipos derivados das chaves de referência.
- `validation.ts`: chaves, mensagens vazias e variáveis conferidas antes do build.
- `core.ts`: interpolação pura e determinística, sem acessar o simulador ou armazenamento.
- `locales/pt-BR/common.json` e `locales/en/common.json`: primeiro catálogo compartilhado.

Para adicionar idioma, copie os catálogos de referência para outra pasta, traduza os valores e registre o idioma em `catalogs.ts`. Preserve as chaves e as variáveis entre chaves, por exemplo `{version}`. Rode `npm run i18n:check`; o build também executa essa validação antes de compilar. IDs, seeds, valores científicos, arquivos CSV e textos escritos pelo usuário não devem ser traduzidos.

A integração da interface e a tradução dos demais catálogos/documentos fazem parte do P2.7 em andamento. A existência desta pasta não significa que o aceite completo de inglês já foi concluído.
