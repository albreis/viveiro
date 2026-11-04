# Página privada do cronograma

A página `/cronograma.html` reúne o plano em uma interface de leitura, com busca
em todas as áreas, filtros pendente/concluído, etapas expansíveis, fontes e
impressão. As áreas são visão geral, trabalho técnico, você sozinho, terceiros,
UX, Buhl, dados opcionais e entregas concluídas.

## Fonte e atualização

O plugin Vite lê os oito documentos listados em `scripts/lib/roadmap-data.ts`.
Não há segunda lista de tarefas editável no navegador nem marcação manual de
aceites. Edite os Markdown de planejamento e publique novamente o Site privado.
Em desenvolvimento, mudar um documento recarrega a página.

A data vem de `docs/cronograma.md`, a versão publicada de `package.json`, e as
contagens de UX/fontes opcionais são calculadas. As contagens incluem critérios
e subtarefas; não representam porcentagem de conclusão do projeto. Trabalhos
iniciados e limitações científicas permanecem explícitos.

A navegação é pt-BR/en em `src/i18n/locales/*/roadmap.json`. O conteúdo dos
documentos de planejamento continua em português, com aviso na página.
Busca/área/situação/idioma ficam na URL para permitir favoritos e recarga.

## Privacidade e publicação

A restrição real é o controle de acesso do Site existente: somente o proprietário,
sem convidados externos. `noindex` é só orientação de indexação, não autenticação.
Não foi criado login próprio nem modificada a audiência do Site.

O build com modo `public`, usado pelo GitHub Pages, exclui a entrada HTML, o
chunk com o plano e o link de navegação. O código-fonte e os Markdown continuam
no repositório GitHub já existente; privacidade da página não torna esse
repositório privado. Não criar tag/release ou depósito Zenodo para este painel.

## Verificação

`node --test tests/roadmap.test.mjs` confere cobertura, atualização a partir dos
documentos, links, busca/filtros e um build público real sem página/payload.
Suíte completa: 479/479 aprovados. TypeScript estrito e Vite compilam o build
privado. QA nativa cobre idioma/recarga, 21 tarefas UX, zoom concluído,
busca sem acentos/vazia, fontes e Buhl iniciado, além de 1440×900, 820×1180 e
390×844 sem overflow horizontal da página.

Módulos: parser de documentos em `scripts/lib`, tipos/filtros em
`src/modules/roadmap`, apresentação em `src/app`, estilos divididos em quatro
arquivos. O painel não importa o simulador nem lê/escreve seus saves.
