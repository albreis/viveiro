# Experimentos de um clique / P1.3

Versão 0.33.0. Sete perguntas com seed fixa, dois cenários, câmera e
condição inicial explícita. Abrem pausadas. O tempo biológico não é adiantado
para montar a população: rainha, 16 operárias e 8 ovos são uma condição
preparada, sem inventar uma trajetória histórica. Fundação usa dois alados e
solo intacto. Predadores são retirados igualmente dos dois cenários.

| Aula | Diferença declarada em A/B |
| --- | --- |
| Feromônios | Mesmo campo artificial inicial; vento X 0 ou 1,5. Também afeta ar. |
| Repouso | Mesma perturbação com terra solta; ângulo 15° ou 55°. |
| Ventilação | Uma entrada ou segunda abertura, incluindo alteração do trecho/volume. |
| Prole | Ar e solo a 18 ou 28 °C; água inicial idêntica; sem diapausa. |
| Fundação | Perfil claustral ou semiclaustral: entrada, selamento e coleta diferem. |
| Intervenção | Mesma seed; só B recebe 5 u. de alimento pelo mecanismo normal. |
| Herança | Um locus materno 0,2 ou 0,8; pai e demais loci preservados. |

Não são espécies calibradas, medições de solo real, DNA ou previsões validadas.
O próprio painel declara as variáveis que mudam juntas. Perguntas não
pressupõem que toda execução termine em um resultado previamente escolhido.

## Troca, gravação e repetição

A troca pausa e salva o mundo anterior num checkpoint nomeado em IndexedDB.
Falha de gravação, fallback local ou mudança concorrente impedem a substituição.
A/B avançam com o mesmo relógio e recebem as intervenções posteriores comuns.
O botão de comparação genérica fica indisponível enquanto a aula está ativa.
Repetir reconstrói a receita original e reaplica as intervenções nos mesmos ticks.
Novo terrário volta ao fluxo normal. Checkpoints permitem recuperar a experiência
anterior; os nomeados não entram na rotação dos automáticos.

A sessão de aula usa payload v2 com referência de receita v1; sessões comuns
continuam v1. Checkpoint externo continua v2. Versões antigas rejeitam a sessão
nova, em vez de remover sua referência silenciosamente. Não use gravadores de
versões diferentes simultaneamente na mesma origem. Importação, reload e
avanço headless preservam a referência e os dois mundos.

## Implementação e conferência

Catálogo, receita, população, tratamentos e troca segura em módulos pequenos
em src/modules/lessons; apresentação/câmera em src/app/lessons. Integração
mínima no controlador legado, sem dependência adicional. Vite gera dist.
Ninho didático usa revisão2: revisão1 acionava migração e recriava as entradas.
O teste da rede real detectou essa falha antes da publicação.

38/38 testes dirigidos: sete receitas determinísticas e seus estados iniciais,
validação de versão, backup obrigatório, concorrência, codec, store, captura e
avanço/replay equivalente ao loop visível. TypeScript estrito e build333 módulos.
No IAB, preview isolado4183: sete cliques em2,03–2,91s, incluindo gravação e
apresentação; reload, repetição, A/B, duas entradas reais e recuperação da
SEMENTE-42 pelo backup. Console sem erros/avisos. Medição deste computador,
não certificação em hardware escolar. Evidência: validacoes/aulas-0.33.0.json.

P1.4 é a próxima etapa: roteiros docentes. Revisão por professores e piloto com
alunos exigem participantes reais e continuam separados da QA de software.
