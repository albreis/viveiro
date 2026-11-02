export const lessons = [
  {
    id: "trilhas-vento",
    title: "Feromônios e vento",
    a: "Sem vento",
    b: "Vento X = 1,5 u.",
    question: "O vento muda a trilha e as escolhas locais das operárias?",
    setup:
      "Colônia preparada e trilha química inicial artificial, iguais em A/B. Vento também afeta o ar; não isola apenas a química.",
    view: "top",
    trails: true,
    interior: false,
  },
  {
    id: "repouso-solo",
    title: "Ângulo de repouso",
    a: "Repouso 15°",
    b: "Repouso 55°",
    question: "A mesma terra solta desliza de forma diferente?",
    setup:
      "Uma perturbação idêntica prepara material solto nos dois mundos. Ângulo é parâmetro exploratório, não solo calibrado.",
    view: "side",
    trails: false,
    interior: true,
  },
  {
    id: "entradas-ar",
    title: "Entradas e ventilação",
    a: "Uma entrada",
    b: "Segunda entrada aberta",
    question: "Como a abertura muda O₂ e CO₂ nas galerias?",
    setup:
      "Ninho didático de geometria controlada, com ar inicial igual em concentração. Abrir o segundo acesso também muda seu trecho e volume.",
    view: "side",
    trails: false,
    interior: true,
  },
  {
    id: "crias-temperatura",
    title: "Prole no frio e no calor",
    a: "Ar e solo a 18 °C",
    b: "Ar e solo a 28 °C",
    question: "Como a temperatura altera o acúmulo térmico da mesma prole?",
    setup:
      "Ovos preparados, mesma água no solo e perfil térmico genérico sem diapausa. Não corresponde a espécie calibrada.",
    view: "side",
    trails: false,
    interior: true,
  },
  {
    id: "fundacao-coleta",
    title: "Duas estratégias de fundação",
    a: "Claustral",
    b: "Semiclaustral",
    question: "O que muda quando a rainha pode coletar alimento fora?",
    setup:
      "Dois alados e solo intacto. Compara perfis de estratégia: entrada/selamento e coleta também mudam; não é comparação entre espécies.",
    view: "iso",
    trails: false,
    interior: false,
  },
  {
    id: "mesma-seed",
    title: "Mesma seed, uma intervenção",
    a: "Sem alimento extra",
    b: "Uma porção extra de 5 u.",
    question:
      "Uma intervenção localizada pode separar dois futuros da mesma seed?",
    setup:
      "Mundos iniciais iguais; só B recebe alimento pelo mecanismo normal de intervenção no instante inicial.",
    view: "top",
    trails: true,
    interior: false,
  },
  {
    id: "heranca",
    title: "Herança e movimento",
    a: "Alelo materno 0,2",
    b: "Alelo materno 0,8",
    question:
      "Como um alelo materno de locomoção chega às filhas e afeta o movimento?",
    setup:
      "Família preparada. Muda um locus da rainha; pai e demais genes iguais. Efeitos genéticos são demonstrativos, não DNA real.",
    view: "side",
    trails: false,
    interior: true,
  },
] as const;
export type LessonId = (typeof lessons)[number]["id"];
export function lessonDefinition(id: string) {
  const found = lessons.find((item) => item.id === id);
  if (!found) throw Error("Experimento de aula desconhecido.");
  return found;
}
