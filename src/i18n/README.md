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

## Integração em andamento

Seletor conectado às duas páginas. `runtime.ts` compartilha o controlador sem
acessar a simulação; em testes Node mantém o padrão português. `dom.ts` fornece
`message`, `messageSource`, `messageAttribute` e `clearMessage`. Use bindings em
folhas de texto, nunca em ancestrais de inputs. Limpe erros com `clearMessage`
para que não reapareçam na troca de idioma. Conteúdo do usuário não é traduzido.
`source.ts` traduz mensagens canônicas somente ao apresentar; não altera o que
fica persistido. `static-html.ts` e o plugin Vite preenchem fallback português.

P2.7 ainda não terminou. Laboratório e controles centrais migrados; faltam
painéis especializados, tour e documentos. Evidência de paridade real em
`docs/validacoes/i18n-lab-parcial.json`; não confundir inventário com cobertura.

## Organização e dados canônicos

Cada locale tem `index.ts` com os imports dos catálogos por área. Para adicionar
idioma, copie a pasta e registre o índice em catalogs.ts. Os HTMLs estruturais
pequenos ficam em src/templates; o plugin Vite os reúne antes de preencher as
traduções. Não editar dist.

Estados/eventos do modelo, IDs, seeds, receitas e metadados científicos mantêm
seu formato canônico. A tradução fica nas fronteiras de apresentação. Datas e
números da tela usam o locale; CSV/JSON mantêm valores/contratos originais.
Nomes de checkpoints/perfis escritos pelo usuário nunca são traduzidos. Os
textos de fonte científica preservam avisos de hipótese, amostra e incerteza.

A interface está migrada; ainda faltam documentos públicos e revisão final de
P2.7. Evidência adicional: docs/validacoes/i18n-ui-parcial.json.
