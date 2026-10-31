# Viveiro

Terrário 3D em Three.js com agentes autônomos e experimentos por seed.

## Desenvolvimento

Requer Node.js 24.

```sh
npm ci
npm run dev
```

Abra http://127.0.0.1:4173. O Vite atualiza o navegador durante a edição.

```sh
npm test
npm run build
npm run preview
```

O build executa TypeScript e gera o bundle em dist. Não edite dist manualmente.
Dev e preview usam a mesma porta: execute apenas um deles.

## Estrutura

- src/app: interface e controle da experiência.
- src/modules/navigation: TypeScript estrito, sensores, forças e locomoção.
- src/modules/simulation: relógio fixo e ciclos biológicos.
- src/modules/terrain: terreno compartilhado pela física e pelo desenho.
- src/modules/renderer: cena, câmera, seleção, plantas e corpos.
- src/services: persistência e serviços.
- src/workers: previsões fora da renderização.
- src/styles: CSS por componente e breakpoint.

A navegação e os controles novos são tipados. UI, biologia e partes do renderer legados seguem em JavaScript durante a migração incremental; não estão sob checagem estrita ainda.

## Observar

- Arraste para orbitar; role para aproximar.
- A vista lateral mostra câmaras junto ao vidro.
- Duplo clique numa formiga ou escolha na lista para entrar em primeira pessoa.
- Arraste para olhar; Esc retorna ao terrário.
- Pause, altere a velocidade ou intervenha no solo.
- Repita a seed com intervenções e exporte os dados JSON.

100 passos representam um dia simulado. Os ciclos são acelerados e não equivalem a uma espécie real.

## Acompanhar

- [Cronograma](docs/cronograma.md)
- [Especificações](docs/especificacoes.md)
- [Arquitetura](docs/arquitetura.md)
- [Navegação](docs/navegacao.md)
- [Versões](CHANGELOG.md)

Cada entrega usa branch e tag próprias. O modelo é exploratório, sem validação biológica/geotécnica. Alargamento local por congestionamento não equivale à escavação completa, transporte de terra ou física granular.
