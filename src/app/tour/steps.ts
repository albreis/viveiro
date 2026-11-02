export const tourSteps = [
  {
    title: "Uma habitante, outro ponto de vista",
    description:
      "Este guia leva você à visão de uma formiga em três passos. Você pode usar mouse ou teclado, pular e reabrir quando quiser. O terrário continua no estado atual.",
    target: "viewport",
    jump: "Observar o terrário",
    next: "Começar",
  },
  {
    title: "1. Escolha uma habitante",
    description:
      "A lista abaixo do terrário mostra as formigas vivas. Escolha uma ou use a seleção atual. No teclado, Tab chega à lista e as setas mudam a seleção.",
    target: "ant-select",
    jump: "Mostrar a lista",
    next: "Usar seleção atual",
  },
  {
    title: "2. Entre em primeira pessoa",
    description:
      "Ative o botão “1ª pessoa ↗” ao lado da lista. Você também pode dar dois cliques numa formiga no cenário. O guia avança quando a câmera realmente entrar.",
    target: "follow-ant",
    jump: "Mostrar 1ª pessoa",
    next: "Aguardando entrada",
  },
  {
    title: "3. Veja por onde ela anda",
    description:
      "Você entrou na perspectiva de uma formiga. Arraste no cenário para olhar ao redor. Conclua o guia e use “Sair da formiga” ou Esc para voltar. O modelo é exploratório, sem espécie calibrada.",
    target: "exit-ant",
    jump: "Mostrar como voltar",
    next: "Concluir",
  },
] as const;
