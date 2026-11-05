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

- [x] Executar [UX-01–UX-21](ux-interface.md) na ordem das cinco fases.
- [x] Reutilizar módulos TS e `src/i18n`, sem strings duplicadas ou arquivos gigantes.
- [x] Preservar seleção/câmera, A/B, saves, checkpoints, pausa e plano de execução.
- [x] Após cada fase: screenshots e métricas em 1440×900, 820×1180 e 390×844,
  pt/en, teclado e estados abertos; testes dirigidos onde houver lógica nova.
- [x] Verificar que alterar o layout não muda hashes/execução do modelo.

A experiência em celular físico foi [confirmada pelo usuário](voce-sozinho.md).
Os testes em viewport cobrem a regressão técnica do layout.

## T3 — P1.1: carregamento e desempenho em execução

- [x] Medir causas de TBT/CLS dos resultados Lighthouse 44 desktop/33 móvel;
  priorizar mudança com evidência e repetir a medição afetada.
- [x] Preparar cenário com seed, versão, população e carga documentadas; medir
  FPS com a simulação em movimento no perfil leve e no mesmo modelo.
- [x] Registrar hardware, navegador, duração e distribuição de quadros; comparar
  antes/depois, sem transformar a medição local em aceite de Chromebook.

A [medição local e seu protocolo](../qa-desempenho.md) estão publicados.
O alvo P1.1B continua ≥30 FPS em equipamento de entrada identificado.
Resultados de carregamento não são medidas de FPS.

## T4 — P3: análise e calibração já iniciadas

- [ ] Seguir a [retomada Buhl](buhl.md), preservando branch, anexos e experimentos.
- [x] Distinguir reconciliação de código, execução de benchmark, calibração,
  validação reservada e replicação por equipe independente.
- [x] Definir unidades/tempo físico e critérios antes do ajuste; resultados
  desfavoráveis precisam continuar publicados.
- [x] Usar P2.3/P2.4 para retomada e sensibilidade, adequando as entradas ao
  experimento; não presumir que o benchmark antigo já está integrado.
- [x] Gerar [relatório](../validacao.md) com parâmetros, fontes, incerteza,
  MAE, cobertura e desvios observados.

A obtenção de dados de reuso permitido não exige automaticamente contato com
laboratório. O acordo exigido em P3.1 e a revisão independente continuam externos.
Os [conjuntos adicionais](dados-opcionais.md) são uma expansão opcional, sem
substituir a validação de Buhl por seleção de resultados mais favoráveis.

## T5 — Apoio técnico a escola, publicação e comunidade

- [x] Preparar [fichas de parecer dos seis roteiros](../ensino/revisao-docente.md).
- [ ] Aplicar correções após receber pareceres de Biologia e Física.
- [x] Preparar [instrumentos SUS/pré/pós, registro e análise local](../ensino/piloto.md).
- [ ] Analisar resultados reais após o piloto, sem preencher respostas ausentes.
- [x] Preparar [roteiro e registro da primeira experiência](../ensino/primeira-experiencia.md).
- [ ] Corrigir barreiras observadas no teste real com pessoa nova.
- [ ] Conferir e integrar contribuições externas quando recebidas; validar novas
  receitas por schema/seed/manifesto, com autoria e licença.
- [x] Preparar [rascunho de publicação e exemplo reproduzido da 0.46.0](../publicacao/preparacao.md).
- [ ] Revisar texto após resultados reais de calibração e piloto e preparar a
  versão escolhida com os autores. Submissão e pareceres seguem nas filas humanas.

A migração da UI/renderer já foi entregue. O legado de simulação pode migrar
por necessidade concreta; não reabrir essa entrega como se os 13 JS restassem.
