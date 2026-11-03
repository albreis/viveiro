# Acessibilidade progressiva · 0.37.0

P1.6B1 entrega melhorias verificadas de teclado, contraste e alternativas textuais.
P1.6 permanece aberto: importação em planilha, leitores de tela, auditoria ampla
WCAG2.1AA e Lighthouse >90 ainda não foram concluídos.

## Usar sem mouse

- Tab oferece atalhos para conteúdo, câmera, ambiente/intervenções e dados.
- No terrário focado, setas giram a visão geral ou olham em primeira pessoa;
  +/− aproximam/afastam a visão geral e Home centraliza. Tab sai normalmente.
- O seletor de formiga e Enter no botão abrem a primeira pessoa e levam o foco
  à câmera. Sair devolve o foco ao botão. Esc funciona como antes; dentro de
  um diálogo, fecha apenas o diálogo, preservando o estado da câmera.
- Os botões de vista e A/B expõem estado pressionado. Home sincroniza a vista.
- **Intervir por coordenadas · teclado** fornece alimento, planta, predador e
  odor pelos mesmos tipos/API do mouse. X/Z finitos e dentro dos limites reais
  são obrigatórios; o navegador indica o campo inválido. O diário mostra a
  aceitação pelo modelo. Não há deslocamento de agentes nem recursos gratuitos.
- Espaço em summary, link, formulário, região rolável e diário fica com o
  controle, sem alternar a pausa global. Atalhos não interferem em diálogos,
  eventos já tratados ou combinações com Ctrl/Alt/Meta.

A câmera altera só apresentação: não acessa RNG, relógio nem estado de agentes.
A intervenção continua passando pela gravação, comparação e replay existentes.

## Leitura e contraste

Os componentes usam a cor auxiliar compartilhada --muted com contraste maior,
preservando texto claro em botões escuros. Resumos, select, regiões e links têm
foco visível. O gráfico ganha intervalo, início/fim, mínimo/máximo e identificação
de A/B em texto, descrevendo o mesmo recorte de censos. O CSV conserva os dados
observados; os mapas mantêm os resumos textuais de clima e gases existentes.
Glyphs decorativos não repetem rótulos. O diálogo de ajuda tem nome acessível;
a cena é imagem nomeada dentro de grupo focável com instruções de teclado.

Foram calculadas razões sobre as cores e fundos sólidos efetivos do DOM.
A leitura inicial sinalizou141 candidatos entre260 textos; incluía decorações,
portanto não é contagem de violações WCAG. Na QA final da0.37.0, os estados
principal(259), ajuda(272) e catálogo(367) não tiveram candidato abaixo do limiar
nessa checagem. Ela não cobre canvas, imagens, gradientes complexos, todos os
estados possíveis nem a avaliação completa. Não é Lighthouse ou certificação.

O critério de contraste de texto normal usa4,5:1 e o de texto grande3:1,
conforme [W3C](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html).
A alternativa de teclado segue o propósito do
[critério2.1.1](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html).

## Validação e limites

-28 testes dirigidos aprovados: limites da câmera/visão, ausência de NaN,
  propriedade da tecla Espaço, coordenadas, resumo do recorte e regressões de
  tour, CSV, aulas e desempenho. TS estrito e build345 módulos.
- IAB/4188 isolado: Espaço abriu painéis mantendo pausa; intervenção real em
  X1/Z1 registrada no diário; X99 rejeitado com foco no campo; primeira pessoa,
  setas e foco; Esc em ajuda não encerrou a primeira pessoa; saída devolveu foco;
  atalho focou a câmera e Home atualizou aria-pressed da perspectiva.
- Em320×800, largura útil305 e scrollWidth305: sem rolagem horizontal da página.
  O diário se reorganiza e continua rolável por teclado. Viewport normal
  restaurado após o ensaio. Isto não é ensaio real de zoom400% ou leitor de tela.
- Console sem avisos/erros. Biologia, navegação, persistência e sequência de
  decisões não foram alteradas; a versão registrada nas observações avança.

O serviço oficial PageSpeed/Lighthouse recusou a medição de base da0.36.0 com
HTTP429 (cota diária esgotada). Nenhuma nota foi produzida. Não repetir chamadas
nessa janela nem substituir essa falha por resultado sintético. Nova tentativa
somente em uma execução permitida; registrar versão, URL e relatório reais.
A pontuação [não inclui todas as verificações manuais](https://developer.chrome.com/docs/lighthouse/accessibility/scoring)
e não comprova conformidade integral por si só.

Nenhuma planilha instalada apareceu no inventário consultado e não havia sessão
Excel conectada. O CSV foi lido antes por Python; isso não foi promovido a teste
em aplicação de planilha. Não foram instalados programas ou criados arquivos
na conta Google do usuário apenas para esse ensaio. P1.6B2 permanece aberto.

## Publicação confirmada

Fonte/tag0.37.0:30cc14ea82d8c7a20d0541641e07e5e3ad0cb432;
PR [#49](https://github.com/albreis/viveiro/pull/49), base #48.
Site privado original e galeria pública publicados com audiências preservadas.
HTTP anônimo conferiu27 arquivos nãoHTML por SHA256; URLs de ensino200.
QA pública conservou SEMENTE-42/D2,64 em pausa, atalho focou a câmera,264 textos
sem candidatos abaixo do limiar da checagem limitada e console limpo.
Isso não substitui Lighthouse/WCAG ou ensaios com leitores de tela.
IDs/proveniência em validacoes/deploy-0.37.0.json e publicacao-0.37.0.json.

## Reavaliação de desenvolvimento0.46.0

Auditoria nativa em03/11/2026: principal, ajuda, laboratório com editor aberto,
galeria e principal a320px. Sem controles visíveis sem nome ou IDs duplicados.
O texto da comparação A/B tinha razão2,83:1: passou a usar --muted e fonte12px.
Após a correção, nenhum candidato abaixo do limiar nos textos sólidos examinados.
Em320px a largura do documento foi305px. Primeira pessoa, setas, saída/foco e
Escape na ajuda conferidos.27 testes dirigidos e build estrito aprovados.
A checagem exclui canvas, fundos complexos e alguns estados: não certifica WCAG.

Medições sequenciais com a aula de herança em movimento, após avançar cinco dias:
58,1fps no completo(44operárias na leitura) e59,2fps no leve(45), P95 de16,8ms,
10s por amostra. Computador i5-1135G7, IrisXe,15,8GiB. Não é comparação controlada,
carga máxima ou ensaio de Chromebook. O modo leve reduziu triângulos, mas não
reduziu chamadas de desenho nesse cenário. Nenhuma mudança biológica.

Nova chamada permitida ao PageSpeed oficial, para v0.45.0 pública em03/11 às
21:53UTC, também retornou429. Não produziu nota nem foi repetida; aguardar até
04/11 às21:53:59UTC antes de nova tentativa permitida. Leitor de tela, zoom real,
aplicação de planilha e equipamento escolar permanecem pendentes.
Evidência: [auditoria](validacoes/auditoria-interface-0.46.0.json).
