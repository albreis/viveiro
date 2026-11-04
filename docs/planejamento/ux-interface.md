# UX e interface — 21 melhorias por etapas

Fonte: [revisão fornecida pelo usuário](fontes/revisao-ux-v0.44.0.md), sobre
**v0.44.0/9a2324f**, não uma auditoria nova da 0.46.0. Os números da fonte são
históricos. UX-01–UX-21 correspondem a T1–T21 do documento original.
A coluna Estado registra o aceite técnico de cada melhoria.

## Fase 1 — Legibilidade e consistência

| ID | Implementação | Aceite | Estado |
| --- | --- | --- | --- |
| UX-01 | Rever tipografia pequena | Texto visível ≥12px; rótulos em caixa alta/espaçados podem ter 11px, com leitura e contraste conferidos | Entregue |
| UX-02 | Ações secundárias com aparência de botão | Borda/fundo legível, uma ação por linha onde necessário; desabilitado distinguível e motivo acessível | Entregue |
| UX-03 | Uniformizar fotoperíodo | Slider segue o padrão visual e de interação dos demais controles | Entregue |
| UX-04 | Pluralização pt-BR/en | Usar Intl.PluralRules/equivalente na i18n; eliminar `(s)`/`(ões)` e testar zero/um/vários | Entregue |
| UX-05 | Descoberta dos modos de câmera | Preservar aria-labels já existentes; conferir tooltip, foco e nome visual do modo ativo (3D/topo/lateral/tela cheia) | Entregue |
| UX-06 | Agrupar perfis biológicos | optgroups por família/contexto, opções atuais legíveis e seleção preservada | Entregue |

A [medição da fase 1](../validacoes/ux-fase-1.json) registrou piso de 12 px em
dois idiomas e três tamanhos. As capturas locais ficam em `.runtime/ux1-final`.

## Fase 2 — Desktop acima de 1180px

| ID | Implementação | Aceite | Estado |
| --- | --- | --- | --- |
| UX-07 | Terrário antes das aulas | Topo do terrário ≤260px em 1440×900; aulas recolhidas/em drawer ou abaixo | Entregue |
| UX-08 | Coluna esquerda 280–300px | Nome completo do perfil legível, podendo quebrar linha/detalhar, sem corte silencioso | Entregue |
| UX-09 | Coluna direita sticky e navegação | Colônia sempre visível; abas acessíveis Colônia/Solo e ar/Dados/Lab; diferença entre alturas das colunas <300px | Entregue |
| UX-10 | Faixa de análise abaixo do terrário | Gráficos/previsão/saves aproveitam largura esquerda+centro; coordenar com UX-09 para não duplicar cartões/controles/IDs | Entregue |
| UX-11 | Tour ancorado ao terrário | Não cobre o resumo da colônia; foco e destaque continuam coerentes | Entregue |

A [medição da fase 2](../validacoes/ux-fase-2.json) registrou cena a 233 px,
coluna esquerda de 290 px e diferença de altura de 135 px em 1440×900.

## Fase 3 — Tablet de 650 a 1180px

| ID | Implementação | Aceite | Estado |
| --- | --- | --- | --- |
| UX-12 | Terrário em largura total | Em 820px, ambiente/intervenções ficam em duas colunas abaixo da cena | Pendente |
| UX-13 | Cartões com altura natural | Alinhamento no início, sem vazios >100px causados por esticamento artificial | Pendente |
| UX-14 | Barra persistente de tempo | Play/pausa, dia e 1×/3×/10× acessíveis em tablet/mobile, sem sobreposição ou armadilha de foco | Pendente |
| UX-15 | Cabeçalho consistente | Tour/Ajuda disponíveis nos três tamanhos, com mesmo significado e foco | Pendente |

## Fase 4 — Mobile até 650px

| ID | Implementação | Aceite | Estado |
| --- | --- | --- | --- |
| UX-16 | Cena no primeiro quadro | Canvas inteiro visível em 390×844, com aulas recolhidas | Pendente |
| UX-17 | Drawer de controles | Ambiente/Intervir/Tempo/Dados; ajustar e posicionar sem rolar a página; preservar foco, Escape e estado, sem IDs duplicados | Pendente |
| UX-18 | Áreas de toque | Alvos ≥44×44px; slider tem área de interação de 44px, não apenas trilho/manopla maiores | Pendente |
| UX-19 | Gestos compatíveis com a página | Um dedo rola; dois orbitam; pinça aproxima; testar primeira pessoa e confirmar em celular físico | Pendente |
| UX-20 | Ajuda contextual ao toque | Detectar ponteiro/gesto, não só largura; teclado continua descobrível quando disponível; dicas descrevem ações realmente implementadas | Pendente |

## Fase 5 — Explicações das métricas

| ID | Implementação | Aceite | Estado |
| --- | --- | --- | --- |
| UX-21 | Resumos e aprofundamento | Começar com 2–4 métricas por cartão e “Saiba mais”; preservar unidades/fontes/limites, sem anúncio a leitor de tela a cada frame | Pendente |

## Verificação em cada entrega

- [ ] Capturas e medidas em 1440×900, 820×1180 e 390×844, com pt-BR/en.
- [ ] Rodar axe-core/teclado nos componentes alterados; guardar achados incompletos.
- [ ] Conferir cena pausada/em movimento, A/B, primeira pessoa, tour, drawer e abas.
- [ ] Save/reset/checkpoint/restore, plano/hash e seleção preservados.
- [ ] Reavaliar zoom depois das mudanças; o teste anterior relatado pelo usuário
  continua registrado, com escopo limitado ao estado então observado.
- [ ] Confirmar UX-19/20 em aparelho físico na [fila individual](voce-sozinho.md).

A fonte menciona arquivos JS antigos; usar os módulos TS atuais, por exemplo
`status-view.ts`. Não criar controles duplicados em breakpoints nem embutir
texto de interface fora de `src/i18n`. Cada fase recebe branch `codex/` e PR
próprios, testes dirigidos e QA; o documento não fixa prazos sem medição.
