# Suporte local do teto — etapa 7C

A escavação altera a geometria que sustenta o solo. Esta etapa acrescenta amostras locais de teto, uma comparação reduzida entre carga e capacidade, dano persistente e desprendimento de pequenos agregados. É um modelo exploratório de capacidade, sem calibração geotécnica; não resolve equilíbrio elástico/plástico 3D nem as cadeias de força de cada grão.

## Geometria observada

Três seções por aresta consultam o mesmo campo implícito usado no terreno. Um raio vertical encontra o teto; depois são estimados o vão transversal, a espessura de solo contínuo acima, a profundidade até a superfície e seis contatos representativos dos apoios laterais. Espessura é sondada até 1,5 unidade; raios laterais alcançam até duas unidades em cada direção. São limites de resolução declarados.

A consulta exclui terra solta, que permanece na dinâmica granular. Uma cavidade acima pode tornar o teto fino; um corte lateral pode reduzir o apoio. Alargamento, avanço de frente, nova câmara e cortes de erosão alteram nest.revision e invalidam o cache de geometria. Água e integridade são reavaliadas mesmo quando a geometria não mudou. Nenhuma formiga recebe estes dados globais.

## Carga e capacidade reduzidas

S é a saturação dos poros amostrada perto do teto, φ vem do controle de atrito e I representa o material remanescente após desgaste. As unidades são internas:

- Densidade de referência ρ = 1 + 0,7S; g = 0,0016.
- Tensão de cobertura σ = ρgH, onde H é a profundidade.
- Pressão de poros aproximada u = 0,9gH * max(0, (S-0,85)/0,15).
- Tensão efetiva aproximada σ' = max(0, σ-u).
- Coesão c = [0,0003 + 0,0015 * 4S(1-S)] * max(0,02,I).

O termo 4S(1-S) apenas representa um máximo intermediário de coesão; não é uma curva de sucção ou uma conversão de umidade relativa. A subida de u perto da saturação é uma hipótese ilustrativa, sem um solver de pressão hidráulica.

Para vão L, espessura t e fração de apoio A:

Cisalhamento = 2(c + σ' tan φ)tA/L.

Flexão = 6ct²/L².

Carga = σ(1 - 0,45A).

Capacidade = cisalhamento + flexão; margem = capacidade/carga.

A espessura mobilizada é limitada a min(t, 0,65L+0,08). A expressão combina analogias de cisalhamento/fricção e uma placa coesiva; o fator de redução de carga por apoio aproxima redistribuição lateral. Não é uma dedução validada para solo granular arqueado. Tensão, coesão e margem não devem ser apresentadas como medições ou fatores normativos de segurança.

O desgaste anterior continua reduzindo I conforme água local extrema e largura. Ele modifica a capacidade; o simples contador de integridade abaixo de 0,4 deixou de disparar automaticamente um colapso natural. A perturbação manual de galeria vazia é mantida como experimento separado.

## Dano, desprendimento e conservação

A cada 50 ticks, dano cresce em 0,08 * max(0,1-margem). Sobrecarga persistente pode atingir dano um; uma região estável não acumula dano novo. Dano é associado à seção e reaproveitado enquanto o teto permanece próximo. Um desprendimento muda a geometria e obriga a consultar o suporte novamente. Existe intervalo de 500 ticks por aresta e no máximo um desprendimento por atualização para limitar cascatas numéricas nesta aproximação.

A região removida é uma esfera pequena junto ao teto, com raio limitado pelo vão/espessura. Uma quadratura de 8³ pontos mede somente o sólido ainda presente dentro da esfera. O mesmo volume é debitado como eroded e criado como massa/volume do agregado solto. Aberturas prévias não são contadas novamente; cortes próximos e entulho existente impedem repetir a mesma liberação. O balanço conserva a quantidade discretizada, embora a quadratura não forneça o volume analítico exato do sólido.

O agregado nasce em uma bolsa de ar onde seu raio cabe, recebe gravidade/contato/atrito já existentes e pode ser retirado por operárias pelo mesmo fluxo físico de reparo. Para preservar a navegação, a liberação é adiada se uma formiga ocupa a bolsa. Não há esmagamento ou soterramento de agentes nesta versão. Não há remoção instantânea de material nem teleporte de corpos pelo solver estrutural.

## Interface e arquitetura

Módulos TypeScript pequenos separam tipos, geometria, capacidade, liberação e atualização. O estado fica em soil.structure e é compartilhado pelas colônias, persistido nos snapshots. O painel informa amostras sob sobrecarga, margem mínima e desprendimentos. A câmera pode aproximar o teto com menor suporte. Fissuras instanciadas representam dano acumulado, sem alterar colisão. O fragmento e o corte são geometria física, não apenas efeitos visuais.

O ensaio determinístico de duas galerias sobrepostas produziu espessura estimada 0,1, vão 1,2 e margem aproximada 0,43 na galeria inferior. Houve desprendimento no tick 1100, com volume discretizado 0,000823875 e erro de balanço zero. A galeria superior permaneceu com margem maior. São saídas desse cenário, sem equivalência direta com unidades reais ou uma espécie.

## Verificação e limites

Testes dirigidos cobrem vão, espessura, apoio, água e atrito; afinamento real por outra cavidade; dano e desprendimento; não duplicação do sólido; queda granular; adiamento perto de corpos sem deslocá-los; restore com futuro idêntico; coleta conservativa por uma operária. O fixture usa revisão de geometria atual; revisão legada é tratada separadamente pelo migrador existente.

A suíte completa aprovou 130/130 testes em 494952 ms; sete estruturais finais com restore fortalecido também passaram. TypeScript/Vite finais aprovados. No navegador, seed a no dia240,1: 72 amostras, uma sob sobrecarga, margem mínima0,95× e um desprendimento natural. Fissura, câmera interna, recarga e ausência de novos erros foram conferidas. Faltam discretização volumétrica de todo o solo compacto, contatos/coerência reais entre grãos, solução de esforços 3D, propriedades dependentes de sucção e granulometria, propagação física de ruptura, reforço por raízes, esmagamento e calibração. Esta etapa entrega o acoplamento local implementável, preservando essas limitações e a necessidade de dados.

## Referências e dados externos

[Buarque de Macedo et al., 2021 — Unearthing real-time 3D ant tunneling mechanics](https://doi.org/10.1073/pnas.2102267118) estudou escavação e redistribuição de forças em um meio granular, incluindo arqueamento. O artigo e o [conjunto de dados/código CaltechDATA](https://doi.org/10.22002/D1.1996) são bases para uma futura comparação quantitativa; o algoritmo desta etapa não reproduz aquele DEM.

[Gravish et al., 2013 — Climbing, falling, and jamming during ant locomotion in confined environments](https://pubmed.ncbi.nlm.nih.gov/23690589/) também investigou combinações de tamanho de partículas e água em massa no substrato. Água em massa, saturação dos poros e umidade relativa são medidas diferentes; nenhum percentual desse experimento é aplicado diretamente ao slider do terrário.

Antes de calibrar, são necessários densidade, porosidade, granulometria, curvas de retenção, coesão/atrito e geometria/ruptura observadas, com definição da escala de comprimento e tempo. Coeficientes arbitrários não serão rotulados como parâmetros medidos.
