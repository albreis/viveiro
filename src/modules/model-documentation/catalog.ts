export const modelDocuments = [
  { slug: "index", title: "ODD do Viveiro", source: "docs/odd.md" },
  {
    slug: "estados",
    title: "Entidades, estados e escalas",
    source: "docs/odd/estados.md",
  },
  {
    slug: "agendamento",
    title: "Ordem dos processos",
    source: "docs/odd/agendamento.md",
  },
  {
    slug: "conceitos",
    title: "Conceitos de desenho",
    source: "docs/odd/conceitos.md",
  },
  {
    slug: "inicializacao",
    title: "Inicialização e entradas",
    source: "docs/odd/inicializacao.md",
  },
  {
    slug: "submodelos",
    title: "Mapa dos submodelos",
    source: "docs/odd/submodelos.md",
  },
  {
    slug: "reacao-difusao",
    title: "Reação-difusão reimplementável",
    source: "docs/odd/reacao-difusao.md",
  },
  {
    slug: "replicacao",
    title: "Vetores e replicação",
    source: "docs/odd/replicacao.md",
  },
  {
    slug: "aritmetica",
    title: "Aritmética portátil",
    source: "docs/aritmetica-portatil.md",
  },
  {
    slug: "varreduras",
    title: "Varreduras e retomada",
    source: "docs/varreduras.md",
  },
] as const;
export const modelDocumentSources = modelDocuments.map((d) => d.source);
