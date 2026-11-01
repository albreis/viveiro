# Previsões do terrário

## Entrega 8C1 — 0.16.0

O painel agora informa progresso por passos e futuros concluídos. É possível cancelar, recalcular, escolher horizontes de1/3/7dias,6/18futuros e10/30/120segundos de trabalho. As opções são da sessão de visualização; a recarga usa os padrões18/3/30. Cancelar ou atingir o orçamento não provoca repetição automática a cada frame. Uma intervenção, recuperação, replay ou troca de cenário invalida o cálculo anterior.

A previsão usa uma cópia do estado completo. Cada futuro executa o mesmo World.step do terrário, incluindo física, cérebro individual, habitat e colônias filhas. Nenhuma decisão das formigas recebeu acesso global novo. Não há emulador estatístico substituindo o modelo3D.

## Modelo e reprodução

Preservado o ensemble anterior: RNG raiz derivado de seed/tick/índice e pequenas perturbações uniformes de até3pontos nos controles de umidade relativa e luz, limitados a0–100. Os estados internos/RNG das filhas vêm do snapshot; isso não representa todas as incertezas biológicas ou ambientais. Nenhuma intervenção futura é conhecida. A entrada e o RNG do mundo observado permanecem intactos.

A população conta adultos da família. Os quantis empíricos usam os mesmos índices anteriores: P10=floor((n−1)·0,1),P90=ceil((n−1)·0,9),mediana=floor(n/2) na amostra ordenada. É uma faixa descritiva exploratória, não um intervalo de confiança calibrado ou garantia de80%de cobertura real.

## Agendamento e limites

src/modules/forecast separa contratos, criação do mundo/sumarização e execução. ForecastRunner aceita somente um cálculo ativo e o último pedido pendente; pedidos intermediários são descartados. O cliente ignora IDs anteriores, incluindo respostas após cancelamento. Erros permanecem visíveis e o usuário pode tentar novamente.

O Worker cede o controle após aproximadamente8ms de trabalho e espera40ms antes da próxima fatia. Um passo físico/restauração é indivisível: o limite de8ms e o orçamento podem ser ultrapassados por essa operação. maxSliceMs registra esse custo. O tempo ativo mede duração de trabalho síncrono, incluindo preempção do sistema; não é medição precisa de CPU. O tempo total inclui pausas. Um mundo grande ainda pode levar minutos; rodar em Worker e limitar fatias não constitui promessa de desempenho constante.

O orçamento é por pedido, não por futuro. Só um horizonte terminado entra na amostra; passos de uma trajetória incompleta nunca são tratados como resultado final. Com menos de dois futuros concluídos, não se exibe intervalo. Uma amostra interrompida pode ter viés por custo de execução, portanto é marcada como provisória. Não há continuação silenciosa após o limite.

## Validação

Oito testes novos: equivalência exata com o ensemble síncrono, entrada intacta, cancelamento após yield, orçamento com passo indivisível, substituição de pedidos, descarte de respostas antigas, falha do Worker e opções inválidas. Dois testes existentes de previsão/reconstrução passaram em41379ms. TypeScript/Vite aprovados. A suíte completa153/153 da versão0.15.0 já havia passado; não se alega nova execução completa161/161. A lógica biológica não mudou nesta entrega.

Navegador: seed a no dia267,97adultos,14crias e duas colônias preservados.1dia/6futuros/10s de trabalho terminou com3/6concluídos,98–99adultos,25s decorridos; aviso de faixa provisória visível. Com120s de orçamento,6/6terminaram:97–99adultos,44,9s decorridos/17,6s ativos. Cancelar, recalcular e intervenção92→91→92%RH descartaram o resultado anterior; experimento continuou pausado. Nenhum erro novo durante a QA final; logs ainda incluem dois erros antigos da atualização parcial por HMR às14:44:57, anteriores à recarga final. Screenshots viveiro-0.16.0-previsao.png e viveiro-0.16.0-completa.png.

Medição isolada em Node24 usando o backup real do dia267:2futuros de0,1dia (20passos totais),912,9ms decorridos/911,8ms ativos, maior fatia160,7ms,97adultos em ambos. Sem pausas artificiais nessa medição. Isso evidencia que uma operação indivisível pode exceder8ms; não comparar esse microteste diretamente com renderização ou com horizontes de1/3/7dias. Os tempos dependem da máquina/carga.

## Etapa8C2 — observação e validação (0.17.0)

Modo parcial e ensaio pareado por horizonte implementados; protocolo, resultados e limites em [Avaliação das previsões](avaliacao-previsoes.md). Essa avaliação é do modelo sintético; calibração científica exige séries observadas por espécie, ambiente, manejo e desfechos, além de dados para identificar parâmetros. Melhor ajuste ao próprio simulador não prova fidelidade à natureza.
