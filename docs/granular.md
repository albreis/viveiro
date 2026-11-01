# Terra solta dinâmica — etapa 7A

Esta entrega aplica dinâmica a agregados de terra já removida ou caída. Cada porção é uma esfera com volume, posição e velocidade. O solo compacto continua representado pelo campo implícito; não há discretização de todos os grãos nem cálculo de cadeias de força do solo intacto. A etapa 7 permanece parcial: umidade/capilaridade/gases e o modelo estrutural dependem de 7B/7C e de calibração.

## Dinâmica e unidades

A propriedade mass herdada do balanço é um volume interno aproximado. O raio é r = cubert(3*mass/(4*pi)); usa-se densidade unitária implícita, não quilogramas medidos. A gravidade aplica aceleração g = 0,0016 por tick ao quadrado. Cada tick tem quatro subpassos de 0,25. Velocidade é limitada a 0,008 unidade por tick para manter estabilidade e continuidade com a locomoção.

Entre agregados, a força normal é uma mola dissipativa: F_n = max(0, 0,08*penetração - 0,3*v_rel_normal)*massa_reduzida. Impulsos opostos preservam o momento linear do par. O impulso tangencial é limitado por mu*impulso_normal, segundo uma aproximação de atrito de Coulomb. Contatos coincidentes recebem direção determinística e finita; não há divisão por zero.

No solo e no vidro, o mesmo campo usado pelas formigas fornece distância e normal. O raio finito do agregado define o contato. Atrito é resolvido antes do avanço quando já há apoio, evitando deslizamento numérico em uma inclinação estável. A restituição é pequena em impactos e nula nas aproximações lentas. Correção de penetração e deslocamento são limitados; não há lançamento instantâneo entre apoios.

O controle Repouso da terra define theta entre 15 e 55 graus; mu = tan(theta). A condição idealizada de equilíbrio em um plano é tan(inclinação) <= mu. Esse theta é um parâmetro experimental do material, não uma medição inferida da umidade do ar. Parede curva, colisões e discretização alteram o resultado; o controle não garante estabilidade de um teto.

## Queda, recursos e navegação

A erosão existente abre uma porção no teto e libera o agregado logo abaixo dele, com espaço para seu raio. Antes, o bloco já aparecia perto do piso; agora ele cai e se acomoda. A regra que decide a falha do teto ainda é heurística, baseada em integridade e umidade global. Ela não se tornou uma análise geotécnica validada.

Material não desaparece durante o movimento. O balanço permanece removido + erodido = carga + depósitos + terra solta. Reparar reduz o volume do mesmo objeto e transfere exatamente esse valor para a carga. O raio diminui e o agregado pode acomodar-se novamente. A reparadora reajusta gradualmente o próprio apoio antes de continuar a escavação; isso evita perder o contato quando o material cai ou encolhe. O sólido móvel é consultado pela navegação, enquanto as operárias mantêm seus limites de passo.

A geração automática de um colapso ainda evita proximidade de agentes. Não há soterramento, fratura de grãos, rotação granular, pressão de poros ou transmissão bidirecional de impulso entre um agregado e o corpo de uma formiga. Os agregados são macroscópicos; uma porção de um colapso não equivale a um grão real.

## Arquitetura e apresentação

- granular/types: estado persistente, raio e parâmetros numéricos.
- neighbors: células espaciais para candidatos locais, sem duplicar pares.
- contacts: força normal e atrito entre agregados.
- support: gravidade, apoio, atrito, integração e limitação de passos.
- update: uma atualização global por tick, métricas de movimento e energia.
- GranularView: instâncias esféricas com o mesmo raio e posição da colisão.
- granular-controls: parâmetro do usuário, indicador e replay.

As esferas móveis ficam fora da malha estática do solo e são desenhadas separadamente, evitando cópias antigas da terra em movimento. Cortes e túneis continuam sendo reconstruídos no Worker. A renderização de agregados tem limite de 512 instâncias; o modelo e seu balanço não descartam volumes para atender esse limite. Custo e memória em execuções longas precisam de benchmark na etapa 8.

O painel distingue quantidade de agregados e quantidade atualmente móvel. A intervenção de ângulo é persistida e reaplicada pelo replay. Snapshots guardam velocidades e contadores. Os depósitos externos continuam sendo montes visuais, agora posicionados na altura em que foram depositados; sua dispersão granular ainda não foi implementada.

## Verificação

Testes analíticos e de integração verificam queda em apoio plano, repouso/deslizamento em um plano inclinado conforme o atrito, momento do par, dissipação, finitude em centros coincidentes, pares em células vizinhas, volume conservado, queda dentro de uma galeria e restore com o mesmo futuro. As regressões de reparo e apoio das operárias continuam exigindo transporte real e passos limitados.

No navegador, a seed a foi preservada. No dia 171, a intervenção soltou aproximadamente 0,047 unidade cúbica; o painel mostrou um agregado em movimento. No dia 172,6, ele estava acomodado e uma operária já havia removido parte, deixando aproximadamente 0,025. O ajuste para 20 graus foi registrado no diário e no replay. Esses valores descrevem essa execução exploratória.

## Referências e dados externos

[Alonso, Hovi e Herrmann, 1998](https://doi.org/10.1103/PhysRevE.58.672) investiga um modelo em rede de pilhas granulares com dissipação/aderência e efeitos da discretização. [Zhang et al., 2010](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2009jf001620) usa autômatos e transições gravitacionais com limiar de repouso em sedimentos. Essas fontes motivam aproximações locais, não validam estes coeficientes ou uma transposição direta de dunas para um formigueiro.

[De Macedo et al., 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8433525/) combina tomografia e simulação granular de escavação por formigas, destacando redistribuição de forças e arqueamento. O protótipo ainda não reproduz essas cadeias de força. [Gravish et al., 2013](https://pmc.ncbi.nlm.nih.gov/articles/PMC3683784/) mede escavação/locomoção em substratos com teor de água controlado; esse teor não é a umidade relativa do slider.

Para calibrar faltam densidade, granulometria, forma, atrito/rolamento, coesão, porosidade, teor de água, compactação e ensaios de repouso/ruptura, além de escala espacial e temporal por espécie. Registrar unidades, incerteza e condições. O ganho desta etapa é terra solta com dinâmica observável e orçamento conservado; solo inteiro granular e engenharia estrutural continuam pendentes.
