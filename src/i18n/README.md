# Internacionalização do Viveiro

Português do Brasil (`pt-BR`) é o padrão; inglês (`en`) é o primeiro idioma
adicional. Os catálogos editáveis ficam em `locales/<idioma>/`, separados por
área. Cada `index.ts` reúne os JSONs; `catalogs.ts` registra os idiomas e deriva
os tipos das chaves portuguesas. Nenhum pacote externo de tradução é necessário.

## Adicionar idioma

1. Copie a pasta `locales/pt-BR` para o código do idioma e traduza os valores.
2. Preserve chaves e variáveis como `{version}`. Registre o índice em `catalogs.ts`.
3. Adicione os documentos públicos traduzidos em `locales/<idioma>/docs`, seguindo
   a estrutura de `locales/en/docs`. Os geradores produzem modelo, ensino e licenças.
4. Inclua o rótulo do idioma em todos os catálogos `common.json` existentes.
5. Rode `npm run i18n:check`, `node --test tests/i18n*.test.mjs` e `npm run build`.
   Confira UI, rotas, downloads e reflow no navegador.

O build rejeita chaves ausentes/extras, mensagens vazias e variáveis perdidas.
`npm run i18n:inventory` lista candidatos com arquivo/linha; é uma heurística,
não mede cobertura e inclui dados canônicos que devem continuar estáveis.

## Apresentação

- `controller.ts`: preferência, assinaturas e formatação de números.
- `browser.ts`: chave independente `viveiro.locale.v1` e `?lang=`, sem reload/saves.
- `core.ts`: interpolação pura. `runtime.ts`: controlador compartilhado da UI.
- `dom.ts`: `message`, `messageSource`, `messageAttribute` e `clearMessage`.
- `picker.ts`: seletor nas duas páginas e observação de novos elementos marcados.
- `source.ts`: tradução de mensagens canônicas somente na apresentação.
- `links.ts`: apenas links de navegação explicitamente marcados são traduzidos.
- `biology.ts`/`lessons.ts`: apresentações copiadas, sem modificar perfis/receitas.

Marque folhas de texto, nunca ancestrais de inputs. Limpe erros com `clearMessage`
para que não reapareçam na troca de idioma. Não faça tradução genérica de DOM,
HTML de terceiros ou dados de entrada. Libere assinaturas ao desmontar controles;
texturas da cena liberam sua assinatura quando o Three as descarta.

Templates pequenos ficam em `src/templates`. O plugin Vite os reúne e preenche
fallback português antes do JS. Documentos saem em `modelo/`, `ensino/` e `en/`;
os links alternam a mesma página. Fontes `.txt` seguem o idioma; vetores, código
numérico e arquivos científicos compartilham os bytes canônicos. Não editar dist.

## Dados e verificação

IDs, seeds, RNG, estados/eventos persistidos, receitas, JSON, CSV e textos do
usuário permanecem canônicos. `Intl` formata somente a exibição; números gravados
não recebem vírgulas locais. Nomes de checkpoints e perfis não são traduzidos.
Fontes científicas e ressalvas preservam hipóteses, amostras e incertezas.

A troca de idioma não recria o mundo, não altera parâmetros, não avança o relógio
e conserva campos em edição e resultados. Consulte os testes i18n e as evidências
em `docs/validacoes/i18n-*.json`. Novos termos exigem revisão humana; o inventário
não substitui QA. Documentação operacional histórica do repositório continua em
português; as páginas públicas do modelo e ensino têm as duas versões.
