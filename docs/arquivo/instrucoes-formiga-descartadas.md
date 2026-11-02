# Proposta arquivada: instruções em português para uma formiga (P2.8)

Descartada pelo usuário em 02/11/2026: não será implementada. Fora do escopo
ativo e dos critérios de conclusão; não retomar sem novo pedido explícito.
Os detalhes abaixo preservam a proposta anterior como histórico, não como
trabalho pendente ou funcionalidade entregue.

O usuário escreve um pedido para uma formiga; um modelo de linguagem propõe uma regra numa linguagem de fórmulas fechada; o simulador valida, mostra, salva e aplica só àquela formiga. A IA nunca escreve código executável.

- Entradas: somente sensores locais existentes (cheiro, CO₂, O₂, temperatura e água do solo, carga, energia, contato).
- Saídas: somente parâmetros de decisão (peso das saídas, limiares de tarefa, preferência de câmara, exploração). Nunca posição, recursos ou mapa global.
- Limites com nome definidos pelo modelo e registrados no catálogo (co2_alto, temperatura_alta, solo_encharcado...), em vez de números escolhidos pela IA.
- Interpretador próprio em TypeScript, sem eval; rejeita sensores inexistentes, fórmulas grandes, valores fora da faixa, divisão por zero e NaN.
- Teste de efeito: a fórmula é avaliada em situações típicas e na borda da faixa normal; cada sensor declarado precisa alterar o resultado. Falha gera uma nova tentativa com a mensagem do validador.
- A explicação mostrada ao usuário é gerada pelo código a partir da fórmula, não pela IA.
- O save guarda fórmula, pedido, modelo, versão e tick, como intervenção. O replay nunca chama a IA.
- A regra entra no catálogo como hipótese gerada por IA, não como comportamento biológico.
- Nenhuma credencial no repositório ou no bundle; o modelo fica atrás de um endpoint com token, fila, limite por usuário e cache de pedidos repetidos.

Ordem: linguagem e validador; regras escritas à mão com save e replay; endpoint do modelo; painel na primeira pessoa com comparação pela mesma seed; testes de conservação, ausência de leitura global e replay idêntico.

Modelo local avaliado em novembro de 2026, num VPS de 8 vCPUs AMD EPYC (AVX-512) com 3 núcleos reservados, Ollama, quantização de 4 bits e temperatura zero. Com esquema JSON, padrões de fórmula e exemplos, Qwen3 4B (sem modo de raciocínio) usou o padrão correto e explicação coerente; Qwen2.5 3B gerou fórmulas válidas mas com comportamento errado. Geração entre 8 e 17 tokens/s conforme a carga do servidor; carregamento de 7 a 25 s quando o modelo não está em memória. Foram poucas instruções: antes de escolher, executar um conjunto de 30 a 50 instruções com situações esperadas, várias repetições, taxa de acerto, tempo médio e pior tempo.
