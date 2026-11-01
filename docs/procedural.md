# Terrário procedural

A seed controla fluxos independentes para solo, ninho, flora e decoração. Repetir
seed e intervenções reproduz o experimento. “Novo terrário” escolhe outra seed.

## Modelo e arquivos

- `landscape/generate.ts`: bioma, lagoas, troncos, pedras e plantas.
- `landscape/types.ts`: estado serializável da paisagem.
- `landscape/species.ts`: necessidades e produção das oito espécies estilizadas.
- `landscape/dynamics.ts`: crescimento, estresse, água e decomposição por tick.
- `landscape/queries.ts`: relevo e contornos compartilhados com as colisões.
- `simulation/nest-generator.ts`: posições, profundidades e ligações variáveis.
- `soil/dig-direction.ts`: amostragem de solo local e direções em três eixos.
- `soil/projects.ts`: segmentos escavados progressivamente, preservando os anteriores.
- `renderer/LandscapeView.js`: apresentação da água e dos materiais.

Os módulos novos do modelo são TypeScript estrito. Parte do renderer ainda usa
JavaScript durante a migração gradual.

## Respostas ao ambiente

Samambaias e musgos preferem umidade e sombra. Cactos e suculentas toleram melhor
seca e luz intensa. Árvores, arbustos, gramíneas e flores têm perfis intermediários.
Cada planta guarda biomassa, saúde, hidratação e estresse. Alimento renovável depende
da planta que o produz, portanto um ajuste climático também altera a disponibilidade
para as formigas.

A água evapora mais com luz e ar seco; chuva repõe volume. A área molhada exibida é
a mesma evitada pelos agentes. Madeira absorve umidade e decompõe lentamente; suas
dimensões visuais e seu contorno de colisão encolhem juntos. Pedras escurecem quando
molhadas e podem acumular musgo. O solo e o sub-bosque mudam de tonalidade.

O parâmetro de aleatoriedade continua regulando as decisões dos agentes. Alterar
umidade ou luz não sorteia outra paisagem: o ambiente existente responde ao longo
dos ticks. Pausar também pausa a ecologia.

## Vidros e túneis

O ninho inicial varia a conectividade e distribui câmaras junto a lados diferentes.
Frentes podem avançar em X, Y e Z, curvar e ramificar. A malha é reconstruída em
Worker conforme a revisão do solo muda: uma cavidade só abre uma janela lateral
quando seu volume realmente alcança aquele vidro.

Clique repetidamente em “Vista lateral” para alternar direita, fundo, esquerda e
frente, começando perto da câmara da rainha. “Ver túneis internos” torna a terra
transparente apenas para observação; não muda colisões. Na primeira pessoa o solo
volta a ficar opaco.

## Compatibilidade e limites

Saves antigos mantêm seu ninho e recebem a superfície antiga compatível; não são
regenerados sobre as formigas. Para experimentar a nova geração, crie um terrário
ou inicie a seed novamente. A seed de um save antigo não substitui sua geometria.

O relevo é suave e de pequena amplitude. Água, fisiologia e decomposição são
modelos exploratórios, sem calibração por espécie. Pedras pequenas são decoração;
troncos usam contornos aproximados. Não há ainda transporte de sedimentos por água,
crescimento estrutural de árvores nem física granular de cada grão. O primeiro
buraco escavado durante a fundação faz parte da etapa 5; o protótipo ainda começa
com câmaras.
