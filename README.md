# Viveiro

Terrário 3D em Three.js com agentes autônomos e experimentos por seed.

## Desenvolvimento

Requer Node.js 24.

Nesta máquina, o projeto fica em `G:\Projetos\viveiro`. Execute os comandos nessa pasta.

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
- src/modules/landscape: geração por seed, espécies, água e materiais dinâmicos.
- src/modules/terrain: terreno compartilhado pela física e pelo desenho.
- src/modules/renderer: cena, câmera, seleção, plantas e corpos.
- src/services: persistência e serviços.
- src/workers: previsões fora da renderização.
- src/styles: CSS por componente e breakpoint.

A navegação e os controles novos são tipados. UI, biologia e partes do renderer legados seguem em JavaScript durante a migração incremental; não estão sob checagem estrita ainda.

## Observar

- Arraste para orbitar; role para aproximar.
- Clique novamente na vista lateral para alternar os quatro lados.
- Ative “Ver túneis internos” para observar galerias afastadas dos vidros.
- “Novo terrário” gera outra paisagem e ninho pela seed. Saves existentes são preservados.
- Duplo clique numa formiga ou escolha na lista para entrar em primeira pessoa.
- Arraste para olhar; Esc retorna ao terrário.
- Pause, altere a velocidade ou intervenha no solo.
- Repita a seed com intervenções e exporte os dados JSON.

100 passos representam um dia simulado. Os ciclos são acelerados e não equivalem a uma espécie real.

## Acompanhar

- [Reservas maternas](docs/reservas-maternas.md)

- [Simbioses e mimetismo](docs/simbioses.md)
- [Biologia planejada](docs/biologia-planejada.md)
- [Odores e território](docs/odores-e-territorio.md)
- [Fundação claustral](docs/fundacao.md)
- [Colônias filhas](docs/colonias-filhas.md)
- [Genética digital](docs/genetica.md)
- [Paisagem procedural](docs/procedural.md)
- [Cronograma](docs/cronograma.md)
- [Especificações](docs/especificacoes.md)
- [Arquitetura](docs/arquitetura.md)
- [Navegação](docs/navegacao.md)
- [Solo e escavação](docs/solo.md)
- [Dinâmica de terra solta](docs/granular.md)
- [Água e calor espaciais](docs/agua-e-calor.md)
- [Organização da colônia](docs/colonia.md)
- [Campos e tarefas](docs/campos.md)
- [Versões](CHANGELOG.md)

Cada entrega usa branch e tag próprias. O modelo é exploratório, sem validação biológica/geotécnica. Alargamento local por congestionamento não equivale à escavação completa, transporte de terra ou física granular.

- [Gases e ventilação](docs/gases-e-ventilacao.md): rede de fluxo, respiração, balanços e sensores locais exploratórios.

- [Suporte estrutural](docs/suporte-estrutural.md): amostras do teto, carga/capacidade, fissuras e desprendimento exploratórios.

- [Aprendizado local](docs/aprendizado-local.md): SARSA neural opcional, cérebros individuais e avaliação contra ACO.

- [Persistência e recuperação](docs/persistencia.md): IndexedDB, checkpoints, importação e preservação dos saves antigos.

- [Previsões](docs/previsoes.md): progresso, cancelamento, horizonte e orçamento do modelo completo.

- [Observação e avaliação das previsões](docs/avaliacao-previsoes.md): contrato parcial, comparação por horizonte e ensaio sintético reproduzível.

- [Perfis biológicos](docs/perfis-biologicos.md): parâmetros versionados, proveniência, hipóteses e cenários de referência.
