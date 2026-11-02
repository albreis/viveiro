# Tour de primeira visita

P1.2A, versão 0.32.0. Guia em português para chegar à visão de uma formiga,
com teclado ou mouse. O critério com aluno novo em menos de dois minutos
continua pendente de participante real; a QA técnica não substitui esse teste.

## Comportamento

O cartão aparece automaticamente somente numa primeira visita sem experimento
salvo nem escolha anterior. Quem já tem terrário salvo encontra “Tour guiado”
no cabeçalho e pode abri-lo quando quiser. Fechar, pular ou concluir guarda
apenas a escolha local. Falhas de armazenamento não impedem fechar o guia.

Os passos são: observar, escolher uma habitante, ativar primeira pessoa e
aprender a retornar. O guia só confirma a entrada quando o controle de saída
fica visível pela câmera real. Avançar sem entrar não fabrica uma conclusão.
Com a colônia vazia, informa a ausência e permite fechar; não cria formigas.

“Mostrar a lista” e “Mostrar 1ª pessoa” rolam e focam o controle existente.
O cartão escolhe um canto livre para não encobri-lo. Em telas pequenas tem
altura limitada e rolagem própria. Não há foco preso num modal: a lista e os
botões da aplicação permanecem acessíveis durante o guia.

Tab navega, Enter ativa os botões, setas dentro do cartão mudam o passo.
Esc fecha o guia; outra pressão de Esc retorna da formiga. Um diálogo de
ajuda aberto mantém seu próprio Esc. Espaço em listas, botões, campos e
edição de texto não aciona a pausa global. O guia preserva a tecla de espaço
para seus próprios controles.

Não reinicia mundos, cria intervenções ou altera a seed, parâmetros, relógio
ou conteúdo dos checkpoints. O relógio continua obedecendo aos controles
normais do usuário. A preferência do guia fica fora do experimento/replay.

## Código

- src/modules/onboarding: estado tipado e posicionamento do cartão.
- src/app/tour: textos, HTML estático e apresentação.
- src/app/tour-controls.ts: eventos, confirmação da câmera e abertura.
- src/services/tour-preference.ts: escolha local, sem telemetria.
- src/app/keyboard.ts: proteção de atalhos durante edição/seleção.

Os módulos novos têm responsabilidades separadas; nenhuma dependência nova.

## Conferência técnica

22 testes dirigidos passaram, incluindo sete novos casos de tour/teclado,
relógio, recuperação de sessão, codec e apresentação leve. Build324 módulos.
Não é uma nova execução da suíte biológica completa: o modelo não mudou.

Navegador real, dev emG/4173: SEMENTE-50088/D62,5 em pausa,14 adultos;
o guia não abriu automaticamente. Fluxo por teclado confirmou a câmera,
fechou o guia e retornou sem avançar o experimento. Console limpo.

Preview isolado em127.0.0.1:4182: oferta automática, foco inicial no título,
pular/recarregar sem repetição, reabertura e clique em primeira pessoa
confirmados. O cartão mudou para o lado esquerdo e não sobrepôs o botão.
A QA foi pausada no dia0,5 e não tocou no armazenamento da porta4173.
Esc fechou primeiro o guia e depois a câmera. Console limpo.
O preview4182 e a aba10 foram encerrados após a conferência; o dev4173 foi mantido.

## Aceite restante

Convidar participante que nunca tenha usado o Viveiro e, sem orientar os
cliques, observar se chega à primeira pessoa em até dois minutos.
Registrar aparelho, navegador, passos, tempo e dificuldades com consentimento
adequado. Não foi realizado estudo com aluno nesta entrega.

## Publicação

0.32.0 publicada no Site privado original e no público separado, fonte/tag
0b6bed31e8aafa7c4357c11138d35f003ea64542. O original permanece privado.
[Versão pública](https://viveiro-laboratorio-publico.everaldodev.chatgpt.site/releases/v0.32.0/).
QA real repetiu guia manual, primeira pessoa, retorno e reload emD2,6 sem
repetição automática; console limpo. Catálogo mantém quatro versões e11
assets da nova tag conferem por SHA-256 sem cookies/Authorization.
IDs e arquivos em docs/CONTINUAR.md; evidência pública em
docs/validacoes/publicacao-0.32.0.json.
