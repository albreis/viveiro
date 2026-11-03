# Internacionalização do Viveiro

As traduções ficam em `locales/<idioma>/`, separadas por área. Português do Brasil (`pt-BR`) é o padrão; inglês (`en`) é o primeiro idioma adicional.

- `catalogs.ts`: idiomas registrados e tipos derivados das chaves de referência.
- `validation.ts`: chaves, mensagens vazias e variáveis conferidas antes do build.
- `controller.ts`: idioma atual, assinaturas de mudança e formatação de números de apresentação.
- `browser.ts`: preferência independente e seleção explícita por `?lang=`, sem recarregar a página ou acessar saves.
- `core.ts`: interpolação pura e determinística, sem acessar o simulador ou armazenamento.
- `locales/pt-BR/common.json` e `locales/en/common.json`: catálogo compartilhado.
- `locales/<idioma>/experiments.json`: primeiro catálogo de área, com rótulos e estados do laboratório isolado.

Para adicionar idioma, copie os catálogos de referência para outra pasta, traduza os valores e registre o idioma em `catalogs.ts`. Preserve as chaves e as variáveis entre chaves, por exemplo `{version}`. Rode `npm run i18n:check`; o build também executa essa validação antes de compilar. IDs, seeds, valores científicos, arquivos CSV e textos escritos pelo usuário não devem ser traduzidos.

A integração da interface e a tradução dos demais catálogos/documentos fazem parte do P2.7 em andamento. A existência desta pasta não significa que o aceite completo de inglês já foi concluído.

## Encontrar textos que ainda precisam migrar

`npm run i18n:inventory` lista candidatos por arquivo. `npm run i18n:inventory -- --json` inclui linha, tipo e trecho do texto para revisão. O inventário é heurístico: também pode encontrar CSS, dados ou textos canônicos que devem permanecer estáveis; não mede cobertura nem substitui QA das telas.

Priorize src/app e o HTML estático. Mensagens de eventos/estados e metadados biológicos precisam de tradução na apresentação, preservando os dados persistidos e os protocolos científicos. Não altere seed, RNG ou conteúdo de CSV para traduzir a interface.

O controlador não se instala automaticamente na interface. O próximo passo é conectar um seletor e migrar os textos para os catálogos. `subscribe` permite atualizar a apresentação sem recriar o mundo; libere a assinatura ao desmontar controles. `number` formata somente a exibição e nunca deve ser usado para gravar valores científicos ou CSV.
