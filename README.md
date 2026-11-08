# Viveiro

[Português](README.md) · [English](README.en.md)

Terrário 3D de formigas no navegador. Cada formiga é um agente autônomo que só percebe o que está ao seu redor (cheiro, temperatura, umidade, CO₂, contato) e, a partir disso, cava túneis, transporta terra, cuida da prole e funda novas colônias. Tudo é reproduzível por _seed_.

**[Abrir o laboratório público](https://viveiro.ersolucoesweb.com.br/)** · [Versões](CHANGELOG.md) · [Como citar](CITATION.cff)

> O Viveiro é um modelo **exploratório**. Os ciclos são acelerados e simplificados e não foram calibrados para nenhuma espécie real. Não trate os resultados como biologia, geotecnia ou engenharia validadas. Consulte a [especificação ODD](docs/odd.md) para saber exatamente o que o modelo faz.

## O que dá para fazer

- Observar o terrário de fora, girar a câmera e ver as galerias internas.
- Entrar em primeira pessoa numa formiga (duplo clique) e acompanhar o que ela sente.
- Pausar, acelerar e intervir no solo, na água e no vento.
- Repetir a mesma seed com intervenções diferentes e comparar os resultados.
- Rodar experimentos prontos para sala de aula e exportar os dados em JSON ou CSV.
- Rodar experimentos sem interface, pela linha de comando, com saída idêntica à do navegador.

Na **0.48.0**, novos terrários usam Narbonne v3 com acesso físico à escavação.
As operárias precisam alcançar solo apoiado e ter espaço para o corpo. Saves
antigos mantêm seus perfis e regras. [Mudanças e limites](CHANGELOG.md).

## Começar

Requer Node.js 24.

```sh
git clone https://github.com/albreis/viveiro.git
cd viveiro
npm ci
npm run dev
```

Abra http://127.0.0.1:4173. O Vite recarrega o navegador enquanto você edita.

| Comando                        | O que faz                                                     |
| ------------------------------ | ------------------------------------------------------------- |
| `npm run dev`                  | Servidor de desenvolvimento em 127.0.0.1:4173.                |
| `npm test`                     | Testes do modelo (`node --test`).                             |
| `npm run build`                | Checa TypeScript e gera o bundle em `dist/`.                  |
| `npm run preview`              | Serve o build na mesma porta. Rode só um entre dev e preview. |
| `npm run experiment -- --help` | Experimentos sem interface. Veja [CLI](docs/cli.md).          |

`dist/` é gerado pelo Vite e não deve ser editado à mão.

## Usar

O botão **Tour guiado** apresenta a seleção de uma formiga e a visão em primeira pessoa. Dá para pular e reabrir sem reiniciar o terrário.

- Arraste para orbitar e role para aproximar.
- Clique de novo na vista lateral para alternar entre os quatro lados.
- **Ver túneis internos** mostra galerias afastadas dos vidros.
- **Novo terrário** gera outra paisagem e outro ninho. Saves existentes são preservados.
- Duplo clique numa formiga (ou escolha na lista) entra em primeira pessoa. Esc volta ao terrário.

100 passos equivalem a um dia simulado.

## Varreduras de parâmetros

Na página de experimentos, compare cinco valores com dez réplicas e baixe uma
retomada transportável. No terminal, `npm run sweep -- --out resultado-novo --jobs 2`
executa as mesmas 50 condições; `--resume` reutiliza os resultados já verificados.
[Configuração, arquivos e limites](docs/varreduras.md).

## Estrutura do código

| Pasta                    | Conteúdo                                                               |
| ------------------------ | ---------------------------------------------------------------------- |
| `src/app`                | Interface e controle da experiência.                                   |
| `src/modules/navigation` | Sensores, forças e locomoção (TypeScript estrito).                     |
| `src/modules/simulation` | Relógio fixo e ciclos biológicos.                                      |
| `src/modules/landscape`  | Geração por seed, espécies, água e materiais.                          |
| `src/modules/terrain`    | Terreno compartilhado entre física e desenho.                          |
| `src/modules/renderer`   | Cena, câmera, seleção, plantas e corpos.                               |
| `src/services`           | Persistência (IndexedDB, checkpoints) e serviços.                      |
| `src/workers`            | Previsões, aprendizado e malha do solo fora da renderização.           |
| `src/i18n`               | Catálogos por idioma/área, controle de locale e documentos traduzidos. |
| `src/styles`             | CSS por componente e breakpoint.                                       |
| `scripts`                | CLI de experimentos, release pública e depósito.                       |
| `tests`                  | Testes do modelo.                                                      |

A navegação e os controles novos são tipados. Partes legadas da interface, da biologia e do renderer ainda estão em JavaScript e são migradas aos poucos.

## Documentação

**Modelo**

- [Especificação ODD](docs/odd.md) e [arquitetura](docs/arquitetura.md)
- [Navegação](docs/navegacao.md), [campos e tarefas](docs/campos.md) e [odores e território](docs/odores-e-territorio.md)
- [Solo e escavação](docs/solo.md), [terra solta](docs/granular.md) e [suporte estrutural](docs/suporte-estrutural.md)
- [Água e calor](docs/agua-e-calor.md) e [gases e ventilação](docs/gases-e-ventilacao.md)
- [Organização da colônia](docs/colonia.md) e [estoques por câmara](docs/estoques-por-camara.md)
- [Aprendizado local](docs/aprendizado-local.md) e [paisagem procedural](docs/procedural.md)

**Biologia**

- [Perfis biológicos](docs/perfis-biologicos.md) e [biologia planejada](docs/biologia-planejada.md)
- [Fundação claustral](docs/fundacao.md), [semiclaustral](docs/fundacao-semiclaustral.md) e [colônias filhas](docs/colonias-filhas.md)
- [Espermateca e fertilidade](docs/espermateca.md), [genética](docs/genetica.md) e [reservas maternas](docs/reservas-maternas.md)
- [Saúde e longevidade](docs/saude-longevidade.md), [maturação térmica](docs/maturacao.md), [sazonalidade](docs/sazonalidade.md) e [selamento](docs/selamento.md)
- [Simbioses e mimetismo](docs/simbioses.md)

**Experimentos e ensino**

- [Experimentos de aula](docs/experimentos-de-aula.md) e [guias docentes](docs/ensino/README.md)
- [Previsões](docs/previsoes.md) e [avaliação das previsões](docs/avaliacao-previsoes.md)
- [CLI](docs/cli.md) e [CSV diário](docs/csv-diario.md)
- [Persistência e recuperação](docs/persistencia.md) e [ritmo entre sessões](docs/ritmo-e-continuidade.md)

**Projeto**

- [Cronograma](docs/cronograma.md) e [roadmap](ROADMAP.md)
- [Acessibilidade](docs/acessibilidade.md), [PWA offline](docs/pwa-offline.md) e [perfil leve](docs/perfil-leve.md)
- [Publicação por tag](docs/publicacao-por-tag.md) e [citação e depósito](docs/citacao-e-deposito.md)
- [Kit de divulgação](docs/divulgacao/kit-divulgacao.html) e [fórmulas explicadas](docs/divulgacao/formulas/README.md)

## Contribuir

Leia o [guia de contribuição](CONTRIBUTING.md), escolha uma [primeira tarefa](https://github.com/albreis/viveiro/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) ou participe de [Discussions](https://github.com/albreis/viveiro/discussions).

Cada etapa é desenvolvida numa branch própria e entra na `main` por pull request, com testes do modelo e verificação no navegador. Leia o [AGENTS.md](AGENTS.md) para as convenções do projeto. Nunca coloque tokens ou credenciais no repositório.

## Licenças

O código usa a licença [MIT](LICENSE). A documentação e as imagens originais usam [CC BY 4.0](LICENSE-DOCS.md). Materiais de terceiros mantêm suas próprias licenças, e o aviso do Three.js está preservado sem alterações. Veja [recursos de terceiros](docs/terceiros.md).

## Citar

Cite a versão e o commit descritos em [CITATION.cff](CITATION.cff). O pacote para depósito é gerado por `node scripts/prepare-deposit.ts`. Veja [citação e depósito](docs/citacao-e-deposito.md).
