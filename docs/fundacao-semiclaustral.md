# Fundação semiclaustral demonstrativa

## Etapa 10C — 0.23.0

Perfil separado generic-semiclaustral-demo@1, revisão de mecanismos 6. Mantém entrada aberta e reservas iniciais de lipídio/proteína/músculo, desenvolvimento térmico e pupa nua. Não altera genéricos 1–5, saves anteriores ou a escolha padrão. Não representa uma espécie, dieta ou duração natural calibrada. Os oito créditos iniciais são orçamento demonstrativo, não uma medição de reservas de uma rainha semiclaustral.

## Movimento e decisão

Após a escavação física, a rainha alterna cuidado, saída, busca e retorno. Percorre a galeria e o lábio de entrada com as mesmas consultas de apoio e passos limitados usadas na fundação. Na superfície, detecta fontes somente até 2,3 unidades e coleta a menos de 0,38 unidade, com proximidade vertical ao solo. Conhece o próprio abrigo; não consulta um mapa global de alimento.

A carga máxima é 0,65 crédito, o alvo da despensa 1,4, a busca dura até 600 passos e há 80 passos entre viagens. A busca na superfície custa mais 0,0004 crédito/passo, além da manutenção. Predadores próximos provocam fuga/retorno e a rainha exposta pode ser capturada. A regra identifica a colônia real no habitat compartilhado. Limites de busca não garantem encontrar alimento ou transpor qualquer obstáculo.

A primeira postura exige 0,84 crédito coletado, suficiente para quatro ovos demonstrativos, e a rainha deve estar de volta à câmara. Depois, crias usam a despensa e as reservas acessíveis. As naníticas assumem somente após o retorno da rainha; o restante da despensa passa ao estoque geral uma vez.

## Contabilidade e persistência

O alimento coletado fica separado das reservas corporais originais. Nenhum recurso reescreve o valor inicial ou aumenta gratuitamente a reserva materna. São verificadas duas identidades:

- Coletado = carga em trânsito + entregue + perdido.
- Entregue = despensa atual + consumido + exportado ao estoque geral.

Custos de fundação = consumo dos tecidos iniciais + consumo da despensa. Na manutenção durante uma viagem, a rainha usa sua reserva pessoal; não retira remotamente alimento da câmara. Cria na câmara pode consumir o alimento já entregue. Perda de carga na morte é um sumidouro registrado, sem reembolso. Créditos externos são nutrientes genéricos e não distinguem carboidratos, proteína, água ou biomassa. Estoque externo inacessível não paga a primeira postura.

Estado, contadores e carga persistem e são validados. Registros incompatíveis, saldos negativos, excesso de carga e balanços inconsistentes são rejeitados. O balanço independente de terra continua conservado.

## Verificação

Sete casos novos e nove regressões dirigidas passaram. No ensaio físico seed a com fonte finita controlada, quatro naníticas nasceram e a fundação terminou no passo 2612: três viagens, 1,95 coletados, 1,30 consumidos e 0,65 exportados, reserva materna 5,19005. Maior passo corporal 0,06798 unidade. Restore em plena viagem manteve futuro idêntico. Um cenário sem alimento terminou em falha sem ovos gratuitos.

QA no navegador, SEMICLAUSTRAL-QA, 21 °C/80% de ar: quatro viagens externas da rainha, quatro naníticas e colônia fundada; checkpoint nomeado em D87,2. Catálogo conferido com sete coeficientes, sem anunciar tampão ou diapausa nessa variante; console sem erros. Não confundir este cenário com o ensaio controlado seed a. A suíte completa passou: 217/217 testes em 270.340 ms; TypeScript/Vite final aprovado. Nenhuma dependência nova.

O mundo recente do usuário SEMENTE-50088 avançara desde a QA anterior. Seu estado D62,5 foi preservado em manual-b950fe52-33b4-4c6c-9265-d4b87ece98cf e restaurado em pausa ao encerrar a conferência. Os pontos D16,9 e D267 continuam preservados.

## Limites e próximos passos

Sem dieta calibrada, memória detalhada de fontes, caça pela rainha, mecanismo de aprendizagem próprio ou cuidado que exija presença contínua da rainha. Continua sendo a primeira ninhada finita do mecanismo anterior; não há garantia de reposição se toda a prole inicial for perdida. Etapas 12–14 tratam microclima/câmara, fertilidade/longevidade e escala temporal. Dados externos de espécies semiclaustrais são necessários para calibração; não foram estimados a partir dos sliders.
