# Acesso geométrico à escavação no motor do Viveiro

07/11/2026. Branch `codex/escavacao-acesso-geometrico-viveiro`, criada de
`origin/main` em `d88c31e`. Implementa o pedido do mantenedor de transferir a
hipótese de acesso ao motor real, preservando a morfologia.

## O que foi transferido

O [PR #130](https://github.com/albreis/viveiro/pull/130) estudou a remoção do
filtro adicional de acesso na arena planar. Esse filtro não existia no
`World` 3D. O terrário tinha outras restrições: uma cota por projeto que
contava também quem já saíra para transportar terra, uma única mordida por
projeto/tick e um único destino aproximado para a frente.

A revisão **Narbonne v3** substitui essas restrições por contato geométrico:

- Procura solo real à frente, incluindo a parede da câmara onde começa uma
  nova galeria. Amostras cobrem diferentes alturas da face, sem cotas de equipe.
- Exige apoio, alcance corporal e ausência de sobreposição para trabalhar.
  Não basta compartilhar o mesmo nó lógico. Vidro não é solo escavável.
- Permite trabalho de mais de uma operária por ciclo quando os corpos cabem.
  Cada agente tem sua guarda de mordida para impedir chamadas duplicadas.
- Caminha até a face com apoio e colisões. Quando o acesso fica ocupado ou
  o desvio falha, recua/transporta sua carga. Não salta até uma vaga.
- Não conta transportadoras distantes como pessoas trabalhando na face.

Não altera o porte, marchas, penalidades de carga, alimentação, calendário,
comprimento por mordida ou capacidade de carga da v2. Não multiplica volume
por 1,6. O módulo de reparo foi separado sem mudar suas regras.

## Compatibilidade

O perfil salvo fixa o comportamento. Novos terrários usam
`messor-narbonne@3`; saves v1/v2 e outros perfis continuam com as regras
anteriores. O seletor descreve a revisão em português e inglês. A versão do
pacote continua 0.47.0; esta entrega não cria tag, release ou depósito Zenodo.

Módulos novos: `soil/access-rule.ts`, `soil/front-access.ts`,
`soil/digging.ts` e `soil/repair.ts`. A consulta de ocupação para uma posição
futura reaproveita o índice espacial, sem a exceção que permite escapar de
sobreposições durante o movimento normal.

## Verificação técnica

Os testes cobrem contato em alturas distintas, ausência de apoio, corpos
sobrepostos, trabalho paralelo, guarda por operária, transportadoras fora da
face, lotação física, recrutamento padrão/estigmérgico e término do segmento.
O ciclo completo usa `World.step`: duas cargas são entregues fora do ninho,
sem saltos, com balanço de terra e futuro idêntico após salvar/restaurar.

O ensaio de integração usa o mesmo `World.step` da interface: grupos
preparados de 50/100/200 operárias, duas seeds, pares Narbonne v2/v3 e 2.000
ticks por execução. Cada par começa com o mesmo estado físico e RNG (hash
conferido, removendo apenas a identificação da revisão). Não há rainha,
prole ou predação; alimento inicial adicional de 200 u.; ar a 24 °C, umidade
68% e vento zero. Outros processos biológicos e ambientais continuam ativos.

Os corpos são posicionados primeiro nas câmaras sem sobreposição; quem não
cabe começa na superfície. A distribuição é igual dentro de cada par, mas
não igual entre tamanhos de grupo. **Este lote testa integração e diferenças
pareadas; não estabelece uma lei de escala com a população.**

Reprodução:

```powershell
node scripts/check-dig-access.ts .runtime/novo-acesso.json 2000
node scripts/qa/dig-access.mjs
npm test
npm run build
```

O CLI exige um arquivo novo e arquiva o resultado antes de rejeitar um
balanço/deslocamento fora do limite, preservando também ensaios desfavoráveis.

## Alcance científico

Esta é uma alteração exploratória de mecanismo. Buhl já influenciou a escolha
da hipótese; continua dado de desenvolvimento, sem voltar a ser validação
independente. A revisão anterior e os resultados que a desfavorecem continuam
arquivados. A inferência de dupla restrição é hipótese, não fato biológico.

O lote do terrário usa ticks e volumes do modelo. **Não é uma repetição das
72 horas físicas da arena nem uma nova curva em cm³ de Buhl.** O terrário
mantém sua fisiologia anterior: não recebeu silenciosamente a fadiga de
escavação, a duração de coleta ou a conversão de tempo da arena. Essas pontes
exigem protocolo próprio antes de qualquer alegação quantitativa.

A forma/alcance dos corpos, discretização da face, volume aproximado das
cápsulas e ordem sequencial das mordidas continuam limitações do modelo. O
[ODD](../odd/submodelos.md) registra as regras. B7 e a calibração não são
encerrados por estes testes.
