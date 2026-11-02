# Ritmo e continuidade entre sessões

Etapa 14, versão 0.29.0. O integrador continua executando100 passos por dia do modelo. O ritmo de observação não troca coeficientes, genes, RNG ou tamanho do passo biológico. Não há calibração cronológica por espécie.

## Relógio visível

O painel Tempo do experimento oferece10 s,1 min,5 min ou1 h por dia, com os multiplicadores1×,3× e10×. Uma instalação sem save começa em1 min/dia. Um save sem relógio é lido no ritmo legado de10 s/dia e1×; não se promove seu perfil biológico. Um novo terrário dentro da mesma sessão conserva o ritmo escolhido.

A cada quadro visível, o relógio recebe Δt ×100 ×multiplicador /segundosPorDia créditos de passo. Executa passos inteiros, conserva a fração e os passos atrasados. O orçamento visual é6 ms e até30 passos por quadro; um único passo indivisível pode exceder6 ms. Acúmulo aparece no painel. Hardware lento pode não acompanhar o ritmo nominal; nenhum FPS escolar é prometido. Pausar conserva a dívida, trocar de ritmo afeta apenas novos créditos, e criar/repetir o mundo zera a dívida do mundo anterior.

O relógio persistido contém versão, duração do dia, multiplicador e créditos pendentes. A página oculta pausa o acréscimo do relógio; fechar/reabrir não converte automaticamente o tempo de calendário em dias biológicos. Não há previsão do tempo real nem execução em servidor nesta etapa.

## Avanço explícito

Avançar sem renderização pausa o terrário e guarda um checkpoint nomeado do estado anterior no IndexedDB. Se essa proteção falhar, não inicia o cálculo. O Worker usa o mesmo World e a mesma função stepSession do modo visível. Ações de replay são executadas antes do passo do mesmo instante biológico e os cenários A/B avançam juntos. Nenhuma previsão estatística substitui a trajetória real.

Cada pedido aceita1–365 dias e10 s,30 s ou2 min de orçamento ativo. Trabalha em fatias de8 ms, cedendo16 ms entre elas; um passo e a reconstrução/serialização são indivisíveis e podem ultrapassar a fatia. O orçamento não é garantia de duração total: pausas, mensagens e serialização também custam tempo. Progresso informa dias calculados, sem alterar o mundo visível.

Ao completar ou atingir o orçamento, somente passos completos são aplicados; a sessão fica pausada e passa pela gravação normal. Um destino ainda incompleto é guardado no save e pode ser retomado mesmo após recarregar. Cancelar antes da aplicação termina o Worker e descarta seu futuro; a fonte não foi alterada. Não há checkpoints intermediários dentro de uma tentativa: fechar a página durante o cálculo perde apenas essa tentativa ainda não aplicada. O ponto anterior continua recuperável.

Editar o ambiente, trocar o cenário A/B, recuperar/importar, iniciar outro terrário, repetir a seed, tocar o play ou mudar o ritmo cancela a tentativa em curso. A geração de requisição descarta mensagens antigas, inclusive após cancelamento. Retomar o modo visível ou editar o modelo remove o destino pendente; recuperar um checkpoint com destino pode retomá-lo explicitamente.

A interface continua acessível enquanto o cálculo usa outro thread do navegador. Isso não significa funcionamento com o Site fechado ou disponibilidade dos assets sem rede: PWA/cache fazem parte deP1. Execução contínua em servidor precisa de infraestrutura, orçamento, autenticação e política de retenção próprios.

## Custos e limites

A1 min/dia e1×,365 dias exigem6 h5 min de observação e30 anos de365 dias exigem182,5 h. São conversões de ritmo, não uma medição de longevidade nem um benchmark de avanço headless. Checkpoints e pedidos parciais permitem repartir um ensaio; o limite por pedido evita um processamento irrestrito. Não foi realizado um ensaio de30 anos.

O IndexedDB é local ao navegador/origem. A cópia do dev e a do Site são independentes; exportar/importar o JSON ou checkpoint transfere também relógio e destino. O CRC detecta corrupção acidental, não autentica o arquivo. As proteções existentes contra abas concorrentes e a necessidade de espaço no disco continuam valendo.

## Verificação

Testes dirigidos conferem equivalência byte a byte de mundos A/B sob quatro ritmos, multiplicadores e quadros irregulares; ações em ticks10/70; RNG; dívida/fração do relógio; save legado; cancelamento; mensagens obsoletas; limite de dias; orçamento e retomada de checkpoints até o mesmo destino. Os relógios sintéticos dos testes de orçamento não são medições de desempenho.

284/284 na suíte completa em220.126 ms (.runtime/time-suite.log), sessão50079 coletada e encerrada. Depois foram acrescentados dois casos de colônias filhas e do perfil de fundação/saúde; os18 dirigidos finais passaram em2.919 ms (.runtime/time-target-final.log). Não afirmar suíte completa286. Build TypeScript/Vite final:308 módulos, sem pacote novo. Alterações posteriores foram de apresentação.

QA no navegador: cópia do terrário SEMENTE-50088, D62,5 em pausa. Um dia explícito terminou em D63,5, mantendo60 s/dia a3× após reload. Checkpoint manual-2f3f2138-7722-4ded-a2bd-e3c5e81d9d71. Pedido365 dias foi cancelado após mais de36 dias calculados, sem aplicar nenhum; dia63,5 preservado. Outro pedido atingiu o limite após48,92 dias completos, chegando ao tick11242 e guardando destino42850. Checkpoint manual-2d747e9f-9eda-4e81-b163-1b92db4915e8 recuperado/recarregado; botão Retomar e ritmo persistiram. Retomada calculou de fato parte dos316,08 dias restantes; uma chuva cancelou o futuro não aplicado e removeu o destino. Não houve desfecho tardio substituindo a intervenção.

Original manual-2e91b636-785f-4f66-bb84-ff832aa62547 recuperado, ACK de recuperação confirmado: SEMENTE-50088/D62,5, perfil lab v5,10 s/dia a1×, pausado. Console sem erros. Painel reposicionado junto à cena; screenshot viveiro-0.29.0-tempo-final.png preservado. O dev continua a partir dea raiz do repositório.
