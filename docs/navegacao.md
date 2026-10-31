# Navegação: modelo e implementação

## Equações

F_desejo = (v_desejada - v_i) / tau

F_repulsão = soma_j w_ij A max(0, 1/(d_ij + epsilon) - 1/(R + epsilon)) n_ij

F_total = F_desejo + F_repulsão + F_lateral

v_nova = limitar(v_i + dt F_total, v_max)

x_proposta = x_i + dt v_nova

x_nova = projetar_em_superfície(x_proposta), resolvendo a penetração residual.

n_ij aponta para longe do vizinho. w_ij = 2 se o vizinho tem alimento/prole
e i está vazia; nos demais casos vale 1. epsilon e um teto de força evitam
singularidades.

O motor atual usa o tick fixo como unidade interna. As constantes não são
medidas em newtons nem parâmetros calibrados para uma espécie.

## Decisões locais

O produto vetorial da direção com a normal do apoio gera o desvio lateral.
Sob contato persistente, a seed seleciona um ângulo de 30–90 graus por um
intervalo limitado. Contar ticks físicos, não frames de renderização.

Vazias cedem diante de cargas. Congestionamento persistente provoca recuo
ao nó anterior e reconsideração da rota/acesso. Operárias bloqueadas podem
alargar a passagem, incrementando sua largura e a revisão do terreno.

Esse alargamento muda a cavidade real do modelo. Ainda não é uma simulação
granular nem o transporte completo de terra para fora; isso é a etapa 2.

## Apoio e câmera

A componente Y não representa voo: muda o apoio em direção à parede.
O corpo usa a normal da superfície e a câmera acompanha esse apoio.
Física e desenho consultam o mesmo campo implícito do terreno.

Repulsão suave não garante velocidade positiva quando todo o espaço está
ocupado. Nessa situação é necessário ceder, recuar, mudar de rota ou cavar.

## Terreno arredondado e apoio

As cavidades são uniões suaves de esferas e cápsulas. O volume sólido usa
um campo de distância assinado; a malha é extraída por tetraedros e seus
vértices são reprojetados para reduzir a diferença visual/física.

Com normal n = gradiente(phi)/norma(gradiente(phi)):

v_tangente = v - n produto_escalar(v,n)

p_proposto = p + dt v_tangente

p_superfície = p_proposto - (phi(p_proposto) - margem) n

Limitar o deslocamento final por passo. Se a projeção ultrapassar o orçamento,
reduzir o passo antes de tentar novamente. O vidro também restringe o apoio.
Isso evita corrigir uma posição inválida com um salto até a parede oposta.

## Módulos

- sensors.ts: índice espacial e vizinhos locais por passo.
- social-forces.ts: forças e prioridade de carga.
- contact.ts: contato, recuo e alargamento por congestão.
- collision.ts: proteção residual contra penetração.
- surface-motion.ts: integração sobre a superfície e obstáculos.
- tunnel-motion.ts: apoio, tráfego subterrâneo e reconsideração de rotas.
- field.ts: campo implícito contínuo do solo, das cavidades e do vidro.
- surface-queries.ts: projeção e passos limitados sobre esse campo.
- polygonize.ts: malha arredondada com vértices ajustados ao campo.
- support-motion.ts: transições contínuas de apoio.

O núcleo não depende de Three.js e pode rodar em testes e Workers.
Na integração com THREE.Vector3, usar addScaledVector(velocity,dt).
Usar velocity.multiplyScalar(dt) diretamente alteraria a velocidade guardada.

## Recuperação nas laterais

A transição mede redução da distância até o destino, além dos ticks de contato.
Oscilar ou caminhar em círculos na parede não reinicia esse contador.
Uma busca local limitada encontra pontos apoiados no campo implícito;
cada segmento é amostrado para rejeitar passagens pelo solo ou pelo ar.
O desvio testa ambos os lados no plano tangente. Próximo do destino,
uma pequena tolerância libera o próximo ponto sem reposicionar o corpo.
A escolha de apoio considera outros setores da parede quando o atual falha.

Os testes incluem uma travessia entre lados opostos de um poço e uma
colônia congestionada por 1.500 ticks, medindo saída e tempo na mesma região.
Isso cobre regressões conhecidas, sem garantir fluxo para toda configuração.

## Referências e limites

- [Helbing e Molnár, Social force model](https://doi.org/10.1103/PhysRevE.51.4282).
- [Aguilar et al., Collective clog control](https://pubmed.ncbi.nlm.nih.gov/30115804/).
- [Poissonnier et al., Ant traffic](https://elifesciences.org/articles/48945).

O Social Force Model original é de pedestres. A adaptação, os parâmetros,
o contato antenal e a restrição 3D deste protótipo precisam de validação própria.
