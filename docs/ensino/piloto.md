# Instrumentos do piloto escolar · P1.7

**Preparado para aplicação.** Nenhuma turma, resposta ou resultado registrado.
Antes de aplicar, combine com a escola o roteiro, o público, as autorizações
e quem terá acesso aos registros. A participação na avaliação deve ser
voluntária e não alterar a nota escolar.

## Procedimento proposto

1. Escolha 2–3 turmas e fixe a versão do Viveiro, a duração, os roteiros e as
   adaptações de acesso. Registre por turma o código, a versão, os cenários
   usados, o tipo de equipamento, as condições de rede e as interrupções.
   Use os mesmos materiais e tempo quando possível; descreva diferenças.
2. Atribua a cada participante um código aleatório reutilizável nos três
   instrumentos, sem derivá-lo do nome ou matrícula. Aplique o pré-teste
   antes de apresentar os cenários, sem gabarito ou explicação prévia.
3. Execute as aulas de trilhas/vento, entradas/ar e seed/intervenção
   do [guia docente](README.md). Anote o dia do modelo e o que muda entre A e B.
4. Depois da atividade, aplique o pós-teste nas mesmas condições e a SUS
   individualmente. Use os dez itens, na ordem, da
   [versão brasileira de Lourenço et al. (2022), Tabela 1](https://doi.org/10.5294/aqui.2022.22.2.8)
   com respostas de 1 (discordância forte) a 5 (concordância forte). Registre
   a versão usada. Não interprete cada item separadamente como uma subescala.
5. Conte participantes convidados, presentes, que optaram por responder
   e formulários faltantes. Compartilhe só estatísticas agregadas e contexto
   autorizado. Guarde o CSV de respostas em local restrito, fora do Git e de
   qualquer pasta de build. O CSV não deve conter nomes, e-mails, matrículas,
   comentários livres, datas de nascimento nem identificadores de dispositivos.

## Pré e pós-teste

Use as mesmas seis perguntas e instruções nos dois momentos. Peça respostas
curtas. Corrija cada pergunta como 0 ou 1 pela rubrica abaixo; compare apenas
os pares completos. Questão em branco num teste entregue vale 0. Se o teste
todo não foi entregue, deixe a nota vazia. Não mostre o gabarito antes do pós.

| Pergunta | Vale 1 ponto quando a resposta inclui |
| --- | --- |
| 1. Como surge uma trilha se nenhuma formiga dirige as outras? | Regras locais das operárias e reforço do rastro quando há passagem. |
| 2. Depois de retirar a fonte de alimento, por que uma trilha pode perder força? | Menos reforço e dissipação do feromônio (evaporação ou difusão). |
| 3. Para testar efeito do vento, o que A e B devem ter em comum? | Mesmo estado inicial e demais controles, com medições no mesmo dia do modelo. |
| 4. Para examinar ventilação, quais medições você compara antes de concluir? | O₂ e/ou CO₂ em posições e momentos correspondentes, com atenção à mudança de geometria entre A e B. |
| 5. O que a mesma seed controla quando só B recebe comida? | A origem pseudoaleatória/condição de partida; a intervenção pode fazer os resultados divergirem. |
| 6. Um padrão no Viveiro prova que ocorrerá em uma espécie real? Por quê? | Não; é preciso confrontar as hipóteses e saídas com observações reais compatíveis. |

Se dois revisores puderem corrigir uma amostra, fixem a regra de desempate antes
de olhar os resultados agregados. A repetição das perguntas pode favorecer o
pós-teste. Sem grupo de comparação, não atribua uma diferença ao software.

## Registro e análise

Use uma cópia do [modelo CSV vazio](piloto-respostas.csv), UTF-8 e vírgulas.
O arquivo aceita uma linha por participante que entrou na análise, com um
código de turma (`T01`) e de participante (`P501`, por exemplo). Registre
`pre` e `pos` de 0 a 6, e `sus01` a `sus10` de 1 a 5. Preserve células
vazias para dados ausentes; não as preencha com 0, 3 ou médias.

No checkout, execute `node scripts/summarize-pilot.ts CAMINHO.csv`. O
relatório sai no terminal e não inclui os códigos ou respostas. Para a
[SUS de Brooke](https://hci-studies.org/methods-and-measures/downloads/SUS_Brooke1996.pdf),
a soma dos itens reorientados é multiplicada por 2,5, dando uma nota 0–100
que não é porcentagem. O script exclui formulários parciais e informa quantos.
O ganho é pós menos pré por pessoa; média e desvio padrão amostral são
descritivos. Sem respostas válidas, a média fica ausente.

### Relatório após aplicação

- Versão e cenários; turmas efetivas, duração e condições de execução.
- Número de formulários completos/parciais/ausentes e de pares pré/pós.
- Média e desvio padrão da SUS; comparar a média ao alvo **>70** do Viveiro.
- Pré, pós e ganho pareado, com denominadores e perdas. Descrever diferenças
  de aplicação e efeitos de repetição. Registrar também resultados abaixo do alvo.
- Dificuldades observadas, correções sugeridas e limitações. Não concluir
  P1.7 a partir do modelo vazio, de casos fictícios ou de uma única turma.
