# Trabalho técnico

[Índice e aceites gerais](../cronograma.md). Itens desta fila podem ser preparados
ou executados pelo agente; os resultados de pessoas reais ficam nas outras filas.

## T1 — P1.6: acessibilidade automatizada

- [x] Integrar axe-core com Playwright ou Cypress numa ferramenta de QA separada
  do bundle. Cobertura de pt-BR/en em três tamanhos, diálogos, tour, perfis, A/B,
  galeria, cronograma e cena em execução ou em pausa.
  Abas e gavetas da UX entram na matriz nas fases correspondentes.
- [x] Registrar violações e resultados `incomplete`, corrigir ocorrências reais,
  guardar seletores/estado/versão. Não esconder alertas só para obter nota verde.
- [x] Corrigir o contraste do texto auxiliar de `#rain > span` e a diferença
  entre nome acessível e texto visível de `a.brand`; reavaliar os estados afetados.
- [x] Preparar roteiro de teclado/leitor de tela para a verificação manual.

[Axe-core oficial](https://github.com/dequelabs/axe-core) testa regras automáticas;
não é um leitor de tela. O teste manual continua separado. Lighthouse >90 já
passou; a nova cobertura serve para detectar estados que aquela medição não viu.

A matriz de 78 estados passou com zero violações automáticas. O [relatório](../validacoes/axe-t1/resumo.json) preserva os casos incompletos. O [roteiro manual](../roteiro-acessibilidade.md) está disponível.

## T2 — Interface e internacionalização

- [ ] Executar [UX-01–UX-21](ux-interface.md) na ordem das cinco fases.
- [ ] Reutilizar módulos TS e `src/i18n`, sem strings duplicadas ou arquivos gigantes.
- [ ] Preservar seleção/câmera, A/B, saves, checkpoints, pausa e plano de execução.
- [ ] Após cada fase: screenshots e métricas em 1440×900, 820×1180 e 390×844,
  pt/en, teclado e estados abertos; testes dirigidos onde houver lógica nova.
- [ ] Verificar que alterar o layout não muda hashes/execução do modelo.

Gestos físicos e conforto real no celular têm uma verificação individual própria;
simular viewport não substitui essa experiência.

## T3 — P1.1: carregamento e desempenho em execução

- [ ] Medir causas de TBT/CLS dos resultados Lighthouse 44 desktop/33 móvel;
  priorizar mudança com evidência e repetir a medição afetada.
- [ ] Preparar cenário com seed, versão, população e carga documentadas; medir
  FPS com a simulação em movimento no perfil leve e no mesmo modelo.
- [ ] Registrar hardware, navegador, duração e distribuição de quadros; comparar
  antes/depois, sem transformar a medição local em aceite de Chromebook.

O alvo P1.1B continua ≥30 FPS em equipamento de entrada identificado.
Resultados de carregamento não são medidas de FPS.

## T4 — P3: análise e calibração já iniciadas

- [ ] Seguir a [retomada Buhl](buhl.md), preservando branch, anexos e experimentos.
- [ ] Distinguir reconciliação de código, execução de benchmark, calibração,
  validação reservada e replicação por equipe independente.
- [ ] Definir unidades/tempo físico e critérios antes do ajuste; resultados
  desfavoráveis precisam continuar publicados.
- [ ] Usar P2.3/P2.4 para retomada e sensibilidade, adequando as entradas ao
  experimento; não presumir que o benchmark antigo já está integrado.
- [ ] Gerar relatório com parâmetros, dados/fontes, incerteza, MAE e cobertura.

A obtenção de dados de reuso permitido não exige automaticamente contato com
laboratório. O acordo exigido em P3.1 e a revisão independente continuam externos.
Os [conjuntos adicionais](dados-opcionais.md) são uma expansão opcional, sem
substituir a validação de Buhl por seleção de resultados mais favoráveis.

## T5 — Apoio técnico a escola, publicação e comunidade

- [ ] Preparar fichas de parecer dos seis roteiros e aplicar as correções recebidas.
- [ ] Preparar instrumentos SUS/pré/pós, registro de sessões e análise do piloto;
  não preencher respostas ou inventar participantes.
- [ ] Preparar guia de execução e relatório para uma pessoa nova testar o tour.
- [ ] Conferir e integrar contribuições externas quando recebidas; validar novas
  receitas por schema/seed/manifesto, com autoria e licença.
- [ ] Apoiar texto de preprint/JOSS, versões, dados e instruções de reprodução;
  submissão e pareceres seguem nas filas humanas.

A migração da UI/renderer já foi entregue. O legado de simulação pode migrar
por necessidade concreta; não reabrir essa entrega como se os 13 JS restassem.
